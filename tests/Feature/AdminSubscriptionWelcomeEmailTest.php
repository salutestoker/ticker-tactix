<?php

namespace Tests\Feature;

use App\Enums\AccessLevel;
use App\Mail\SubscriptionWelcomeEmail;
use App\Models\Market;
use App\Models\Module;
use App\Models\Playbook;
use App\Models\TraderType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
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

        $this->assertDatabaseCount('stripe_webhook_events', 0);
    }

    public function test_admin_test_purchase_email_requires_saved_email_body(): void
    {
        Mail::fake();

        $admin = User::factory()->create(['is_admin' => true]);
        $module = $this->module(['purchase_email_body' => null]);

        $this->actingAs($admin)
            ->post(route('admin.modules.purchase-email.test', $module), [
                'test_email' => 'module-test@example.com',
            ])
            ->assertRedirect()
            ->assertSessionHasErrors('test_email');

        Mail::assertNothingSent();
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
