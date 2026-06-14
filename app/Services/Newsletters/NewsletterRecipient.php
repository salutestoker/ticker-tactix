<?php

namespace App\Services\Newsletters;

final readonly class NewsletterRecipient
{
    /**
     * @param  list<string>  $subscriptionIds
     */
    public function __construct(
        public string $email,
        public string $customerId,
        public array $subscriptionIds = [],
        public ?string $name = null,
    ) {}
}
