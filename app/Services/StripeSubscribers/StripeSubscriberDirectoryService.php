<?php

namespace App\Services\StripeSubscribers;

use Carbon\CarbonImmutable;
use Illuminate\Contracts\Container\Container;
use Illuminate\Support\Str;
use Stripe\StripeClient;
use Stripe\StripeObject;
use Traversable;

class StripeSubscriberDirectoryService
{
    /** @var array<string, array<string, mixed>|null> */
    private array $productCache = [];

    /** @var array<string, list<array<string, mixed>>> */
    private array $checkoutSessionCache = [];

    public function __construct(private readonly Container $container) {}

    public function directory(): StripeSubscriberDirectory
    {
        return $this->normalizeSubscriptions(
            subscriptions: $this->fetchSubscriptions(),
            fetchedAt: CarbonImmutable::now('UTC'),
        );
    }

    /**
     * @param  iterable<mixed>  $subscriptions
     */
    public function normalizeSubscriptions(
        iterable $subscriptions,
        ?CarbonImmutable $fetchedAt = null,
    ): StripeSubscriberDirectory {
        $rows = [];
        $productOptions = [];
        $metadataColumns = [];

        foreach ($subscriptions as $index => $subscription) {
            $row = $this->normalizeSubscription($subscription, (int) $index);
            $rows[] = $row;

            foreach ($row['products'] as $product) {
                $name = $this->stringValue($product['name'] ?? null);

                if ($name === null) {
                    continue;
                }

                $productOptions[$name] ??= [
                    'label' => $name,
                    'value' => $name,
                    'productIds' => [],
                ];

                $productId = $this->stringValue($product['id'] ?? null);

                if ($productId !== null) {
                    $productOptions[$name]['productIds'][] = $productId;
                }
            }

            foreach (array_keys($row['metadata']) as $key) {
                $metadataColumns[$key] = [
                    'key' => $key,
                    'label' => $this->metadataLabel($key),
                ];
            }
        }

        $productOptions = array_values(array_map(
            fn (array $option): array => [
                ...$option,
                'productIds' => $this->uniqueStrings($option['productIds']),
            ],
            $productOptions,
        ));
        usort($productOptions, fn (array $left, array $right): int => strnatcasecmp($left['label'], $right['label']));

        $metadataColumns = array_values($metadataColumns);
        usort($metadataColumns, fn (array $left, array $right): int => strnatcasecmp($left['label'], $right['label']));

        return new StripeSubscriberDirectory(
            subscribers: $rows,
            productOptions: $productOptions,
            metadataColumns: $metadataColumns,
            fetchedAt: $fetchedAt ?? CarbonImmutable::now('UTC'),
        );
    }

    /**
     * @return list<mixed>
     */
    private function fetchSubscriptions(): array
    {
        /** @var StripeClient $stripe */
        $stripe = $this->container->make(StripeClient::class);
        $subscriptions = [];
        $startingAfter = null;

        do {
            $params = [
                'limit' => 100,
                'expand' => [
                    'data.customer',
                    'data.items.data.price',
                ],
            ];

            if ($startingAfter !== null) {
                $params['starting_after'] = $startingAfter;
            }

            $page = $stripe->subscriptions->all($params);

            foreach ($page->data as $subscription) {
                $subscriptions[] = $subscription;
            }

            $lastSubscription = $page->data[count($page->data) - 1] ?? null;
            $startingAfter = $page->has_more && $lastSubscription !== null
                ? $this->stringValue(data_get($lastSubscription, 'id'))
                : null;
        } while ($startingAfter !== null);

        return $subscriptions;
    }

    /**
     * @return array<string, mixed>
     */
    private function normalizeSubscription(mixed $subscription, int $index): array
    {
        $subscription = $this->arrayValue($subscription);
        $customer = $this->arrayValue(data_get($subscription, 'customer'));
        $metadata = [];
        $products = [];
        $productNames = [];
        $productIds = [];
        $priceIds = [];
        $amounts = [];
        $intervals = [];
        $currencyCodes = [];
        $quantityTotal = 0;

        $this->addMetadata($metadata, 'customer.metadata.', data_get($customer, 'metadata'));
        $this->addMetadata($metadata, 'subscription.metadata.', data_get($subscription, 'metadata'));
        $this->addInvoiceCustomFields($metadata, data_get($customer, 'invoice_settings.custom_fields'));

        foreach ($this->listValue(data_get($subscription, 'items.data')) as $item) {
            $item = $this->arrayValue($item);
            $price = $this->arrayValue(data_get($item, 'price'));
            $product = $this->productForPrice($price);
            $productId = $this->stringValue(data_get($product, 'id'))
                ?? $this->stringValue(data_get($price, 'product'));
            $productName = $this->stringValue(data_get($product, 'name')) ?? $productId;
            $priceId = $this->stringValue(data_get($price, 'id'));
            $quantity = $this->intValue(data_get($item, 'quantity')) ?? 1;
            $interval = $this->intervalDisplay(
                interval: $this->stringValue(data_get($price, 'recurring.interval')),
                intervalCount: $this->intValue(data_get($price, 'recurring.interval_count')),
            );
            $amount = $this->amountDisplay($price);
            $currency = $this->stringValue(data_get($price, 'currency'));

            if ($productName !== null) {
                $productNames[] = $productName;
                $products[] = [
                    'name' => $productName,
                    'id' => $productId,
                ];
            }

            if ($productId !== null) {
                $productIds[] = $productId;
            }

            if ($priceId !== null) {
                $priceIds[] = $priceId;
            }

            if ($amount !== null) {
                $amounts[] = $amount;
            }

            if ($interval !== null) {
                $intervals[] = $interval;
            }

            if ($currency !== null) {
                $currencyCodes[] = strtoupper($currency);
            }

            $quantityTotal += $quantity;

            $this->addMetadata($metadata, 'product.metadata.', data_get($product, 'metadata'));
            $this->addMetadata($metadata, 'price.metadata.', data_get($price, 'metadata'));
        }

        $subscriptionId = $this->stringValue(data_get($subscription, 'id'));
        $customerId = $this->stringValue(data_get($customer, 'id'))
            ?? $this->stringValue(data_get($subscription, 'customer'));

        $this->addCheckoutCustomFields($metadata, $subscriptionId);

        return [
            'id' => $subscriptionId ?? 'subscription_'.$index,
            'customer_id' => $customerId,
            'customer_name' => $this->stringValue(data_get($customer, 'name')),
            'customer_email' => $this->stringValue(data_get($customer, 'email')),
            'customer_phone' => $this->stringValue(data_get($customer, 'phone')),
            'subscription_id' => $subscriptionId,
            'subscription_status' => $this->stringValue(data_get($subscription, 'status')),
            'product_names' => $this->uniqueStrings($productNames),
            'product_ids' => $this->uniqueStrings($productIds),
            'products' => $this->uniqueProducts($products),
            'price_ids' => $this->uniqueStrings($priceIds),
            'amounts' => $this->uniqueStrings($amounts),
            'intervals' => $this->uniqueStrings($intervals),
            'quantity_total' => $quantityTotal,
            'currency_codes' => $this->uniqueStrings($currencyCodes),
            'current_period_start' => $this->timestamp(data_get($subscription, 'current_period_start')),
            'current_period_end' => $this->timestamp(data_get($subscription, 'current_period_end')),
            'cancel_at' => $this->timestamp(data_get($subscription, 'cancel_at')),
            'canceled_at' => $this->timestamp(data_get($subscription, 'canceled_at')),
            'ended_at' => $this->timestamp(data_get($subscription, 'ended_at')),
            'trial_start' => $this->timestamp(data_get($subscription, 'trial_start')),
            'trial_end' => $this->timestamp(data_get($subscription, 'trial_end')),
            'created_at' => $this->timestamp(data_get($subscription, 'created')),
            'cancel_at_period_end' => $this->boolValue(data_get($subscription, 'cancel_at_period_end')),
            'livemode' => $this->boolValue(data_get($subscription, 'livemode')),
            'metadata' => $metadata,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function arrayValue(mixed $value): array
    {
        if ($value instanceof StripeObject) {
            return $value->toArray();
        }

        if (is_array($value)) {
            return $value;
        }

        if ($value instanceof Traversable) {
            return iterator_to_array($value);
        }

        if (is_object($value) && method_exists($value, 'toArray')) {
            $array = $value->toArray();

            return is_array($array) ? $array : [];
        }

        if (is_object($value)) {
            return get_object_vars($value);
        }

        return [];
    }

    /**
     * @return list<mixed>
     */
    private function listValue(mixed $value): array
    {
        return array_values($this->arrayValue($value));
    }

    private function addMetadata(array &$metadata, string $prefix, mixed $values): void
    {
        foreach ($this->arrayValue($values) as $key => $value) {
            $key = trim((string) $key);

            if ($key === '') {
                continue;
            }

            $this->appendMetadata($metadata, $prefix.$key, $this->displayValue($value));
        }
    }

    /**
     * @param  array<string, mixed>  $price
     * @return array<string, mixed>
     */
    private function productForPrice(array $price): array
    {
        $product = data_get($price, 'product');

        if (is_string($product) && $product !== '') {
            return $this->productById($product) ?? [];
        }

        return $this->arrayValue($product);
    }

    /**
     * @return array<string, mixed>|null
     */
    private function productById(string $productId): ?array
    {
        if (array_key_exists($productId, $this->productCache)) {
            return $this->productCache[$productId];
        }

        /** @var StripeClient $stripe */
        $stripe = $this->container->make(StripeClient::class);
        $product = $this->arrayValue($stripe->products->retrieve($productId));

        $this->productCache[$productId] = $product === [] ? null : $product;

        return $this->productCache[$productId];
    }

    private function addInvoiceCustomFields(array &$metadata, mixed $customFields): void
    {
        foreach ($this->listValue($customFields) as $field) {
            $field = $this->arrayValue($field);
            $name = $this->stringValue(data_get($field, 'name'));

            if ($name === null) {
                continue;
            }

            $key = 'customer.invoice_custom_fields.'.Str::slug($name, '_');

            $this->appendMetadata($metadata, $key, $this->displayValue(data_get($field, 'value')));
        }
    }

    private function addCheckoutCustomFields(array &$metadata, ?string $subscriptionId): void
    {
        if ($subscriptionId === null || ! $this->container->bound(StripeClient::class)) {
            return;
        }

        foreach ($this->checkoutSessionsForSubscription($subscriptionId) as $session) {
            foreach ($this->listValue(data_get($session, 'custom_fields')) as $field) {
                $field = $this->arrayValue($field);
                $key = $this->checkoutCustomFieldKey($field);

                if ($key === null) {
                    continue;
                }

                $this->appendMetadata(
                    $metadata,
                    'checkout.custom_fields.'.$key,
                    $this->checkoutCustomFieldValue($field),
                );
            }
        }
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function checkoutSessionsForSubscription(string $subscriptionId): array
    {
        if (array_key_exists($subscriptionId, $this->checkoutSessionCache)) {
            return $this->checkoutSessionCache[$subscriptionId];
        }

        /** @var StripeClient $stripe */
        $stripe = $this->container->make(StripeClient::class);
        $sessionsService = $this->checkoutSessionsService($stripe);

        if ($sessionsService === null) {
            $this->checkoutSessionCache[$subscriptionId] = [];

            return [];
        }

        $sessions = [];
        $startingAfter = null;

        do {
            $params = [
                'limit' => 100,
                'subscription' => $subscriptionId,
            ];

            if ($startingAfter !== null) {
                $params['starting_after'] = $startingAfter;
            }

            $page = $this->arrayValue($sessionsService->all($params));
            $pageData = $this->listValue(data_get($page, 'data'));

            foreach ($pageData as $session) {
                $sessions[] = $this->arrayValue($session);
            }

            $lastSession = $pageData[count($pageData) - 1] ?? null;
            $startingAfter = $this->boolValue(data_get($page, 'has_more')) && $lastSession !== null
                ? $this->stringValue(data_get($lastSession, 'id'))
                : null;
        } while ($startingAfter !== null);

        $this->checkoutSessionCache[$subscriptionId] = $sessions;

        return $sessions;
    }

    private function checkoutSessionsService(mixed $stripe): ?object
    {
        if ($stripe instanceof StripeClient) {
            $sessionsService = $stripe->checkout->sessions;

            return is_object($sessionsService) && method_exists($sessionsService, 'all')
                ? $sessionsService
                : null;
        }

        if (! is_object($stripe) || ! property_exists($stripe, 'checkout')) {
            return null;
        }

        $checkout = $stripe->checkout;

        if (! is_object($checkout) || ! property_exists($checkout, 'sessions')) {
            return null;
        }

        $sessionsService = $checkout->sessions;

        return is_object($sessionsService) && method_exists($sessionsService, 'all')
            ? $sessionsService
            : null;
    }

    /**
     * @param  array<string, mixed>  $field
     */
    private function checkoutCustomFieldKey(array $field): ?string
    {
        $key = $this->stringValue(data_get($field, 'key'))
            ?? $this->stringValue(data_get($field, 'label.custom'))
            ?? $this->stringValue(data_get($field, 'label'));

        return $key === null ? null : Str::slug($key, '_');
    }

    /**
     * @param  array<string, mixed>  $field
     */
    private function checkoutCustomFieldValue(array $field): ?string
    {
        $type = $this->stringValue(data_get($field, 'type'));

        return match ($type) {
            'dropdown' => $this->displayValue(
                data_get($field, 'dropdown.value')
                    ?? data_get($field, 'dropdown.default_value')
            ),
            'numeric' => $this->displayValue(
                data_get($field, 'numeric.value')
                    ?? data_get($field, 'numeric.default_value')
            ),
            'text' => $this->displayValue(
                data_get($field, 'text.value')
                    ?? data_get($field, 'text.default_value')
            ),
            default => $this->displayValue(data_get($field, 'value')),
        };
    }

    private function appendMetadata(array &$metadata, string $key, ?string $value): void
    {
        if ($value === null || $value === '') {
            return;
        }

        if (! isset($metadata[$key])) {
            $metadata[$key] = $value;

            return;
        }

        $values = array_filter(array_map('trim', explode(';', (string) $metadata[$key])));

        if (! in_array($value, $values, true)) {
            $values[] = $value;
        }

        $metadata[$key] = implode('; ', $values);
    }

    private function metadataLabel(string $key): string
    {
        if (str_starts_with($key, 'checkout.custom_fields.')) {
            return $this->checkoutCustomFieldLabel(substr($key, strlen('checkout.custom_fields.')));
        }

        $sources = [
            'customer.invoice_custom_fields.' => 'Invoice field: ',
            'customer.metadata.' => 'Customer: ',
            'subscription.metadata.' => 'Subscription: ',
            'product.metadata.' => 'Product: ',
            'price.metadata.' => 'Price: ',
        ];

        foreach ($sources as $prefix => $labelPrefix) {
            if (str_starts_with($key, $prefix)) {
                return $labelPrefix.$this->fieldLabel(substr($key, strlen($prefix)));
            }
        }

        return $this->fieldLabel($key);
    }

    private function checkoutCustomFieldLabel(string $key): string
    {
        $normalized = Str::of($key)
            ->lower()
            ->replace(['_', '-', ' '], '')
            ->toString();

        return match ($normalized) {
            'discord', 'discordusername' => 'Discord @',
            'tradingview', 'tradingviewusername' => 'Trading View @',
            default => 'Checkout field: '.$this->fieldLabel($key),
        };
    }

    private function fieldLabel(string $key): string
    {
        return str_replace('Tradingview', 'TradingView', Str::headline($key));
    }

    private function amountDisplay(array $price): ?string
    {
        $currency = $this->stringValue(data_get($price, 'currency'));
        $unitAmount = data_get($price, 'unit_amount') ?? data_get($price, 'unit_amount_decimal');

        if (! is_numeric($unitAmount)) {
            return $currency ? strtoupper($currency) : null;
        }

        $amount = number_format(((float) $unitAmount) / 100, 2);
        $prefix = strtolower((string) $currency) === 'usd' ? '$' : '';
        $suffix = $currency ? ' '.strtoupper($currency) : '';
        $interval = $this->intervalDisplay(
            interval: $this->stringValue(data_get($price, 'recurring.interval')),
            intervalCount: $this->intValue(data_get($price, 'recurring.interval_count')),
        );

        return trim($prefix.$amount.$suffix.($interval ? ' / '.$interval : ''));
    }

    private function intervalDisplay(?string $interval, ?int $intervalCount): ?string
    {
        if ($interval === null) {
            return null;
        }

        if ($intervalCount !== null && $intervalCount > 1) {
            return $intervalCount.' '.$interval.'s';
        }

        return $interval;
    }

    private function timestamp(mixed $value): ?string
    {
        return is_numeric($value)
            ? CarbonImmutable::createFromTimestampUTC((int) $value)->toIso8601String()
            : null;
    }

    private function displayValue(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        if (is_bool($value)) {
            return $value ? 'Yes' : 'No';
        }

        if (is_scalar($value)) {
            $value = trim((string) $value);

            return $value === '' ? null : $value;
        }

        $encoded = json_encode($value, JSON_UNESCAPED_SLASHES);

        return is_string($encoded) && $encoded !== '' ? $encoded : null;
    }

    private function stringValue(mixed $value): ?string
    {
        if (! is_scalar($value)) {
            return null;
        }

        $value = trim((string) $value);

        return $value === '' ? null : $value;
    }

    private function intValue(mixed $value): ?int
    {
        return is_numeric($value) ? (int) $value : null;
    }

    private function boolValue(mixed $value): ?bool
    {
        return $value === null ? null : (bool) $value;
    }

    /**
     * @param  list<mixed>  $values
     * @return list<string>
     */
    private function uniqueStrings(array $values): array
    {
        return array_values(array_unique(array_filter(array_map(
            fn (mixed $value): ?string => $this->stringValue($value),
            $values,
        ))));
    }

    /**
     * @param  list<array{name: string, id: string|null}>  $products
     * @return list<array{name: string, id: string|null}>
     */
    private function uniqueProducts(array $products): array
    {
        $unique = [];

        foreach ($products as $product) {
            $key = ($product['name'] ?? '').'|'.($product['id'] ?? '');
            $unique[$key] = $product;
        }

        return array_values($unique);
    }
}
