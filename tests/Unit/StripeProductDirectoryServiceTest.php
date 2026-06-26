<?php

namespace Tests\Unit;

use App\Services\StripeProducts\StripeProductDirectoryService;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Stripe\StripeClient;
use Tests\TestCase;

class StripeProductDirectoryServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_normalizes_products_prices_metadata_and_local_catalog_matches(): void
    {
        $service = new StripeProductDirectoryService($this->app);

        $directory = $service->normalizeProducts(
            products: [[
                'id' => 'prod_momentum',
                'name' => 'Momentum Cycles',
                'description' => 'Cycle engine',
                'active' => true,
                'url' => 'https://ticker-tactix.test/momentum',
                'type' => 'service',
                'livemode' => false,
                'created' => 1_780_876_800,
                'updated' => 1_782_086_400,
                'metadata' => [
                    'segment' => 'modules',
                ],
                'default_price' => [
                    'id' => 'price_monthly',
                    'active' => true,
                    'currency' => 'usd',
                    'unit_amount' => 7000,
                    'type' => 'recurring',
                    'recurring' => [
                        'interval' => 'month',
                        'interval_count' => 1,
                    ],
                    'metadata' => [
                        'cohort' => 'launch',
                    ],
                ],
            ]],
            pricesByProduct: [
                'prod_momentum' => [
                    [
                        'id' => 'price_monthly',
                        'active' => true,
                        'currency' => 'usd',
                        'unit_amount' => 7000,
                        'nickname' => 'Monthly',
                        'lookup_key' => 'momentum_monthly',
                        'type' => 'recurring',
                        'recurring' => [
                            'interval' => 'month',
                            'interval_count' => 1,
                        ],
                        'metadata' => [
                            'cohort' => 'launch',
                        ],
                    ],
                    [
                        'id' => 'price_quarterly',
                        'active' => false,
                        'currency' => 'usd',
                        'unit_amount' => 18900,
                        'nickname' => 'Quarterly',
                        'lookup_key' => 'momentum_quarterly',
                        'type' => 'recurring',
                        'recurring' => [
                            'interval' => 'month',
                            'interval_count' => 3,
                        ],
                        'metadata' => [
                            'cohort' => 'legacy',
                        ],
                    ],
                ],
            ],
            fetchedAt: CarbonImmutable::parse('2026-06-17T12:00:00Z'),
            catalogItems: [
                [
                    'type' => 'Module',
                    'label' => 'Momentum Cycles',
                    'id' => '10',
                    'slug' => 'momentum-cycles',
                    'url' => '/admin/modules/10/edit',
                    'stripe_product_id' => 'prod_momentum',
                    'stripe_price_id' => 'price_monthly',
                ],
                [
                    'type' => 'Playbook',
                    'label' => 'Opening Range',
                    'id' => '20',
                    'slug' => 'opening-range',
                    'url' => '/admin/playbooks/20/edit',
                    'stripe_product_id' => null,
                    'stripe_price_id' => 'price_quarterly',
                ],
                [
                    'type' => 'Newsletter',
                    'label' => 'NYSE Market Environment',
                    'id' => 'nyse_market_environment',
                    'slug' => 'nyse_market_environment',
                    'url' => '/admin/newsletter-generator',
                    'stripe_product_id' => 'prod_momentum',
                    'stripe_price_id' => null,
                ],
            ],
        );

        $row = $directory->products[0];
        $metadataColumnKeys = array_column($directory->metadataColumns, 'key');

        $this->assertSame('prod_momentum', $row['product_id']);
        $this->assertSame('Momentum Cycles', $row['name']);
        $this->assertTrue($row['active']);
        $this->assertSame('price_monthly', $row['default_price_id']);
        $this->assertSame('$70.00 USD / month', $row['default_price_amount']);
        $this->assertSame(2, $row['price_count']);
        $this->assertSame(['price_monthly', 'price_quarterly'], $row['price_ids']);
        $this->assertSame(['$70.00 USD / month', '$189.00 USD / 3 months'], $row['price_amounts']);
        $this->assertSame(['month', '3 months'], $row['price_intervals']);
        $this->assertSame(['USD'], $row['currency_codes']);
        $this->assertSame(['Momentum Cycles', 'Opening Range', 'NYSE Market Environment'], $row['local_catalog_labels']);
        $this->assertSame('modules', $row['metadata']['product.metadata.segment']);
        $this->assertSame('launch; legacy', $row['metadata']['price.metadata.cohort']);
        $this->assertSame('2026-06-08T00:00:00+00:00', $row['created_at']);
        $this->assertSame('2026-06-22T00:00:00+00:00', $row['updated_at']);
        $this->assertContains('product.metadata.segment', $metadataColumnKeys);
        $this->assertContains('price.metadata.cohort', $metadataColumnKeys);
        $this->assertSame('2026-06-17T12:00:00+00:00', $directory->toInertiaArray()['fetchedAt']);
    }

    public function test_it_paginates_stripe_products_and_prices_then_de_duplicates_prices(): void
    {
        $products = new class
        {
            public array $calls = [];

            public function all(array $params): object
            {
                $this->calls[] = $params;

                if (! isset($params['starting_after'])) {
                    return (object) [
                        'data' => [[
                            'id' => 'prod_one',
                            'name' => 'Product One',
                            'active' => true,
                        ]],
                        'has_more' => true,
                    ];
                }

                return (object) [
                    'data' => [[
                        'id' => 'prod_two',
                        'name' => 'Product Two',
                        'active' => false,
                    ]],
                    'has_more' => false,
                ];
            }
        };
        $prices = new class
        {
            public array $calls = [];

            public function all(array $params): object
            {
                $this->calls[] = $params;

                if ($params['product'] === 'prod_one' && $params['active'] === true && ! isset($params['starting_after'])) {
                    return (object) [
                        'data' => [[
                            'id' => 'price_one_monthly',
                            'active' => true,
                            'currency' => 'usd',
                            'unit_amount' => 5000,
                            'recurring' => ['interval' => 'month', 'interval_count' => 1],
                        ]],
                        'has_more' => true,
                    ];
                }

                if ($params['product'] === 'prod_one' && $params['active'] === true) {
                    return (object) [
                        'data' => [[
                            'id' => 'price_one_monthly',
                            'active' => true,
                            'currency' => 'usd',
                            'unit_amount' => 5000,
                            'recurring' => ['interval' => 'month', 'interval_count' => 1],
                        ]],
                        'has_more' => false,
                    ];
                }

                if ($params['product'] === 'prod_one' && $params['active'] === false) {
                    return (object) [
                        'data' => [[
                            'id' => 'price_one_legacy',
                            'active' => false,
                            'currency' => 'usd',
                            'unit_amount' => 4000,
                            'recurring' => ['interval' => 'month', 'interval_count' => 1],
                        ]],
                        'has_more' => false,
                    ];
                }

                if ($params['product'] === 'prod_two' && $params['active'] === true) {
                    return (object) [
                        'data' => [[
                            'id' => 'price_two_monthly',
                            'active' => true,
                            'currency' => 'usd',
                            'unit_amount' => 9000,
                            'recurring' => ['interval' => 'month', 'interval_count' => 1],
                        ]],
                        'has_more' => false,
                    ];
                }

                return (object) [
                    'data' => [],
                    'has_more' => false,
                ];
            }
        };
        $stripe = new class($products, $prices)
        {
            public function __construct(
                public object $products,
                public object $prices,
            ) {}
        };

        $this->app->instance(StripeClient::class, $stripe);

        $directory = (new StripeProductDirectoryService($this->app))->directory();

        $this->assertCount(2, $products->calls);
        $this->assertSame(['data.default_price'], $products->calls[0]['expand']);
        $this->assertSame('prod_one', $products->calls[1]['starting_after']);
        $this->assertCount(5, $prices->calls);
        $this->assertSame([true, true, false, true, false], array_column($prices->calls, 'active'));
        $this->assertSame('price_one_monthly', $prices->calls[1]['starting_after']);
        $this->assertSame(2, $directory->products[0]['price_count']);
        $this->assertSame(['price_one_monthly', 'price_one_legacy'], $directory->products[0]['price_ids']);
        $this->assertSame(1, $directory->products[1]['price_count']);
    }
}
