<?php

namespace App\Services;

use App\Jobs\SendSubscriptionWelcomeEmailJob;
use App\Models\Module;
use App\Models\Playbook;
use App\Models\StripeWebhookEvent;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use Stripe\Event;
use Stripe\Invoice;

class StripeSubscriptionWelcomeEmailService
{
    public function handle(Event $event): StripeWebhookEvent
    {
        $webhookEvent = StripeWebhookEvent::firstOrCreate(
            ['stripe_event_id' => (string) $event->id],
            [
                'stripe_event_type' => (string) $event->type,
                'stripe_created_at' => $this->timestamp($event->created ?? null),
                'status' => StripeWebhookEvent::STATUS_RECEIVED,
            ],
        );

        if (
            ! $webhookEvent->wasRecentlyCreated
            && $webhookEvent->status !== StripeWebhookEvent::STATUS_RECEIVED
        ) {
            return $webhookEvent;
        }

        $webhookEvent->forceFill([
            'stripe_event_type' => (string) $event->type,
            'stripe_created_at' => $this->timestamp($event->created ?? null),
        ])->save();

        if ($event->type !== 'invoice.paid') {
            return $this->skip($webhookEvent, 'Unsupported Stripe event type.');
        }

        $invoice = $event->data->object ?? null;

        if (! $invoice instanceof Invoice) {
            return $this->skip($webhookEvent, 'Stripe event did not contain an invoice object.');
        }

        $this->recordInvoice($webhookEvent, $invoice);

        if ((string) $invoice->billing_reason !== Invoice::BILLING_REASON_SUBSCRIPTION_CREATE) {
            return $this->skip($webhookEvent, 'Invoice is not the first subscription invoice.');
        }

        if ((string) $invoice->status !== 'paid') {
            return $this->skip($webhookEvent, 'Invoice is not paid.');
        }

        $subscriptionStatus = $this->subscriptionStatus($invoice);

        if ($subscriptionStatus !== null && $subscriptionStatus !== 'active') {
            return $this->skip($webhookEvent, 'Subscription is not active.');
        }

        $customerEmail = trim((string) $invoice->customer_email);

        if ($customerEmail === '') {
            return $this->skip($webhookEvent, 'Invoice is missing a customer email address.');
        }

        $lineItems = $this->lineItemCandidates($invoice);

        if ($lineItems === []) {
            return $this->skip($webhookEvent, 'Invoice has no recognizable Stripe price or product line items.');
        }

        $webhookEvent->forceFill([
            'stripe_price_id' => $lineItems[0]['stripePriceId'],
            'stripe_product_id' => $lineItems[0]['stripeProductId'],
        ])->save();

        $match = $this->catalogMatch($lineItems);

        if ($match === null) {
            return $this->skip($webhookEvent, 'No module or playbook matched the Stripe price/product IDs.');
        }

        /** @var Module|Playbook $catalogItem */
        $catalogItem = $match['catalogItem'];

        $webhookEvent->forceFill([
            'stripe_product_id' => $match['stripeProductId'],
            'stripe_price_id' => $match['stripePriceId'],
            'catalog_type' => $catalogItem::class,
            'catalog_id' => $catalogItem->id,
            'customer_email' => $customerEmail,
            'customer_name' => trim((string) $invoice->customer_name) ?: null,
            'skip_reason' => null,
            'error' => null,
        ])->save();

        if ($this->customerAlreadyWelcomed($webhookEvent)) {
            return $this->skip($webhookEvent, 'Customer has already received a subscription welcome email.');
        }

        $webhookEvent->forceFill([
            'status' => StripeWebhookEvent::STATUS_QUEUED,
        ])->save();

        SendSubscriptionWelcomeEmailJob::dispatch($webhookEvent->id);

        return $webhookEvent;
    }

    private function recordInvoice(StripeWebhookEvent $webhookEvent, Invoice $invoice): void
    {
        $webhookEvent->forceFill([
            'stripe_invoice_id' => (string) $invoice->id,
            'stripe_customer_id' => $this->stringId($invoice->customer ?? null),
            'stripe_subscription_id' => $this->subscriptionId($invoice),
            'customer_email' => trim((string) $invoice->customer_email) ?: null,
            'customer_name' => trim((string) $invoice->customer_name) ?: null,
        ])->save();
    }

    /**
     * @return list<array{stripePriceId: string|null, stripeProductId: string|null}>
     */
    private function lineItemCandidates(Invoice $invoice): array
    {
        $lines = data_get($invoice, 'lines.data', []);

        if (! is_array($lines)) {
            return [];
        }

        return collect($lines)
            ->map(fn (mixed $line): array => [
                'stripePriceId' => $this->stripePriceId($line),
                'stripeProductId' => $this->stripeProductId($line),
            ])
            ->filter(fn (array $candidate): bool => filled($candidate['stripePriceId']) || filled($candidate['stripeProductId']))
            ->values()
            ->all();
    }

    /**
     * @param  list<array{stripePriceId: string|null, stripeProductId: string|null}>  $lineItems
     * @return array{catalogItem: Model, stripePriceId: string|null, stripeProductId: string|null}|null
     */
    private function catalogMatch(array $lineItems): ?array
    {
        foreach ($lineItems as $lineItem) {
            $priceId = $lineItem['stripePriceId'];

            if (! $priceId) {
                continue;
            }

            $catalogItem = $this->firstCatalogItem('stripe_price_id', $priceId);

            if ($catalogItem instanceof Model) {
                return [
                    'catalogItem' => $catalogItem,
                    'stripePriceId' => $priceId,
                    'stripeProductId' => $lineItem['stripeProductId'],
                ];
            }
        }

        foreach ($lineItems as $lineItem) {
            $productId = $lineItem['stripeProductId'];

            if (! $productId) {
                continue;
            }

            $catalogItem = $this->firstCatalogItem('stripe_product_id', $productId);

            if ($catalogItem instanceof Model) {
                return [
                    'catalogItem' => $catalogItem,
                    'stripePriceId' => $lineItem['stripePriceId'],
                    'stripeProductId' => $productId,
                ];
            }
        }

        return null;
    }

    private function firstCatalogItem(string $column, string $value): ?Model
    {
        return Module::withTrashed()->where($column, $value)->first()
            ?? Playbook::withTrashed()->where($column, $value)->first();
    }

    private function customerAlreadyWelcomed(StripeWebhookEvent $webhookEvent): bool
    {
        $query = StripeWebhookEvent::query()
            ->whereKeyNot($webhookEvent->id)
            ->where('stripe_event_type', 'invoice.paid')
            ->whereIn('status', [
                StripeWebhookEvent::STATUS_QUEUED,
                StripeWebhookEvent::STATUS_SENT,
            ]);

        $customerId = trim((string) $webhookEvent->stripe_customer_id);

        if ($customerId !== '') {
            return $query->where('stripe_customer_id', $customerId)->exists();
        }

        $customerEmail = $this->normalizedEmail($webhookEvent->customer_email);

        if ($customerEmail === null) {
            return false;
        }

        return $query
            ->whereRaw('LOWER(TRIM(customer_email)) = ?', [$customerEmail])
            ->exists();
    }

    private function skip(StripeWebhookEvent $webhookEvent, string $reason): StripeWebhookEvent
    {
        $webhookEvent->forceFill([
            'status' => StripeWebhookEvent::STATUS_SKIPPED,
            'skip_reason' => $reason,
        ])->save();

        Log::info('Stripe subscription welcome email skipped.', [
            'stripe_event_id' => $webhookEvent->stripe_event_id,
            'stripe_invoice_id' => $webhookEvent->stripe_invoice_id,
            'reason' => $reason,
        ]);

        return $webhookEvent;
    }

    private function stripePriceId(mixed $line): ?string
    {
        return $this->stringId(data_get($line, 'pricing.price_details.price'))
            ?? $this->stringId(data_get($line, 'price'))
            ?? $this->stringId(data_get($line, 'price.id'));
    }

    private function stripeProductId(mixed $line): ?string
    {
        return $this->stringId(data_get($line, 'pricing.price_details.product'))
            ?? $this->stringId(data_get($line, 'price.product'))
            ?? $this->stringId(data_get($line, 'plan.product'));
    }

    private function subscriptionId(Invoice $invoice): ?string
    {
        return $this->stringId($invoice->subscription ?? null)
            ?? $this->stringId(data_get($invoice, 'parent.subscription_details.subscription'))
            ?? $this->stringId(data_get($invoice, 'lines.data.0.subscription'));
    }

    private function subscriptionStatus(Invoice $invoice): ?string
    {
        $status = data_get($invoice, 'subscription.status')
            ?? data_get($invoice, 'parent.subscription_details.subscription.status')
            ?? data_get($invoice, 'lines.data.0.subscription.status');

        return is_string($status) && $status !== '' ? $status : null;
    }

    private function stringId(mixed $value): ?string
    {
        if (is_string($value) && $value !== '') {
            return $value;
        }

        if (is_array($value) && isset($value['id']) && is_string($value['id']) && $value['id'] !== '') {
            return $value['id'];
        }

        if (is_object($value) && isset($value->id) && is_string($value->id) && $value->id !== '') {
            return $value->id;
        }

        return null;
    }

    private function normalizedEmail(?string $email): ?string
    {
        $value = strtolower(trim((string) $email));

        return $value !== '' ? $value : null;
    }

    private function timestamp(mixed $value): ?CarbonImmutable
    {
        return is_numeric($value) ? CarbonImmutable::createFromTimestampUTC((int) $value) : null;
    }
}
