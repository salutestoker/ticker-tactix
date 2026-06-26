<?php

namespace Tests\Feature;

use App\Enums\AccessLevel;
use App\Mail\SubscriptionWelcomeEmail;
use App\Models\Market;
use App\Models\Module;
use App\Models\Playbook;
use App\Models\StripeWebhookEvent;
use App\Models\TraderType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\Mailer\Exception\TransportException;
use Tests\TestCase;

class AdminSubscriptionWelcomeEmailTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_send_module_and_playbook_test_purchase_emails(): void
    {
        Mail::fake();

        $admin = User::factory()->create(['is_admin' => true]);
        $module = $this->module([
            'purchase_email_subject' => 'Welcome to Momentum Cycles',
            'purchase_email_body' => "Open Discord.\nRequest TradingView access.",
        ]);
        $playbook = $this->playbook([
            'purchase_email_subject' => 'Welcome to Opening Range',
            'purchase_email_body' => "Join Discord.\nReview the onboarding checklist.",
        ]);
        StripeWebhookEvent::create([
            'stripe_event_id' => 'evt_existing_admin_test_recipient',
            'stripe_event_type' => 'invoice.paid',
            'stripe_customer_id' => null,
            'customer_email' => 'module-test@example.com',
            'status' => StripeWebhookEvent::STATUS_SENT,
            'sent_at' => now(),
        ]);

        $this->actingAs($admin)
            ->post(route('admin.modules.purchase-email.test', $module), [
                'test_email' => "module-test@example.com, module-alt@example.com\nmodule-test@example.com",
            ])
            ->assertRedirect()
            ->assertSessionHasNoErrors();

        $this->actingAs($admin)
            ->post(route('admin.playbooks.purchase-email.test', $playbook), [
                'test_email' => 'playbook-test@example.com',
            ])
            ->assertRedirect()
            ->assertSessionHasNoErrors();

        Mail::assertSent(SubscriptionWelcomeEmail::class, 3);
        Mail::assertSent(SubscriptionWelcomeEmail::class, function (SubscriptionWelcomeEmail $mail): bool {
            return $mail->hasTo('module-test@example.com')
                && str_contains($mail->render(), 'Open Discord.')
                && str_contains($mail->render(), 'Request TradingView access.');
        });

        Mail::assertSent(SubscriptionWelcomeEmail::class, function (SubscriptionWelcomeEmail $mail): bool {
            return $mail->hasTo('module-alt@example.com')
                && str_contains($mail->render(), 'Open Discord.')
                && str_contains($mail->render(), 'Request TradingView access.');
        });

        Mail::assertSent(SubscriptionWelcomeEmail::class, function (SubscriptionWelcomeEmail $mail): bool {
            return $mail->hasTo('playbook-test@example.com')
                && str_contains($mail->render(), 'Join Discord.')
                && str_contains($mail->render(), 'Review the onboarding checklist.');
        });

        $this->assertDatabaseCount('stripe_webhook_events', 1);
        $this->assertDatabaseHas('stripe_webhook_events', [
            'stripe_event_id' => 'evt_existing_admin_test_recipient',
            'status' => StripeWebhookEvent::STATUS_SENT,
        ]);
    }

    public function test_admin_can_send_test_purchase_email_without_saved_email_body(): void
    {
        Mail::fake();

        $admin = User::factory()->create(['is_admin' => true]);
        $module = $this->module(['purchase_email_body' => null]);

        $this->actingAs($admin)
            ->post(route('admin.modules.purchase-email.test', $module), [
                'test_email' => 'module-test@example.com',
            ])
            ->assertRedirect()
            ->assertSessionHasNoErrors();

        Mail::assertSent(SubscriptionWelcomeEmail::class, function (SubscriptionWelcomeEmail $mail): bool {
            $html = $mail->render();

            return $mail->hasTo('module-test@example.com')
                && str_contains($html, 'Welcome to Momentum Cycles')
                && ! str_contains($html, 'Momentum Cycles Specific Information');
        });
    }

    public function test_admin_can_send_test_purchase_email_with_unsaved_email_body(): void
    {
        Mail::fake();

        $admin = User::factory()->create(['is_admin' => true]);
        $playbook = $this->playbook([
            'purchase_email_subject' => null,
            'purchase_email_body' => null,
        ]);

        $this->actingAs($admin)
            ->post(route('admin.playbooks.purchase-email.test', $playbook), [
                'test_email' => 'playbook-test@example.com',
                'purchase_email_subject' => 'Unsaved Test Subject',
                'purchase_email_body' => 'This body is not saved yet.',
            ])
            ->assertRedirect()
            ->assertSessionHasNoErrors();

        Mail::assertSent(SubscriptionWelcomeEmail::class, function (SubscriptionWelcomeEmail $mail): bool {
            return $mail->hasTo('playbook-test@example.com')
                && $mail->envelope()->subject === 'Unsaved Test Subject'
                && str_contains($mail->render(), 'This body is not saved yet.');
        });

        $this->assertDatabaseHas('playbooks', [
            'id' => $playbook->id,
            'purchase_email_subject' => null,
            'purchase_email_body' => null,
        ]);
    }

    public function test_admin_can_preview_module_and_playbook_purchase_emails_in_browser(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $module = $this->module([
            'purchase_email_subject' => 'Welcome to Momentum Cycles',
            'purchase_email_body' => "Open Discord.\nRequest TradingView access.",
        ]);
        $playbook = $this->playbook([
            'purchase_email_subject' => 'Welcome to Opening Range',
            'purchase_email_body' => "Join Discord.\nReview the onboarding checklist.",
        ]);

        $this->actingAs($admin)
            ->get(route('dev.emails.modules.welcome', $module))
            ->assertOk()
            ->assertSee('Welcome to Momentum Cycles')
            ->assertSee('Hi Preview Customer')
            ->assertSee('Open Discord.')
            ->assertSee('Request TradingView access.');

        $this->actingAs($admin)
            ->get(route('dev.emails.playbooks.welcome', $playbook))
            ->assertOk()
            ->assertSee('Welcome to Opening Range')
            ->assertSee('Hi Preview Customer')
            ->assertSee('Join Discord.')
            ->assertSee('Review the onboarding checklist.');
    }

    public function test_purchase_email_preview_renders_sanitized_rich_text_body(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $module = $this->module([
            'purchase_email_subject' => 'Welcome to Momentum Cycles',
            'purchase_email_body' => '<p>Open <strong>Discord</strong><script>alert(1)</script>.</p><p><a href="https://example.com/checklist" onclick="bad()">Read checklist</a></p>',
        ]);

        $this->actingAs($admin)
            ->get(route('dev.emails.modules.welcome', $module))
            ->assertOk()
            ->assertSee('<strong>Discord</strong>', false)
            ->assertSee('href="https://example.com/checklist"', false)
            ->assertSee('Read checklist')
            ->assertDontSee('alert(1)', false)
            ->assertDontSee('onclick', false)
            ->assertDontSee('<script', false);
    }

    public function test_non_admin_cannot_preview_purchase_emails(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        $module = $this->module([
            'purchase_email_body' => 'Open Discord.',
        ]);

        $this->actingAs($user)
            ->get(route('dev.emails.modules.welcome', $module))
            ->assertForbidden();
    }

    public function test_admin_test_purchase_email_rejects_invalid_recipient_lists(): void
    {
        Mail::fake();

        $admin = User::factory()->create(['is_admin' => true]);
        $module = $this->module([
            'purchase_email_body' => 'Open Discord.',
        ]);

        $this->actingAs($admin)
            ->post(route('admin.modules.purchase-email.test', $module), [
                'test_email' => 'module-test@example.com, not-an-email',
            ])
            ->assertRedirect()
            ->assertSessionHasErrors('test_email');

        Mail::assertNothingSent();
    }

    public function test_admin_test_purchase_email_mail_transport_errors_are_returned_to_admin(): void
    {
        config(['mail.default' => 'mailgun']);
        Mail::shouldReceive('to')
            ->once()
            ->with('module-test@example.com')
            ->andThrow(new TransportException('Unable to send an email: Forbidden (code 401).'));

        $admin = User::factory()->create(['is_admin' => true]);
        $module = $this->module([
            'purchase_email_body' => 'Open Discord.',
        ]);

        $this->actingAs($admin)
            ->from(route('admin.modules.edit', $module))
            ->post(route('admin.modules.purchase-email.test', $module), [
                'test_email' => 'module-test@example.com',
            ])
            ->assertRedirect(route('admin.modules.edit', $module))
            ->assertSessionHasErrors('test_email');

        $errors = session('errors')->getBag('default')->get('test_email');

        $this->assertStringContainsString('Mailgun rejected the test purchase email.', $errors[0]);
        $this->assertStringContainsString('MAILGUN_SECRET and MAILGUN_DOMAIN are correct', $errors[0]);
        $this->assertStringContainsString('Forbidden (code 401)', $errors[0]);
    }

    private function module(array $attributes = []): Module
    {
        [$market, $traderType] = $this->catalogTaxonomies();

        $module = Module::create([
            'market_id' => $market->id,
            'title' => 'Momentum Cycles',
            'slug' => 'momentum-cycles-'.uniqid(),
            'access' => AccessLevel::InviteOnlyIndicatorDiscord,
            'sort_order' => 10,
            'is_featured' => false,
            'is_active' => false,
            'published_at' => null,
            ...$attributes,
        ]);

        $module->traderTypes()->attach($traderType);

        return $module;
    }

    private function playbook(array $attributes = []): Playbook
    {
        [$market, $traderType] = $this->catalogTaxonomies();

        $playbook = Playbook::create([
            'market_id' => $market->id,
            'title' => 'Opening Range',
            'slug' => 'opening-range-'.uniqid(),
            'access' => AccessLevel::DailyNewsletterDiscord,
            'sort_order' => 10,
            'is_featured' => false,
            'is_active' => false,
            'published_at' => null,
            ...$attributes,
        ]);

        $playbook->traderTypes()->attach($traderType);

        return $playbook;
    }

    /**
     * @return array{Market, TraderType}
     */
    private function catalogTaxonomies(): array
    {
        $market = Market::create([
            'name' => 'NYSE',
            'slug' => 'nyse-'.uniqid(),
            'sort_order' => 10,
            'is_active' => true,
        ]);

        $traderType = TraderType::create([
            'name' => 'NYSE CORE',
            'slug' => 'nyse-core-'.uniqid(),
            'sort_order' => 10,
            'is_active' => true,
        ]);

        return [$market, $traderType];
    }
}
