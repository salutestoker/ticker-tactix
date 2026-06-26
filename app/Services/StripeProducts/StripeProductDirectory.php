<?php

namespace App\Services\StripeProducts;

use Carbon\CarbonImmutable;

final readonly class StripeProductDirectory
{
    /**
     * @param  list<array<string, mixed>>  $products
     * @param  list<array{key: string, label: string}>  $metadataColumns
     */
    public function __construct(
        public array $products,
        public array $metadataColumns,
        public CarbonImmutable $fetchedAt,
    ) {}

    /**
     * @return array{
     *     products: list<array<string, mixed>>,
     *     metadataColumns: list<array{key: string, label: string}>,
     *     fetchedAt: string
     * }
     */
    public function toInertiaArray(): array
    {
        return [
            'products' => $this->products,
            'metadataColumns' => $this->metadataColumns,
            'fetchedAt' => $this->fetchedAt->toIso8601String(),
        ];
    }
}
