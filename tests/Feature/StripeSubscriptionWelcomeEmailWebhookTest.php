<?php

namespace Tests\Feature;

use App\Enums\AccessLevel;
use App\Jobs\SendSubscriptionWelcomeEmailJob;
use App\Mail\SubscriptionWelcomeEmail;
use App\Models\Market;
use App\Models\Module;
use App\Models\Playbook;
use App\Models\StripeWebhookEvent;
use App\Models\TraderType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;

class StripeSubscriptionWelcomeEmailWebhookTest extends TestCase
{
    use RefreshDatabase;

    private const WELCOME_VIDEO_THUMBNAIL_URL = 'https://ticker-tactix.com/design/assets/images/welcome-video-thumbnail.jpg';

    public function test_signed_initial_subscription_invoice_queues_welcome_email_without_purchase_email_body(): void
    {
        config(['services.stripe.webhook_secret' => 'whsec_test_secret']);
        Queue::fake();

        $module = $this->module([
            'stripe_product_id' => 'prod_module',
            'stripe_price_id' => 'price_module',
            'purchase_email_body' => null,
        ]);

        $payload = $this->invoicePaidPayload(
            eventId: 'evt_initial_subscription',
            priceId: 'price_module',
            productId: 'prod_module',
        );

        $this->postStripeWebhook($payload)->assertOk();

        Queue::assertPushed(SendSubscriptionWelcomeEmailJob::class, 1);

        $this->assertDatabaseHas(StripeWebhookEvent::class, [
            'stripe_event_id' => 'evt_initial_subscription',
            'stripe_invoice_id' => 'in_initial_subscription',
            'stripe_customer_id' => 'cus_initial_subscription',
            'stripe_subscription_id' => 'sub_initial_subscription',
            'stripe_product_id' => 'prod_module',
            'stripe_price_id' => 'price_module',
            'catalog_type' => Module::class,
            'catalog_id' => $module->id,
            'customer_email' => 'subscriber@example.com',
            'status' => StripeWebhookEvent::STATUS_QUEUED,
        ]);
    }

    public function test_duplicate_stripe_event_does_not_queue_twice(): void
    {
        config(['services.stripe.webhook_secret' => 'whsec_test_secret']);
        Queue::fake();

        $this->module([
            'stripe_product_id' => 'prod_module',
            'stripe_price_id' => 'price_module',
            'purchase_email_body' => 'Request TradingView access in Discord.',
        ]);

        $payload = $this->invoicePaidPayload(
            eventId: 'evt_duplicate_subscription',
            priceId: 'price_module',
            productId: 'prod_module',
        );

        $this->postStripeWebhook($payload)->assertOk();
        $this->postStripeWebhook($payload)->assertOk();

        Queue::assertPushed(SendSubscriptionWelcomeEmailJob::class, 1);
        $this->assertSame(1, StripeWebhookEvent::where('stripe_event_id', 'evt_duplicate_subscription')->count());
    }

    public function test_subscription_cycle_invoice_is_skipped(): void
    {
        config(['services.stripe.webhook_secret' => 'whsec_test_secret']);
        Queue::fake();

        $this->module([
            'stripe_product_id' => 'prod_module',
            'stripe_price_id' => 'price_module',
            'purchase_email_body' => 'Request TradingView access in Discord.',
        ]);

        $payload = $this->invoicePaidPayload(
            eventId: 'evt_renewal_subscription',
            priceId: 'price_module',
            productId: 'prod_module',
            billingReason: 'subscription_cycle',
        );

        $this->postStripeWebhook($payload)->assertOk();

        Queue::assertNotPushed(SendSubscriptionWelcomeEmailJob::class);
        $this->assertDatabaseHas(StripeWebhookEvent::class, [
            'stripe_event_id' => 'evt_renewal_subscription',
            'status' => StripeWebhookEvent::STATUS_SKIPPED,
            'skip_reason' => 'Invoice is not the first subscription invoice.',
        ]);
    }

    public function test_second_product_for_same_stripe_customer_is_skipped(): void
    {
        config(['services.stripe.webhook_secret' => 'whsec_test_secret']);
        Queue::fake();

        $this->module([
            'stripe_product_id' => 'prod_module',
            'stripe_price_id' => 'price_module',
            'purchase_email_body' => 'Request TradingView access in Discord.',
        ]);
        $playbook = $this->playbook([
            'stripe_product_id' => 'prod_playbook',
            'stripe_price_id' => 'price_playbook',
            'purchase_email_body' => 'Review the onboarding checklist.',
        ]);

        $this->postStripeWebhook($this->invoicePaidPayload(
            eventId: 'evt_first_customer_product',
            priceId: 'price_module',
            productId: 'prod_module',
            customerId: 'cus_shared_customer',
        ))->assertOk();

        $this->postStripeWebhook($this->invoicePaidPayload(
            eventId: 'evt_second_customer_product',
            priceId: 'price_playbook',
            productId: 'prod_playbook',
            customerId: 'cus_shared_customer',
        ))->assertOk();

        Queue::assertPushed(SendSubscriptionWelcomeEmailJob::class, 1);
        $this->assertDatabaseHas(StripeWebhookEvent::class, [
            'stripe_event_id' => 'evt_second_customer_product',
            'stripe_customer_id' => 'cus_shared_customer',
            'catalog_type' => Playbook::class,
            'catalog_id' => $playbook->id,
            'status' => StripeWebhookEvent::STATUS_SKIPPED,
            'skip_reason' => 'Customer has already received a subscription welcome email.',
        ]);
    }

    public function test_customer_email_fallback_skips_second_product_when_stripe_customer_id_is_missing(): void
    {
        config(['services.stripe.webhook_secret' => 'whsec_test_secret']);
        Queue::fake();

        $this->module([
            'stripe_product_id' => 'prod_module',
            'stripe_price_id' => 'price_module',
            'purchase_email_body' => 'Request TradingView access in Discord.',
        ]);
        $this->playbook([
            'stripe_product_id' => 'prod_playbook',
            'stripe_price_id' => 'price_playbook',
            'purchase_email_body' => 'Review the onboarding checklist.',
        ]);

        $this->postStripeWebhook($this->invoicePaidPayload(
            eventId: 'evt_first_email_product',
            priceId: 'price_module',
            productId: 'prod_module',
            customerId: null,
            customerEmail: 'subscriber@example.com',
        ))->assertOk();

        $this->postStripeWebhook($this->invoicePaidPayload(
            eventId: 'evt_second_email_product',
            priceId: 'price_playbook',
            productId: 'prod_playbook',
            customerId: null,
            customerEmail: 'SUBSCRIBER@example.com',
        ))->assertOk();

        Queue::assertPushed(SendSubscriptionWelcomeEmailJob::class, 1);
        $this->assertDatabaseHas(StripeWebhookEvent::class, [
            'stripe_event_id' => 'evt_second_email_product',
            'stripe_customer_id' => null,
            'customer_email' => 'SUBSCRIBER@example.com',
            'status' => StripeWebhookEvent::STATUS_SKIPPED,
            'skip_reason' => 'Customer has already received a subscription welcome email.',
        ]);
    }

    public function test_invalid_stripe_signature_is_rejected(): void
    {
        config(['services.stripe.webhook_secret' => 'whsec_test_secret']);
        Queue::fake();

        $payload = json_encode($this->invoicePaidPayload(
            eventId: 'evt_invalid_signature',
            priceId: 'price_module',
            productId: 'prod_module',
        ), JSON_UNESCAPED_SLASHES);

        $this->call('POST', route('stripe.webhooks'), [], [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_ACCEPT' => 'application/json',
            'HTTP_STRIPE_SIGNATURE' => 't='.time().',v1=bad_signature',
        ], $payload)->assertBadRequest();

        Queue::assertNotPushed(SendSubscriptionWelcomeEmailJob::class);
        $this->assertDatabaseMissing(StripeWebhookEvent::class, [
            'stripe_event_id' => 'evt_invalid_signature',
        ]);
    }

    public function test_malformed_stripe_payload_is_rejected(): void
    {
        config(['services.stripe.webhook_secret' => 'whsec_test_secret']);
        Queue::fake();

        $payload = 'not-json';

        $this->call('POST', route('stripe.webhooks'), [], [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_ACCEPT' => 'application/json',
            'HTTP_STRIPE_SIGNATURE' => $this->stripeSignature($payload),
        ], $payload)->assertBadRequest();

        Queue::assertNotPushed(SendSubscriptionWelcomeEmailJob::class);
        $this->assertDatabaseCount('stripe_webhook_events', 0);
    }

    public function test_unknown_stripe_product_is_recorded_as_skipped(): void
    {
        config(['services.stripe.webhook_secret' => 'whsec_test_secret']);
        Queue::fake();

        $payload = $this->invoicePaidPayload(
            eventId: 'evt_unknown_product',
            priceId: 'price_unknown',
            productId: 'prod_unknown',
        );

        $this->postStripeWebhook($payload)->assertOk();

        Queue::assertNotPushed(SendSubscriptionWelcomeEmailJob::class);
        $this->assertDatabaseHas(StripeWebhookEvent::class, [
            'stripe_event_id' => 'evt_unknown_product',
            'stripe_product_id' => 'prod_unknown',
            'stripe_price_id' => 'price_unknown',
            'status' => StripeWebhookEvent::STATUS_SKIPPED,
            'skip_reason' => 'No module or playbook matched the Stripe price/product IDs.',
        ]);
    }

    public function test_queued_job_sends_renderable_welcome_email_with_default_youtube_video(): void
    {
        Mail::fake();

        $playbook = $this->playbook([
            'stripe_product_id' => 'prod_playbook',
            'stripe_price_id' => 'price_playbook',
            'purchase_email_subject' => 'Welcome to Opening Range',
            'purchase_email_body' => "Join Discord.\nReview the onboarding checklist.",
        ]);

        $event = StripeWebhookEvent::create([
            'stripe_event_id' => 'evt_send_email',
            'stripe_event_type' => 'invoice.paid',
            'stripe_invoice_id' => 'in_send_email',
            'stripe_customer_id' => 'cus_send_email',
            'stripe_subscription_id' => 'sub_send_email',
            'stripe_product_id' => 'prod_playbook',
            'stripe_price_id' => 'price_playbook',
            'catalog_type' => Playbook::class,
            'catalog_id' => $playbook->id,
            'customer_email' => 'subscriber@example.com',
            'customer_name' => 'Subscriber Name',
            'status' => StripeWebhookEvent::STATUS_QUEUED,
        ]);

        (new SendSubscriptionWelcomeEmailJob($event->id))->handle();

        Mail::assertSent(SubscriptionWelcomeEmail::class, function (SubscriptionWelcomeEmail $mail): bool {
            $html = $mail->render();

            return str_contains($html, 'Welcome to Opening Range')
                && str_contains($html, 'Join Discord.')
                && str_contains($html, 'Review the onboarding checklist.')
                && str_contains($html, 'Manage your subscription')
                && str_contains($html, 'https://www.youtube.com/watch?v=_Rit_BcwYu8')
                && str_contains($html, self::WELCOME_VIDEO_THUMBNAIL_URL)
                && ! str_contains($html, 'https://i.ytimg.com/vi/_Rit_BcwYu8/hqdefault.jpg')
                && str_contains($html, 'Watch Welcome Video')
                && str_contains($html, 'View Product')
                && str_contains($html, 'Join Discord')
                && str_contains($html, 'font-family: Orbitron')
                && str_contains($html, 'border-style: solid')
                && ! str_contains($html, 'Product Overview Video')
                && ! str_contains($html, '<video controls')
                && ! str_contains($html, 'design/assets/videos/email-welcome-intro.mp4');
        });

        $this->assertDatabaseHas(StripeWebhookEvent::class, [
            'id' => $event->id,
            'status' => StripeWebhookEvent::STATUS_SENT,
        ]);
    }

    public function test_queued_job_sends_welcome_email_without_purchase_email_body(): void
    {
        Mail::fake();

        $module = $this->module([
            'stripe_product_id' => 'prod_module',
            'stripe_price_id' => 'price_module',
            'purchase_email_subject' => 'Welcome to Momentum Cycles',
            'purchase_email_body' => null,
        ]);

        $event = StripeWebhookEvent::create([
            'stripe_event_id' => 'evt_send_email_without_body',
            'stripe_event_type' => 'invoice.paid',
            'stripe_invoice_id' => 'in_send_email_without_body',
            'stripe_customer_id' => 'cus_send_email_without_body',
            'stripe_subscription_id' => 'sub_send_email_without_body',
            'stripe_product_id' => 'prod_module',
            'stripe_price_id' => 'price_module',
            'catalog_type' => Module::class,
            'catalog_id' => $module->id,
            'customer_email' => 'subscriber@example.com',
            'customer_name' => 'Subscriber Name',
            'status' => StripeWebhookEvent::STATUS_QUEUED,
        ]);

        (new SendSubscriptionWelcomeEmailJob($event->id))->handle();

        Mail::assertSent(SubscriptionWelcomeEmail::class, function (SubscriptionWelcomeEmail $mail): bool {
            $html = $mail->render();

            return str_contains($html, 'Welcome to Momentum Cycles')
                && str_contains($html, 'Watch Welcome Video')
                && ! str_contains($html, 'Momentum Cycles Specific Information');
        });

        $this->assertDatabaseHas(StripeWebhookEvent::class, [
            'id' => $event->id,
            'status' => StripeWebhookEvent::STATUS_SENT,
            'skip_reason' => null,
        ]);
    }

    public function test_queued_job_uses_youtube_video_override_when_catalog_item_has_youtube_url(): void
    {
        Mail::fake();

        $module = $this->module([
            'stripe_product_id' => 'prod_module',
            'stripe_price_id' => 'price_module',
            'purchase_email_body' => 'Request TradingView access in Discord.',
            'youtube_url' => 'https://youtu.be/dQw4w9WgXcQ',
        ]);

        $event = StripeWebhookEvent::create([
            'stripe_event_id' => 'evt_youtube_email',
            'stripe_event_type' => 'invoice.paid',
            'stripe_invoice_id' => 'in_youtube_email',
            'stripe_customer_id' => 'cus_youtube_email',
            'stripe_subscription_id' => 'sub_youtube_email',
            'stripe_product_id' => 'prod_module',
            'stripe_price_id' => 'price_module',
            'catalog_type' => Module::class,
            'catalog_id' => $module->id,
            'customer_email' => 'subscriber@example.com',
            'customer_name' => 'Subscriber Name',
            'status' => StripeWebhookEvent::STATUS_QUEUED,
        ]);

        (new SendSubscriptionWelcomeEmailJob($event->id))->handle();

        Mail::assertSent(SubscriptionWelcomeEmail::class, function (SubscriptionWelcomeEmail $mail): bool {
            $html = $mail->render();
            $viewData = $mail->content()->with;

            return str_contains($html, 'https://www.youtube.com/watch?v=_Rit_BcwYu8')
                && str_contains($html, self::WELCOME_VIDEO_THUMBNAIL_URL)
                && str_contains($html, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')
                && str_contains($html, 'Product Overview Video')
                && ($viewData['youtubeThumbnailUrl'] ?? null) === 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg'
                && ($viewData['welcomeVideoThumbnailUrl'] ?? null) === self::WELCOME_VIDEO_THUMBNAIL_URL
                && ! str_contains($html, '<video controls')
                && ! str_contains($html, 'design/assets/videos/email-welcome-intro.mp4');
        });

        $this->assertDatabaseHas(StripeWebhookEvent::class, [
            'id' => $event->id,
            'status' => StripeWebhookEvent::STATUS_SENT,
        ]);
    }

    private function postStripeWebhook(array $payload): TestResponse
    {
        $json = json_encode($payload, JSON_UNESCAPED_SLASHES);
        $this->assertIsString($json);

        return $this->call('POST', route('stripe.webhooks'), [], [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_ACCEPT' => 'application/json',
            'HTTP_STRIPE_SIGNATURE' => $this->stripeSignature($json),
        ], $json);
    }

    private function stripeSignature(string $payload): string
    {
        $timestamp = time();
        $signature = hash_hmac('sha256', "{$timestamp}.{$payload}", 'whsec_test_secret');

        return "t={$timestamp},v1={$signature}";
    }

    private function invoicePaidPayload(
        string $eventId,
        string $priceId,
        string $productId,
        string $billingReason = 'subscription_create',
        ?string $customerId = '',
        ?string $customerEmail = 'subscriber@example.com',
        ?string $customerName = 'Subscriber Name',
    ): array {
        $suffix = str($eventId)->after('evt_')->value();
        $resolvedCustomerId = $customerId === '' ? 'cus_'.$suffix : $customerId;

        return [
            'id' => $eventId,
            'object' => 'event',
            'type' => 'invoice.paid',
            'created' => 1_765_929_600,
            'data' => [
                'object' => [
                    'id' => 'in_'.$suffix,
                    'object' => 'invoice',
                    'billing_reason' => $billingReason,
                    'status' => 'paid',
                    'customer' => $resolvedCustomerId,
                    'customer_email' => $customerEmail,
                    'customer_name' => $customerName,
                    'parent' => [
                        'type' => 'subscription_details',
                        'subscription_details' => [
                            'subscription' => 'sub_'.$suffix,
                        ],
                    ],
                    'lines' => [
                        'object' => 'list',
                        'data' => [
                            [
                                'id' => 'il_'.$suffix,
                                'object' => 'line_item',
                                'pricing' => [
                                    'type' => 'price_details',
                                    'price_details' => [
                                        'price' => $priceId,
                                        'product' => $productId,
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];
    }

    private function module(array $attributes = []): Module
    {
        [$market, $traderType] = $this->catalogTaxonomies();

        $module = Module::create([
            'market_id' => $market->id,
            'title' => 'Momentum Cycles',
            'slug' => 'momentum-cycles',
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
            'slug' => 'opening-range',
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
