<?php

namespace App\Services\StripeProducts;

use App\Models\Module;
use App\Models\Playbook;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Container\Container;
use Illuminate\Support\Str;
use Stripe\StripeClient;
use Stripe\StripeObject;
use Traversable;

class StripeProductDirectoryService
{
    public function __construct(private readonly Container $container) {}

    public function directory(): StripeProductDirectory
    {
        $products = $this->fetchProducts();
        $pricesByProduct = [];

        foreach ($products as $product) {
            $productId = $this->stringValue(data_get($this->arrayValue($product), 'id'));

            if ($productId !== null) {
                $pricesByProduct[$productId] = $this->fetchPricesForProduct($productId);
            }
        }

        return $this->normalizeProducts(
            products: $products,
            pricesByProduct: $pricesByProduct,
            fetchedAt: CarbonImmutable::now('UTC'),
            catalogItems: $this->localCatalogItems(),
        );
    }

    /**
     * @param  iterable<mixed>  $products
     * @param  array<string, iterable<mixed>>  $pricesByProduct
     * @param  list<array<string, mixed>>|null  $catalogItems
     */
    public function normalizeProducts(
        iterable $products,
        array $pricesByProduct = [],
        ?CarbonImmutable $fetchedAt = null,
        ?array $catalogItems = null,
    ): StripeProductDirectory {
        $rows = [];
        $metadataColumns = [];
        $catalogItems ??= [];

        foreach ($products as $index => $product) {
            $row = $this->normalizeProduct(
                product: $product,
                pricesByProduct: $pricesByProduct,
                catalogItems: $catalogItems,
                index: (int) $index,
            );

            $rows[] = $row;

            foreach (array_keys($row['metadata']) as $key) {
                $metadataColumns[$key] = [
                    'key' => $key,
                    'label' => $this->metadataLabel($key),
                ];
            }
        }

        $metadataColumns = array_values($metadataColumns);
        usort($metadataColumns, fn (array $left, array $right): int => strnatcasecmp($left['label'], $right['label']));

        return new StripeProductDirectory(
            products: $rows,
            metadataColumns: $metadataColumns,
            fetchedAt: $fetchedAt ?? CarbonImmutable::now('UTC'),
        );
    }

    /**
     * @return list<mixed>
     */
    private function fetchProducts(): array
    {
        /** @var StripeClient $stripe */
        $stripe = $this->container->make(StripeClient::class);
        $products = [];
        $startingAfter = null;

        do {
            $params = [
                'limit' => 100,
                'expand' => ['data.default_price'],
            ];

            if ($startingAfter !== null) {
                $params['starting_after'] = $startingAfter;
            }

            $page = $stripe->products->all($params);

            foreach ($page->data as $product) {
                $products[] = $product;
            }

            $lastProduct = $page->data[count($page->data) - 1] ?? null;
            $startingAfter = $page->has_more && $lastProduct !== null
                ? $this->stringValue(data_get($lastProduct, 'id'))
                : null;
        } while ($startingAfter !== null);

        return $products;
    }

    /**
     * @return list<mixed>
     */
    private function fetchPricesForProduct(string $productId): array
    {
        /** @var StripeClient $stripe */
        $stripe = $this->container->make(StripeClient::class);
        $prices = [];

        foreach ([true, false] as $active) {
            $startingAfter = null;

            do {
                $params = [
                    'product' => $productId,
                    'limit' => 100,
                    'active' => $active,
                ];

                if ($startingAfter !== null) {
                    $params['starting_after'] = $startingAfter;
                }

                $page = $stripe->prices->all($params);

                foreach ($page->data as $price) {
                    $prices[] = $price;
                }

                $lastPrice = $page->data[count($page->data) - 1] ?? null;
                $startingAfter = $page->has_more && $lastPrice !== null
                    ? $this->stringValue(data_get($lastPrice, 'id'))
                    : null;
            } while ($startingAfter !== null);
        }

        return $this->uniquePriceRows($prices);
    }

    /**
     * @param  array<string, iterable<mixed>>  $pricesByProduct
     * @param  list<array<string, mixed>>  $catalogItems
     * @return array<string, mixed>
     */
    private function normalizeProduct(
        mixed $product,
        array $pricesByProduct,
        array $catalogItems,
        int $index,
    ): array {
        $product = $this->arrayValue($product);
        $productId = $this->stringValue(data_get($product, 'id'));
        $defaultPriceValue = data_get($product, 'default_price');
        $defaultPrice = $this->arrayValue($defaultPriceValue);
        $defaultPriceId = $this->stringValue(data_get($defaultPrice, 'id'))
            ?? $this->stringValue($defaultPriceValue);
        $prices = $productId !== null
            ? $this->listValue($pricesByProduct[$productId] ?? [])
            : [];

        if ($defaultPrice !== []) {
            $prices[] = $defaultPrice;
        }

        $prices = $this->uniquePriceRows($prices);
        $priceSummaries = array_values(array_map(
            fn (mixed $price): array => $this->normalizePrice($price),
            $prices,
        ));
        $priceIds = $this->uniqueStrings(array_column($priceSummaries, 'id'));
        $priceAmounts = $this->uniqueStrings(array_column($priceSummaries, 'amount'));
        $priceIntervals = $this->uniqueStrings(array_column($priceSummaries, 'interval'));
        $currencyCodes = $this->uniqueStrings(array_column($priceSummaries, 'currency'));
        $metadata = [];

        $this->addMetadata($metadata, 'product.metadata.', data_get($product, 'metadata'));

        foreach ($prices as $price) {
            $this->addMetadata($metadata, 'price.metadata.', data_get($this->arrayValue($price), 'metadata'));
        }

        $defaultPriceAmount = null;

        foreach ($priceSummaries as $price) {
            if ($price['id'] === $defaultPriceId) {
                $defaultPriceAmount = $price['amount'];

                break;
            }
        }

        if ($defaultPriceAmount === null && $defaultPrice !== []) {
            $defaultPriceAmount = $this->amountDisplay($defaultPrice);
        }

        $localCatalog = $this->matchingCatalogItems(
            catalogItems: $catalogItems,
            productId: $productId,
            priceIds: array_values(array_filter([$defaultPriceId, ...$priceIds])),
        );

        return [
            'id' => $productId ?? 'product_'.$index,
            'product_id' => $productId,
            'name' => $this->stringValue(data_get($product, 'name')) ?? $productId ?? 'Unnamed product',
            'description' => $this->stringValue(data_get($product, 'description')),
            'active' => $this->boolValue(data_get($product, 'active')),
            'url' => $this->stringValue(data_get($product, 'url')),
            'type' => $this->stringValue(data_get($product, 'type')),
            'default_price_id' => $defaultPriceId,
            'default_price_amount' => $defaultPriceAmount,
            'price_count' => count($priceSummaries),
            'prices' => $priceSummaries,
            'price_ids' => $priceIds,
            'price_amounts' => $priceAmounts,
            'price_intervals' => $priceIntervals,
            'currency_codes' => $currencyCodes,
            'local_catalog' => $localCatalog,
            'local_catalog_labels' => $this->uniqueStrings(array_column($localCatalog, 'label')),
            'local_catalog_types' => $this->uniqueStrings(array_column($localCatalog, 'type')),
            'livemode' => $this->boolValue(data_get($product, 'livemode')),
            'created_at' => $this->timestamp(data_get($product, 'created')),
            'updated_at' => $this->timestamp(data_get($product, 'updated')),
            'metadata' => $metadata,
        ];
    }

    /**
     * @return array{
     *     id: string|null,
     *     active: bool|null,
     *     amount: string|null,
     *     interval: string|null,
     *     currency: string|null,
     *     nickname: string|null,
     *     lookup_key: string|null,
     *     type: string|null
     * }
     */
    private function normalizePrice(mixed $price): array
    {
        $price = $this->arrayValue($price);
        $currency = $this->stringValue(data_get($price, 'currency'));

        return [
            'id' => $this->stringValue(data_get($price, 'id')),
            'active' => $this->boolValue(data_get($price, 'active')),
            'amount' => $this->amountDisplay($price),
            'interval' => $this->intervalDisplay(
                interval: $this->stringValue(data_get($price, 'recurring.interval')),
                intervalCount: $this->intValue(data_get($price, 'recurring.interval_count')),
            ),
            'currency' => $currency ? strtoupper($currency) : null,
            'nickname' => $this->stringValue(data_get($price, 'nickname')),
            'lookup_key' => $this->stringValue(data_get($price, 'lookup_key')),
            'type' => $this->stringValue(data_get($price, 'type')),
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function localCatalogItems(): array
    {
        $items = [];

        Module::query()
            ->where(function ($query): void {
                $query
                    ->whereNotNull('stripe_product_id')
                    ->orWhereNotNull('stripe_price_id');
            })
            ->orderBy('title')
            ->get(['id', 'title', 'slug', 'stripe_product_id', 'stripe_price_id'])
            ->each(function (Module $module) use (&$items): void {
                $items[] = [
                    'type' => 'Module',
                    'label' => $module->title,
                    'id' => (string) $module->id,
                    'slug' => $module->slug,
                    'url' => route('admin.modules.edit', $module),
                    'stripe_product_id' => $module->stripe_product_id,
                    'stripe_price_id' => $module->stripe_price_id,
                ];
            });

        Playbook::query()
            ->where(function ($query): void {
                $query
                    ->whereNotNull('stripe_product_id')
                    ->orWhereNotNull('stripe_price_id');
            })
            ->orderBy('title')
            ->get(['id', 'title', 'slug', 'stripe_product_id', 'stripe_price_id'])
            ->each(function (Playbook $playbook) use (&$items): void {
                $items[] = [
                    'type' => 'Playbook',
                    'label' => $playbook->title,
                    'id' => (string) $playbook->id,
                    'slug' => $playbook->slug,
                    'url' => route('admin.playbooks.edit', $playbook),
                    'stripe_product_id' => $playbook->stripe_product_id,
                    'stripe_price_id' => $playbook->stripe_price_id,
                ];
            });

        foreach ((array) config('newsletters.templates', []) as $key => $template) {
            if (! is_array($template)) {
                continue;
            }

            $productId = $this->stringValue($template['stripe_product_id'] ?? null);

            if ($productId === null) {
                continue;
            }

            $items[] = [
                'type' => 'Newsletter',
                'label' => $this->stringValue($template['name'] ?? null) ?? Str::headline((string) $key),
                'id' => (string) $key,
                'slug' => (string) $key,
                'url' => route('admin.newsletter-generator'),
                'stripe_product_id' => $productId,
                'stripe_price_id' => null,
            ];
        }

        return $items;
    }

    /**
     * @param  list<array<string, mixed>>  $catalogItems
     * @param  list<string>  $priceIds
     * @return list<array<string, mixed>>
     */
    private function matchingCatalogItems(array $catalogItems, ?string $productId, array $priceIds): array
    {
        $matched = [];

        foreach ($catalogItems as $item) {
            $itemProductId = $this->stringValue($item['stripe_product_id'] ?? null);
            $itemPriceId = $this->stringValue($item['stripe_price_id'] ?? null);

            if (
                ($productId !== null && $itemProductId === $productId)
                || ($itemPriceId !== null && in_array($itemPriceId, $priceIds, true))
            ) {
                $matched[] = [
                    'type' => $this->stringValue($item['type'] ?? null) ?? 'Catalog',
                    'label' => $this->stringValue($item['label'] ?? null) ?? 'Untitled',
                    'id' => $this->stringValue($item['id'] ?? null),
                    'slug' => $this->stringValue($item['slug'] ?? null),
                    'url' => $this->stringValue($item['url'] ?? null),
                    'stripe_product_id' => $itemProductId,
                    'stripe_price_id' => $itemPriceId,
                ];
            }
        }

        return $this->uniqueCatalogItems($matched);
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
        $sources = [
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

    private function fieldLabel(string $key): string
    {
        return str_replace('Tradingview', 'TradingView', Str::headline($key));
    }

    /**
     * @param  array<string, mixed>  $price
     */
    private function amountDisplay(array $price): ?string
    {
        $currency = $this->stringValue(data_get($price, 'currency'));
        $unitAmount = data_get($price, 'unit_amount') ?? data_get($price, 'unit_amount_decimal');

        if (! is_numeric($unitAmount)) {
            return $currency ? 'Custom '.strtoupper($currency) : null;
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
     * @param  list<mixed>  $prices
     * @return list<array<string, mixed>>
     */
    private function uniquePriceRows(array $prices): array
    {
        $unique = [];

        foreach ($prices as $index => $price) {
            $price = $this->arrayValue($price);
            $key = $this->stringValue(data_get($price, 'id')) ?? 'price_'.$index;
            $unique[$key] = $price;
        }

        return array_values($unique);
    }

    /**
     * @param  list<array<string, mixed>>  $items
     * @return list<array<string, mixed>>
     */
    private function uniqueCatalogItems(array $items): array
    {
        $unique = [];

        foreach ($items as $item) {
            $key = ($item['type'] ?? '').'|'.($item['id'] ?? '').'|'.($item['label'] ?? '');
            $unique[$key] = $item;
        }

        return array_values($unique);
    }
}
