<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\StripeProducts\StripeProductDirectory;
use App\Services\StripeProducts\StripeProductDirectoryService;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Mockery;
use RuntimeException;
use Tests\TestCase;

class AdminProductDirectoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_product_directory_requires_admin_access(): void
    {
        $this->get(route('admin.products.index'))->assertRedirect('/login');

        $user = User::factory()->create(['is_admin' => false]);

        $this->actingAs($user)
            ->get(route('admin.products.index'))
            ->assertForbidden();
    }

    public function test_admin_can_view_stripe_product_directory_props(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $service = Mockery::mock(StripeProductDirectoryService::class);

        $service->shouldReceive('directory')
            ->once()
            ->andReturn(new StripeProductDirectory(
                products: [[
                    'id' => 'prod_momentum',
                    'product_id' => 'prod_momentum',
                    'name' => 'Momentum Cycles',
                    'description' => 'Cycle engine',
                    'active' => true,
                    'url' => 'https://ticker-tactix.test/momentum',
                    'type' => 'service',
                    'default_price_id' => 'price_momentum_monthly',
                    'default_price_amount' => '$70.00 USD / month',
                    'price_count' => 1,
                    'prices' => [[
                        'id' => 'price_momentum_monthly',
                        'active' => true,
                        'amount' => '$70.00 USD / month',
                        'interval' => 'month',
                        'currency' => 'USD',
                        'nickname' => 'Monthly',
                        'lookup_key' => 'momentum_monthly',
                        'type' => 'recurring',
                    ]],
                    'price_ids' => ['price_momentum_monthly'],
                    'price_amounts' => ['$70.00 USD / month'],
                    'price_intervals' => ['month'],
                    'currency_codes' => ['USD'],
                    'local_catalog' => [[
                        'type' => 'Module',
                        'label' => 'Momentum Cycles',
                        'id' => '10',
                        'slug' => 'momentum-cycles',
                        'url' => '/admin/modules/10/edit',
                        'stripe_product_id' => 'prod_momentum',
                        'stripe_price_id' => 'price_momentum_monthly',
                    ]],
                    'local_catalog_labels' => ['Momentum Cycles'],
                    'local_catalog_types' => ['Module'],
                    'livemode' => false,
                    'created_at' => '2026-06-01T00:00:00+00:00',
                    'updated_at' => '2026-06-15T00:00:00+00:00',
                    'metadata' => [
                        'product.metadata.segment' => 'modules',
                    ],
                ]],
                metadataColumns: [[
                    'key' => 'product.metadata.segment',
                    'label' => 'Product: Segment',
                ]],
                fetchedAt: CarbonImmutable::parse('2026-06-17T12:00:00Z'),
            ));

        $this->app->instance(StripeProductDirectoryService::class, $service);

        $this->actingAs($admin)
            ->get(route('admin.products.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Products/Index')
                ->where('products.0.name', 'Momentum Cycles')
                ->where('products.0.product_id', 'prod_momentum')
                ->where('products.0.default_price_amount', '$70.00 USD / month')
                ->where('products.0.local_catalog.0.type', 'Module')
                ->where('metadataColumns.0.key', 'product.metadata.segment')
                ->where('fetchedAt', '2026-06-17T12:00:00+00:00')
                ->where('stripeError', null));
    }

    public function test_admin_product_directory_handles_stripe_errors(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $service = Mockery::mock(StripeProductDirectoryService::class);

        $service->shouldReceive('directory')
            ->once()
            ->andThrow(new RuntimeException('Stripe is not configured.'));

        $this->app->instance(StripeProductDirectoryService::class, $service);

        $this->actingAs($admin)
            ->get(route('admin.products.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Products/Index')
                ->where('products', [])
                ->where('metadataColumns', [])
                ->where('fetchedAt', null)
                ->where('stripeError', 'Stripe products could not be loaded: Stripe is not configured.'));
    }
}
