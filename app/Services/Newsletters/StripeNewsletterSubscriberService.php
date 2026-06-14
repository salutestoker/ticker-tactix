<?php

namespace App\Services\Newsletters;

use Stripe\Customer;
use Stripe\StripeClient;

class StripeNewsletterSubscriberService
{
    public function __construct(private readonly StripeClient $stripe) {}

    /**
     * @param  list<string>  $statuses
     */
    public function recipientsForProduct(string $productId, array $statuses): NewsletterRecipientResult
    {
        $priceIds = $this->priceIdsForProduct($productId);
        $recipients = [];
        $skippedNoEmail = 0;

        foreach ($priceIds as $priceId) {
            foreach ($statuses as $status) {
                $startingAfter = null;

                do {
                    $params = [
                        'price' => $priceId,
                        'status' => $status,
                        'limit' => 100,
                        'expand' => ['data.customer'],
                    ];

                    if ($startingAfter !== null) {
                        $params['starting_after'] = $startingAfter;
                    }

                    $subscriptions = $this->stripe->subscriptions->all($params);

                    foreach ($subscriptions->data as $subscription) {
                        $customer = $this->resolveCustomer($subscription->customer);
                        $email = trim((string) ($customer?->email ?? ''));

                        if ($email === '') {
                            $skippedNoEmail++;

                            continue;
                        }

                        $customerId = (string) ($customer->id ?? $subscription->customer);
                        $key = strtolower($email);
                        $subscriptionId = (string) $subscription->id;

                        if (isset($recipients[$key])) {
                            $existing = $recipients[$key];
                            $subscriptionIds = array_values(array_unique([
                                ...$existing->subscriptionIds,
                                $subscriptionId,
                            ]));

                            $recipients[$key] = new NewsletterRecipient(
                                email: $existing->email,
                                customerId: $existing->customerId,
                                subscriptionIds: $subscriptionIds,
                                name: $existing->name,
                            );

                            continue;
                        }

                        $recipients[$key] = new NewsletterRecipient(
                            email: $email,
                            customerId: $customerId,
                            subscriptionIds: [$subscriptionId],
                            name: $customer->name ?? null,
                        );
                    }

                    $lastSubscription = $subscriptions->data[count($subscriptions->data) - 1] ?? null;
                    $startingAfter = $subscriptions->has_more && $lastSubscription !== null
                        ? (string) $lastSubscription->id
                        : null;
                } while ($startingAfter !== null);
            }
        }

        return new NewsletterRecipientResult(array_values($recipients), $skippedNoEmail);
    }

    public function createPortalUrl(string $customerId): string
    {
        $returnUrl = config('services.stripe.portal_return_url') ?: config('app.url');

        $session = $this->stripe->billingPortal->sessions->create([
            'customer' => $customerId,
            'return_url' => $returnUrl,
        ]);

        return (string) $session->url;
    }

    /**
     * @return list<string>
     */
    private function priceIdsForProduct(string $productId): array
    {
        $priceIds = [];
        $startingAfter = null;

        do {
            $params = [
                'product' => $productId,
                'type' => 'recurring',
                'limit' => 100,
            ];

            if ($startingAfter !== null) {
                $params['starting_after'] = $startingAfter;
            }

            $prices = $this->stripe->prices->all($params);

            foreach ($prices->data as $price) {
                $priceIds[] = (string) $price->id;
            }

            $lastPrice = $prices->data[count($prices->data) - 1] ?? null;
            $startingAfter = $prices->has_more && $lastPrice !== null
                ? (string) $lastPrice->id
                : null;
        } while ($startingAfter !== null);

        return $priceIds;
    }

    private function resolveCustomer(mixed $customer): ?Customer
    {
        if ($customer instanceof Customer) {
            return $customer;
        }

        if (is_string($customer) && $customer !== '') {
            $retrieved = $this->stripe->customers->retrieve($customer);

            return $retrieved instanceof Customer ? $retrieved : null;
        }

        return null;
    }
}
