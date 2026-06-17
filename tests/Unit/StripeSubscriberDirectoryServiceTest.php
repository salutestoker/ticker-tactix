<?php

namespace Tests\Unit;

use App\Services\StripeSubscribers\StripeSubscriberDirectoryService;
use Carbon\CarbonImmutable;
use Illuminate\Container\Container;
use PHPUnit\Framework\TestCase;

class StripeSubscriberDirectoryServiceTest extends TestCase
{
    public function test_it_normalizes_subscription_items_and_custom_metadata_columns(): void
    {
        $service = new StripeSubscriberDirectoryService(new Container);

        $directory = $service->normalizeSubscriptions([
            [
                'id' => 'sub_123',
                'status' => 'active',
                'created' => 1_781_654_400,
                'current_period_start' => 1_780_876_800,
                'current_period_end' => 1_783_555_200,
                'cancel_at_period_end' => false,
                'livemode' => false,
                'metadata' => [
                    'plan' => 'pro',
                ],
                'customer' => [
                    'id' => 'cus_123',
                    'name' => 'Ticker Customer',
                    'email' => 'customer@example.com',
                    'phone' => '555-0100',
                    'metadata' => [
                        'discord_id' => '123456',
                    ],
                    'invoice_settings' => [
                        'custom_fields' => [
                            [
                                'name' => 'Trader Code',
                                'value' => 'NYSE CORE',
                            ],
                        ],
                    ],
                ],
                'items' => [
                    'data' => [
                        [
                            'id' => 'si_momentum',
                            'quantity' => 2,
                            'price' => [
                                'id' => 'price_momentum',
                                'currency' => 'usd',
                                'unit_amount' => 7000,
                                'recurring' => [
                                    'interval' => 'month',
                                    'interval_count' => 1,
                                ],
                                'metadata' => [
                                    'cohort' => 'launch',
                                ],
                                'product' => [
                                    'id' => 'prod_momentum',
                                    'name' => 'Momentum Cycles',
                                    'metadata' => [
                                        'segment' => 'modules',
                                    ],
                                ],
                            ],
                        ],
                        [
                            'id' => 'si_newsletter',
                            'quantity' => 1,
                            'price' => [
                                'id' => 'price_newsletter',
                                'currency' => 'usd',
                                'unit_amount' => 4900,
                                'recurring' => [
                                    'interval' => 'month',
                                    'interval_count' => 1,
                                ],
                                'metadata' => [
                                    'cohort' => 'daily',
                                ],
                                'product' => [
                                    'id' => 'prod_newsletter',
                                    'name' => 'NYSE Newsletter',
                                    'metadata' => [
                                        'segment' => 'newsletters',
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ], CarbonImmutable::parse('2026-06-17T12:00:00Z'));

        $row = $directory->subscribers[0];
        $metadataColumnKeys = array_column($directory->metadataColumns, 'key');

        $this->assertSame('sub_123', $row['subscription_id']);
        $this->assertSame('Ticker Customer', $row['customer_name']);
        $this->assertSame(['Momentum Cycles', 'NYSE Newsletter'], $row['product_names']);
        $this->assertSame(['prod_momentum', 'prod_newsletter'], $row['product_ids']);
        $this->assertSame(['price_momentum', 'price_newsletter'], $row['price_ids']);
        $this->assertSame(['$70.00 USD / month', '$49.00 USD / month'], $row['amounts']);
        $this->assertSame(3, $row['quantity_total']);
        $this->assertSame('123456', $row['metadata']['customer.metadata.discord_id']);
        $this->assertSame('pro', $row['metadata']['subscription.metadata.plan']);
        $this->assertSame('modules; newsletters', $row['metadata']['product.metadata.segment']);
        $this->assertSame('launch; daily', $row['metadata']['price.metadata.cohort']);
        $this->assertSame('NYSE CORE', $row['metadata']['customer.invoice_custom_fields.trader_code']);
        $this->assertSame('2026-06-17T12:00:00+00:00', $directory->toInertiaArray()['fetchedAt']);
        $this->assertSame(['Momentum Cycles', 'NYSE Newsletter'], array_column($directory->productOptions, 'label'));
        $this->assertContains('customer.metadata.discord_id', $metadataColumnKeys);
        $this->assertContains('subscription.metadata.plan', $metadataColumnKeys);
        $this->assertContains('product.metadata.segment', $metadataColumnKeys);
        $this->assertContains('price.metadata.cohort', $metadataColumnKeys);
        $this->assertContains('customer.invoice_custom_fields.trader_code', $metadataColumnKeys);
    }

    public function test_it_handles_missing_customer_and_metadata_values(): void
    {
        $service = new StripeSubscriberDirectoryService(new Container);

        $directory = $service->normalizeSubscriptions([
            [
                'id' => 'sub_empty',
                'status' => 'trialing',
                'customer' => 'cus_empty',
                'items' => [
                    'data' => [],
                ],
            ],
        ], CarbonImmutable::parse('2026-06-17T12:00:00Z'));

        $row = $directory->subscribers[0];

        $this->assertSame('sub_empty', $row['subscription_id']);
        $this->assertSame('cus_empty', $row['customer_id']);
        $this->assertNull($row['customer_email']);
        $this->assertSame([], $row['product_names']);
        $this->assertSame([], $row['metadata']);
        $this->assertSame([], $directory->productOptions);
        $this->assertSame([], $directory->metadataColumns);
    }

    public function test_it_resolves_string_product_ids_from_expanded_prices(): void
    {
        $container = new Container;
        $products = new class
        {
            public int $retrieveCount = 0;

            public function retrieve(string $productId): array
            {
                $this->retrieveCount++;

                return [
                    'id' => $productId,
                    'name' => 'Resolved Stripe Product',
                    'metadata' => [
                        'segment' => 'resolved',
                    ],
                ];
            }
        };
        $stripe = new class($products)
        {
            public function __construct(public object $products) {}
        };

        $container->instance(\Stripe\StripeClient::class, $stripe);

        $service = new StripeSubscriberDirectoryService($container);

        $directory = $service->normalizeSubscriptions([
            [
                'id' => 'sub_string_product',
                'status' => 'active',
                'customer' => [
                    'id' => 'cus_123',
                    'email' => 'customer@example.com',
                ],
                'items' => [
                    'data' => [
                        [
                            'quantity' => 1,
                            'price' => [
                                'id' => 'price_one',
                                'currency' => 'usd',
                                'unit_amount' => 9900,
                                'recurring' => [
                                    'interval' => 'month',
                                    'interval_count' => 1,
                                ],
                                'product' => 'prod_resolved',
                            ],
                        ],
                        [
                            'quantity' => 1,
                            'price' => [
                                'id' => 'price_two',
                                'currency' => 'usd',
                                'unit_amount' => 9900,
                                'recurring' => [
                                    'interval' => 'month',
                                    'interval_count' => 1,
                                ],
                                'product' => 'prod_resolved',
                            ],
                        ],
                    ],
                ],
            ],
        ]);

        $row = $directory->subscribers[0];

        $this->assertSame(1, $products->retrieveCount);
        $this->assertSame(['Resolved Stripe Product'], $row['product_names']);
        $this->assertSame(['prod_resolved'], $row['product_ids']);
        $this->assertSame('resolved', $row['metadata']['product.metadata.segment']);
        $this->assertSame(['Resolved Stripe Product'], array_column($directory->productOptions, 'label'));
    }

    public function test_it_includes_checkout_session_custom_fields_as_dynamic_columns(): void
    {
        $container = new Container;
        $sessions = new class
        {
            public array $calls = [];

            public function all(array $params): object
            {
                $this->calls[] = $params;

                return (object) [
                    'data' => [
                        [
                            'id' => 'cs_checkout',
                            'subscription' => 'sub_checkout',
                            'custom_fields' => [
                                [
                                    'key' => 'discordusername',
                                    'label' => [
                                        'custom' => 'Discord Username',
                                        'type' => 'custom',
                                    ],
                                    'type' => 'text',
                                    'text' => [
                                        'value' => 'TickerTrader#1234',
                                    ],
                                ],
                                [
                                    'key' => 'tradingviewusername',
                                    'label' => [
                                        'custom' => 'TradingView Username',
                                        'type' => 'custom',
                                    ],
                                    'type' => 'text',
                                    'text' => [
                                        'value' => 'ChartPilot',
                                    ],
                                ],
                            ],
                        ],
                    ],
                    'has_more' => false,
                ];
            }
        };
        $stripe = new class($sessions)
        {
            public object $checkout;

            public function __construct(public object $sessions)
            {
                $this->checkout = (object) [
                    'sessions' => $sessions,
                ];
            }
        };

        $container->instance(\Stripe\StripeClient::class, $stripe);

        $service = new StripeSubscriberDirectoryService($container);

        $directory = $service->normalizeSubscriptions([
            [
                'id' => 'sub_checkout',
                'status' => 'active',
                'customer' => [
                    'id' => 'cus_checkout',
                    'email' => 'customer@example.com',
                ],
                'items' => [
                    'data' => [],
                ],
            ],
        ]);

        $row = $directory->subscribers[0];
        $metadataColumnLabels = array_column($directory->metadataColumns, 'label', 'key');

        $this->assertSame('sub_checkout', $sessions->calls[0]['subscription']);
        $this->assertSame('TickerTrader#1234', $row['metadata']['checkout.custom_fields.discordusername']);
        $this->assertSame('ChartPilot', $row['metadata']['checkout.custom_fields.tradingviewusername']);
        $this->assertSame('Discord @', $metadataColumnLabels['checkout.custom_fields.discordusername']);
        $this->assertSame('Trading View @', $metadataColumnLabels['checkout.custom_fields.tradingviewusername']);
    }
}
