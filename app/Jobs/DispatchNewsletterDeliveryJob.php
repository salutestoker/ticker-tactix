<?php

namespace App\Jobs;

use App\Models\NewsletterDelivery;
use App\Services\Newsletters\StripeNewsletterSubscriberService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Throwable;

class DispatchNewsletterDeliveryJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $backoff = 60;

    public function __construct(private readonly NewsletterDelivery $delivery) {}

    public function handle(StripeNewsletterSubscriberService $subscribers): void
    {
        $delivery = $this->delivery->fresh();

        if (! $delivery instanceof NewsletterDelivery || $delivery->status !== NewsletterDelivery::STATUS_SCHEDULED) {
            return;
        }

        $delivery->forceFill([
            'status' => NewsletterDelivery::STATUS_SENDING,
            'sent_count' => 0,
            'failed_count' => 0,
            'skipped_count' => 0,
            'error' => null,
        ])->save();

        $result = $subscribers->recipientsForProduct(
            $delivery->stripe_product_id,
            $delivery->subscription_statuses,
        );

        $delivery->forceFill([
            'recipient_count' => $result->count(),
            'skipped_count' => $result->skippedNoEmail,
        ])->save();

        if ($result->count() === 0) {
            $delivery->forceFill([
                'status' => NewsletterDelivery::STATUS_SENT,
                'sent_at' => now(),
            ])->save();

            return;
        }

        foreach ($result->recipients as $recipient) {
            SendNewsletterDeliveryEmailJob::dispatch($delivery->id, $recipient);
        }
    }

    public function failed(?Throwable $exception): void
    {
        $delivery = $this->delivery->fresh();

        if (! $delivery instanceof NewsletterDelivery) {
            return;
        }

        $delivery->forceFill([
            'status' => NewsletterDelivery::STATUS_FAILED,
            'error' => $exception?->getMessage(),
        ])->save();
    }
}
