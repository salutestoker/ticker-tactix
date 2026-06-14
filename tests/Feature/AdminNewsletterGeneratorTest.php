<?php

namespace Tests\Feature;

use App\Jobs\DispatchNewsletterDeliveryJob;
use App\Jobs\SendNewsletterDeliveryEmailJob;
use App\Mail\NewsletterSubscriptionEmail;
use App\Models\NewsletterDelivery;
use App\Models\NewsletterGeneration;
use App\Models\User;
use App\Services\Newsletters\NewsletterRecipient;
use App\Services\Newsletters\NewsletterRecipientResult;
use App\Services\Newsletters\StripeNewsletterSubscriberService;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Mockery;
use Symfony\Component\Mailer\Exception\TransportException;
use Tests\TestCase;

class AdminNewsletterGeneratorTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_save_newsletter_generation_values(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $values = $this->newsletterValues(['date' => '2026-06-09']);

        $this->actingAs($admin)
            ->post(route('admin.newsletter-generator.store'), [
                'values' => $values,
            ])
            ->assertRedirect(route('admin.newsletter-generator'));

        $generation = NewsletterGeneration::firstOrFail();

        $this->assertSame($admin->id, $generation->user_id);
        $this->assertSame(NewsletterGeneration::TEMPLATE_NYSE_MARKET_ENVIRONMENT, $generation->template);
        $this->assertEquals($values, $generation->values);
    }

    public function test_generator_uses_latest_saved_generation_as_default(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $scheduledBy = User::factory()->create(['name' => 'Scheduler']);

        NewsletterGeneration::create([
            'template' => NewsletterGeneration::TEMPLATE_NYSE_MARKET_ENVIRONMENT,
            'values' => $this->newsletterValues(['date' => '2026-06-08']),
        ]);

        NewsletterGeneration::create([
            'template' => NewsletterGeneration::TEMPLATE_NYSE_MARKET_ENVIRONMENT,
            'values' => $this->newsletterValues([
                'date' => '2026-06-09',
                'marketCommentary' => 'Most recent generated commentary.',
            ]),
        ]);

        NewsletterDelivery::create([
            'template' => NewsletterGeneration::TEMPLATE_NYSE_MARKET_ENVIRONMENT,
            'user_id' => $scheduledBy->id,
            'stripe_product_id' => 'prod_test_newsletter',
            'subscription_statuses' => ['active'],
            'subject' => 'Scheduled NYSE ETF Environment',
            'preheader' => 'Daily market read.',
            'values' => $this->newsletterValues(),
            'image_disk' => 'local',
            'image_path' => 'newsletter.png',
            'scheduled_for' => now()->addHour(),
            'status' => NewsletterDelivery::STATUS_SCHEDULED,
        ]);

        $this->actingAs($admin)
            ->get(route('admin.newsletter-generator'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Newsletters/Generator')
                ->where('defaultValues.date', now()->toDateString())
                ->where('defaultValues.marketCommentary', 'Most recent generated commentary.')
                ->where('deliveryDefaults.subscriptionStatuses', ['active', 'past_due', 'trialing'])
                ->where('scheduledDeliveries.0.subject', 'Scheduled NYSE ETF Environment')
                ->where('scheduledDeliveries.0.userName', 'Scheduler')
                ->where('schedulerMeta.newsletterTimezone', 'America/New_York')
                ->where('schedulerMeta.appTimezone', config('app.timezone')));
    }

    public function test_admin_can_schedule_newsletter_delivery(): void
    {
        CarbonImmutable::setTestNow(CarbonImmutable::parse('2026-06-14 19:00:00', 'UTC'));
        config(['newsletters.templates.nyse_market_environment.stripe_product_id' => 'prod_test_newsletter']);
        Storage::fake('local');
        Queue::fake();

        $admin = User::factory()->create(['is_admin' => true]);
        $values = $this->newsletterValues(['date' => '2026-06-14']);

        try {
            $this->actingAs($admin)
                ->post(route('admin.newsletter-generator.deliveries.store'), [
                    'values' => $values,
                    'subject' => 'NYSE ETF Environment',
                    'preheader' => 'Today&apos;s market read.',
                    'scheduled_for' => '2026-06-14T15:49',
                    'image' => $this->pngUpload(),
                ])
                ->assertRedirect(route('admin.newsletter-generator'));

            $delivery = NewsletterDelivery::firstOrFail();

            $this->assertSame($admin->id, $delivery->user_id);
            $this->assertSame('prod_test_newsletter', $delivery->stripe_product_id);
            $this->assertSame(['active', 'past_due', 'trialing'], $delivery->subscription_statuses);
            $this->assertSame('NYSE ETF Environment', $delivery->subject);
            $this->assertSame(NewsletterDelivery::STATUS_SCHEDULED, $delivery->status);
            $this->assertSame('2026-06-14T19:49:00+00:00', $delivery->scheduled_for->utc()->toIso8601String());
            $this->assertEquals($values, $delivery->values);
            Storage::disk('local')->assertExists($delivery->image_path);
            Queue::assertPushed(DispatchNewsletterDeliveryJob::class);

            $this->assertDatabaseHas('newsletter_generations', [
                'template' => NewsletterGeneration::TEMPLATE_NYSE_MARKET_ENVIRONMENT,
                'user_id' => $admin->id,
            ]);
        } finally {
            CarbonImmutable::setTestNow();
        }
    }

    public function test_admin_can_delete_scheduled_newsletter_delivery(): void
    {
        Storage::fake('local');
        Storage::disk('local')->put('newsletter.png', 'image');

        $admin = User::factory()->create(['is_admin' => true]);
        $delivery = NewsletterDelivery::create([
            'template' => NewsletterGeneration::TEMPLATE_NYSE_MARKET_ENVIRONMENT,
            'stripe_product_id' => 'prod_test_newsletter',
            'subscription_statuses' => ['active'],
            'subject' => 'Scheduled NYSE ETF Environment',
            'preheader' => 'Daily market read.',
            'values' => $this->newsletterValues(),
            'image_disk' => 'local',
            'image_path' => 'newsletter.png',
            'scheduled_for' => now()->addHour(),
            'status' => NewsletterDelivery::STATUS_SCHEDULED,
        ]);

        $this->actingAs($admin)
            ->delete(route('admin.newsletter-generator.deliveries.destroy', $delivery))
            ->assertRedirect(route('admin.newsletter-generator'));

        $this->assertDatabaseMissing('newsletter_deliveries', ['id' => $delivery->id]);
        Storage::disk('local')->assertMissing('newsletter.png');
    }

    public function test_admin_can_send_scheduled_newsletter_delivery_now(): void
    {
        Queue::fake([DispatchNewsletterDeliveryJob::class]);

        $admin = User::factory()->create(['is_admin' => true]);
        $delivery = NewsletterDelivery::create([
            'template' => NewsletterGeneration::TEMPLATE_NYSE_MARKET_ENVIRONMENT,
            'stripe_product_id' => 'prod_test_newsletter',
            'subscription_statuses' => ['active'],
            'subject' => 'Scheduled NYSE ETF Environment',
            'preheader' => 'Daily market read.',
            'values' => $this->newsletterValues(),
            'image_disk' => 'local',
            'image_path' => 'newsletter.png',
            'scheduled_for' => now()->addHour(),
            'status' => NewsletterDelivery::STATUS_SCHEDULED,
        ]);

        $this->actingAs($admin)
            ->post(route('admin.newsletter-generator.deliveries.send-now', $delivery))
            ->assertRedirect(route('admin.newsletter-generator'));

        $this->assertTrue($delivery->fresh()->scheduled_for->lessThanOrEqualTo(now()));
        Queue::assertPushed(DispatchNewsletterDeliveryJob::class);
    }

    public function test_due_newsletter_dispatch_command_dispatches_due_scheduled_deliveries(): void
    {
        Queue::fake([DispatchNewsletterDeliveryJob::class]);

        $dueDelivery = NewsletterDelivery::create([
            'template' => NewsletterGeneration::TEMPLATE_NYSE_MARKET_ENVIRONMENT,
            'stripe_product_id' => 'prod_test_newsletter',
            'subscription_statuses' => ['active'],
            'subject' => 'Due NYSE ETF Environment',
            'preheader' => 'Daily market read.',
            'values' => $this->newsletterValues(),
            'image_disk' => 'local',
            'image_path' => 'due-newsletter.png',
            'scheduled_for' => now()->subMinute(),
            'status' => NewsletterDelivery::STATUS_SCHEDULED,
        ]);
        NewsletterDelivery::create([
            'template' => NewsletterGeneration::TEMPLATE_NYSE_MARKET_ENVIRONMENT,
            'stripe_product_id' => 'prod_test_newsletter',
            'subscription_statuses' => ['active'],
            'subject' => 'Future NYSE ETF Environment',
            'preheader' => 'Daily market read.',
            'values' => $this->newsletterValues(),
            'image_disk' => 'local',
            'image_path' => 'future-newsletter.png',
            'scheduled_for' => now()->addMinute(),
            'status' => NewsletterDelivery::STATUS_SCHEDULED,
        ]);

        $this->artisan('newsletter:dispatch-due')
            ->expectsOutput('Dispatched 1 due newsletter deliveries.')
            ->assertOk();

        Queue::assertPushed(
            DispatchNewsletterDeliveryJob::class,
            fn (DispatchNewsletterDeliveryJob $job): bool => true,
        );
        Queue::assertPushed(DispatchNewsletterDeliveryJob::class, 1);
    }

    public function test_admin_can_send_test_newsletter_email(): void
    {
        config([
            'newsletters.templates.nyse_market_environment.stripe_product_id' => 'prod_test_newsletter',
            'newsletters.test_emails' => 'tickertactix@gmail.com,salutestoker@gmail.com',
        ]);
        Storage::fake('local');
        Mail::fake();

        $admin = User::factory()->create([
            'email' => 'admin@tickertactix.test',
            'is_admin' => true,
        ]);

        $this->actingAs($admin)
            ->post(route('admin.newsletter-generator.test-email'), [
                'values' => $this->newsletterValues(),
                'subject' => 'Test NYSE ETF Environment',
                'preheader' => 'Test preheader.',
                'image' => $this->pngUpload(),
            ])
            ->assertRedirect(route('admin.newsletter-generator'));

        Mail::assertSent(NewsletterSubscriptionEmail::class, 2);
        Mail::assertSent(NewsletterSubscriptionEmail::class, fn (NewsletterSubscriptionEmail $mail): bool => $mail->hasTo('tickertactix@gmail.com'));
        Mail::assertSent(NewsletterSubscriptionEmail::class, fn (NewsletterSubscriptionEmail $mail): bool => $mail->hasTo('salutestoker@gmail.com'));
        Mail::assertNotSent(NewsletterSubscriptionEmail::class, fn (NewsletterSubscriptionEmail $mail): bool => $mail->hasTo('admin@tickertactix.test'));

        $this->assertDatabaseCount('newsletter_deliveries', 0);
    }

    public function test_test_newsletter_mail_transport_errors_are_returned_to_admin(): void
    {
        config([
            'mail.default' => 'mailgun',
            'newsletters.templates.nyse_market_environment.stripe_product_id' => 'prod_test_newsletter',
            'newsletters.test_emails' => 'tickertactix@gmail.com',
        ]);
        Storage::fake('local');
        Mail::shouldReceive('to')
            ->once()
            ->with('tickertactix@gmail.com')
            ->andThrow(new TransportException('Unable to send an email: address not allowed.'));

        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)
            ->from(route('admin.newsletter-generator'))
            ->post(route('admin.newsletter-generator.test-email'), [
                'values' => $this->newsletterValues(),
                'subject' => 'Test NYSE ETF Environment',
                'preheader' => 'Test preheader.',
                'image' => $this->pngUpload(),
            ])
            ->assertRedirect(route('admin.newsletter-generator'))
            ->assertSessionHasErrors('email');

        $errors = session('errors')->getBag('default')->get('email');

        $this->assertStringContainsString('Mailgun rejected the test newsletter email.', $errors[0]);
        $this->assertStringContainsString('MAIL_FROM_ADDRESS belongs to MAILGUN_DOMAIN', $errors[0]);
        $this->assertSame([], Storage::disk('local')->allFiles('newsletter-deliveries/tests'));
    }

    public function test_admin_can_preview_stripe_recipient_count(): void
    {
        config(['newsletters.templates.nyse_market_environment.stripe_product_id' => 'prod_test_newsletter']);

        $service = Mockery::mock(StripeNewsletterSubscriberService::class);
        $service->shouldReceive('recipientsForProduct')
            ->once()
            ->with('prod_test_newsletter', ['active', 'past_due', 'trialing'])
            ->andReturn(new NewsletterRecipientResult([
                new NewsletterRecipient('one@example.com', 'cus_1'),
                new NewsletterRecipient('two@example.com', 'cus_2'),
            ], skippedNoEmail: 1));

        $this->app->instance(StripeNewsletterSubscriberService::class, $service);

        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)
            ->getJson(route('admin.newsletter-generator.recipient-count'))
            ->assertOk()
            ->assertJson([
                'count' => 2,
                'skippedNoEmail' => 1,
                'stripeProductId' => 'prod_test_newsletter',
                'subscriptionStatuses' => ['active', 'past_due', 'trialing'],
            ]);
    }

    public function test_dispatch_job_queues_one_email_job_per_current_stripe_recipient(): void
    {
        Queue::fake([SendNewsletterDeliveryEmailJob::class]);

        $delivery = NewsletterDelivery::create([
            'template' => NewsletterGeneration::TEMPLATE_NYSE_MARKET_ENVIRONMENT,
            'stripe_product_id' => 'prod_test_newsletter',
            'subscription_statuses' => ['active', 'past_due'],
            'subject' => 'NYSE ETF Environment',
            'preheader' => 'Daily market read.',
            'values' => $this->newsletterValues(),
            'image_disk' => 'local',
            'image_path' => 'newsletter.png',
            'scheduled_for' => now()->addMinute(),
            'status' => NewsletterDelivery::STATUS_SCHEDULED,
        ]);

        $service = Mockery::mock(StripeNewsletterSubscriberService::class);
        $service->shouldReceive('recipientsForProduct')
            ->once()
            ->with('prod_test_newsletter', ['active', 'past_due'])
            ->andReturn(new NewsletterRecipientResult([
                new NewsletterRecipient('one@example.com', 'cus_1'),
                new NewsletterRecipient('two@example.com', 'cus_2'),
            ], skippedNoEmail: 1));

        (new DispatchNewsletterDeliveryJob($delivery))->handle($service);

        $delivery->refresh();

        $this->assertSame(NewsletterDelivery::STATUS_SENDING, $delivery->status);
        $this->assertSame(2, $delivery->recipient_count);
        $this->assertSame(1, $delivery->skipped_count);
        Queue::assertPushed(SendNewsletterDeliveryEmailJob::class, 2);
    }

    public function test_send_email_job_sends_mail_and_marks_delivery_complete(): void
    {
        Mail::fake();

        $delivery = NewsletterDelivery::create([
            'template' => NewsletterGeneration::TEMPLATE_NYSE_MARKET_ENVIRONMENT,
            'stripe_product_id' => 'prod_test_newsletter',
            'subscription_statuses' => ['active', 'past_due'],
            'subject' => 'NYSE ETF Environment',
            'preheader' => 'Daily market read.',
            'values' => $this->newsletterValues(),
            'image_disk' => 'local',
            'image_path' => 'newsletter.png',
            'scheduled_for' => now()->subMinute(),
            'status' => NewsletterDelivery::STATUS_SENDING,
            'recipient_count' => 1,
        ]);

        (new SendNewsletterDeliveryEmailJob(
            $delivery->id,
            new NewsletterRecipient('subscriber@example.com', 'cus_test'),
        ))->handle();

        Mail::assertSent(NewsletterSubscriptionEmail::class, function (NewsletterSubscriptionEmail $mail): bool {
            return str_contains($mail->manageUrl, 'customer=cus_test')
                && str_contains($mail->manageUrl, 'signature=');
        });

        $delivery->refresh();

        $this->assertSame(NewsletterDelivery::STATUS_SENT, $delivery->status);
        $this->assertSame(1, $delivery->sent_count);
    }

    public function test_newsletter_email_template_uses_stripe_customer_name(): void
    {
        $delivery = NewsletterDelivery::create([
            'template' => NewsletterGeneration::TEMPLATE_NYSE_MARKET_ENVIRONMENT,
            'stripe_product_id' => 'prod_test_newsletter',
            'subscription_statuses' => ['active', 'past_due'],
            'subject' => 'Daily NYSE ETF ENVIRONMENT Newsletter',
            'preheader' => 'Attached is your daily NYSE ETF ENVIRONMENT newsletter.',
            'values' => $this->newsletterValues(),
            'image_disk' => 'local',
            'image_path' => 'newsletter.png',
            'scheduled_for' => now()->subMinute(),
            'status' => NewsletterDelivery::STATUS_SENT,
        ]);

        $html = (new NewsletterSubscriptionEmail(
            $delivery,
            new NewsletterRecipient('subscriber@example.com', 'cus_test', [], 'Stripe Customer'),
            'https://example.test/manage-subscription',
        ))->render();

        $this->assertStringContainsString('Hi Stripe Customer,', $html);
        $this->assertStringContainsString('Attached is your daily <strong>NYSE ETF ENVIRONMENT</strong> newsletter.', $html);
        $this->assertStringContainsString('https://example.test/manage-subscription', $html);
    }

    private function newsletterValues(array $overrides = []): array
    {
        return array_replace_recursive([
            'date' => '2026-06-09',
            'cards' => [
                'spyi' => [
                    'price' => '$53.16',
                    's2' => '58.48',
                    's1' => '55.82',
                    'b1' => '50.50',
                    'b2' => '47.84',
                ],
                'qqqi' => [
                    'price' => '$56.05',
                    's2' => '61.66',
                    's1' => '58.85',
                    'b1' => '53.25',
                    'b2' => '50.45',
                ],
                'iwmi' => [
                    'price' => '$50.77',
                    's2' => '55.85',
                    's1' => '53.31',
                    'b1' => '48.23',
                    'b2' => '45.69',
                ],
                'tltw' => [
                    'price' => '$21.82',
                    's2' => '24.00',
                    's1' => '22.91',
                    'b1' => '20.73',
                    'b2' => '19.64',
                ],
            ],
            'probabilities' => [
                'es1' => '75% BEARISH',
                'nq1' => '80% BEARISH',
                'spx' => '90% BEARISH',
                'qqq' => '85% BEARISH',
                'fatmaan' => '80% BEARISH',
                'svix' => '80% BULLISH',
                'dxy' => '80% BEARISH',
            ],
            'marketCommentary' => 'Generated market commentary.',
        ], $overrides);
    }

    private function pngUpload(): UploadedFile
    {
        return UploadedFile::fake()->createWithContent(
            'newsletter.png',
            base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII='),
        );
    }
}
