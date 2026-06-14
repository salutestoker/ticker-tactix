<?php

namespace App\Services\Newsletters;

final readonly class NewsletterRecipientResult
{
    /**
     * @param  list<NewsletterRecipient>  $recipients
     */
    public function __construct(
        public array $recipients,
        public int $skippedNoEmail = 0,
    ) {}

    public function count(): int
    {
        return count($this->recipients);
    }
}
