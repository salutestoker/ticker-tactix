<?php

namespace App\Services\StripeSubscribers;

use Carbon\CarbonImmutable;

final readonly class StripeSubscriberDirectory
{
    /**
     * @param  list<array<string, mixed>>  $subscribers
     * @param  list<array{label: string, value: string, productIds: list<string>}>  $productOptions
     * @param  list<array{key: string, label: string}>  $metadataColumns
     */
    public function __construct(
        public array $subscribers,
        public array $productOptions,
        public array $metadataColumns,
        public CarbonImmutable $fetchedAt,
    ) {}

    /**
     * @return array{
     *     subscribers: list<array<string, mixed>>,
     *     productOptions: list<array{label: string, value: string, productIds: list<string>}>,
     *     metadataColumns: list<array{key: string, label: string}>,
     *     fetchedAt: string
     * }
     */
    public function toInertiaArray(): array
    {
        return [
            'subscribers' => $this->subscribers,
            'productOptions' => $this->productOptions,
            'metadataColumns' => $this->metadataColumns,
            'fetchedAt' => $this->fetchedAt->toIso8601String(),
        ];
    }
}
