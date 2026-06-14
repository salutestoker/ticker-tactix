<?php

use App\Models\NewsletterGeneration;

return [
    'image_disk' => env('NEWSLETTER_IMAGE_DISK', 'local'),
    'image_directory' => env('NEWSLETTER_IMAGE_DIRECTORY', 'newsletter-deliveries'),
    'test_emails' => env('NEWSLETTER_TEST_EMAILS', ''),

    'templates' => [
        NewsletterGeneration::TEMPLATE_NYSE_MARKET_ENVIRONMENT => [
            'name' => 'NYSE Market Environment',
            'stripe_product_id' => env('STRIPE_NYSE_NEWSLETTER_PRODUCT_ID'),
            'subscription_statuses' => ['active', 'past_due', 'trialing'],
            'default_subject' => env('NYSE_NEWSLETTER_DEFAULT_SUBJECT', 'Ticker Tactix NYSE ETF Environment'),
            'default_preheader' => env('NYSE_NEWSLETTER_DEFAULT_PREHEADER', 'Daily market intelligence from Ticker Tactix.'),
            'mail_view' => 'emails.newsletters.subscription',
        ],
    ],
];
