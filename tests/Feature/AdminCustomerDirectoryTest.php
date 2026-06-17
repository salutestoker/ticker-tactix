<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\StripeSubscribers\StripeSubscriberDirectory;
use App\Services\StripeSubscribers\StripeSubscriberDirectoryService;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Mockery;
use RuntimeException;
use Tests\TestCase;

class AdminCustomerDirectoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_customer_directory_requires_admin_access(): void
    {
        $this->get(route('admin.customers.index'))->assertRedirect('/login');

        $user = User::factory()->create(['is_admin' => false]);

        $this->actingAs($user)
            ->get(route('admin.customers.index'))
            ->assertForbidden();
    }

    public function test_admin_can_view_stripe_customer_directory_props(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $service = Mockery::mock(StripeSubscriberDirectoryService::class);

        $service->shouldReceive('directory')
            ->once()
            ->andReturn(new StripeSubscriberDirectory(
                subscribers: [[
                    'id' => 'sub_123',
                    'customer_id' => 'cus_123',
                    'customer_name' => 'Ticker Customer',
                    'customer_email' => 'customer@example.com',
                    'customer_phone' => null,
                    'subscription_id' => 'sub_123',
                    'subscription_status' => 'active',
                    'product_names' => ['Momentum Cycles'],
                    'product_ids' => ['prod_momentum'],
                    'products' => [['name' => 'Momentum Cycles', 'id' => 'prod_momentum']],
                    'price_ids' => ['price_momentum'],
                    'amounts' => ['$70.00 USD / month'],
                    'intervals' => ['month'],
                    'quantity_total' => 1,
                    'currency_codes' => ['USD'],
                    'current_period_start' => '2026-06-01T00:00:00+00:00',
                    'current_period_end' => '2026-07-01T00:00:00+00:00',
                    'cancel_at' => null,
                    'canceled_at' => null,
                    'ended_at' => null,
                    'trial_start' => null,
                    'trial_end' => null,
                    'created_at' => '2026-06-01T00:00:00+00:00',
                    'cancel_at_period_end' => false,
                    'livemode' => false,
                    'metadata' => [
                        'customer.metadata.discord_id' => '123456',
                    ],
                ]],
                productOptions: [[
                    'label' => 'Momentum Cycles',
                    'value' => 'Momentum Cycles',
                    'productIds' => ['prod_momentum'],
                ]],
                metadataColumns: [[
                    'key' => 'customer.metadata.discord_id',
                    'label' => 'Customer: Discord Id',
                ]],
                fetchedAt: CarbonImmutable::parse('2026-06-17T12:00:00Z'),
            ));

        $this->app->instance(StripeSubscriberDirectoryService::class, $service);

        $this->actingAs($admin)
            ->get(route('admin.customers.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Customers/Index')
                ->where('subscribers.0.customer_email', 'customer@example.com')
                ->where('subscribers.0.product_names.0', 'Momentum Cycles')
                ->where('productOptions.0.label', 'Momentum Cycles')
                ->where('metadataColumns.0.key', 'customer.metadata.discord_id')
                ->where('fetchedAt', '2026-06-17T12:00:00+00:00')
                ->where('stripeError', null));
    }

    public function test_admin_customer_directory_handles_stripe_errors(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $service = Mockery::mock(StripeSubscriberDirectoryService::class);

        $service->shouldReceive('directory')
            ->once()
            ->andThrow(new RuntimeException('Stripe is not configured.'));

        $this->app->instance(StripeSubscriberDirectoryService::class, $service);

        $this->actingAs($admin)
            ->get(route('admin.customers.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Customers/Index')
                ->where('subscribers', [])
                ->where('productOptions', [])
                ->where('metadataColumns', [])
                ->where('fetchedAt', null)
                ->where('stripeError', 'Stripe customers could not be loaded: Stripe is not configured.'));
    }
}
