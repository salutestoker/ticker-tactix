<?php

namespace App\Jobs;

use App\Mail\NewsletterSubscriptionEmail;
use App\Models\NewsletterDelivery;
use App\Services\Newsletters\NewsletterRecipient;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Throwable;

class SendNewsletterDeliveryEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $backoff = 60;

    public function __construct(
        private readonly int $deliveryId,
        private readonly NewsletterRecipient $recipient,
    ) {}

    public function handle(): void
    {
        $delivery = NewsletterDelivery::find($this->deliveryId);

        if (! $delivery instanceof NewsletterDelivery) {
            return;
        }

        $manageUrl = URL::signedRoute('newsletter-deliveries.portal', [
            'delivery' => $delivery,
            'customer' => $this->recipient->customerId,
        ]);

        Mail::to($this->recipient->email, $this->recipient->name)
            ->send(new NewsletterSubscriptionEmail($delivery, $this->recipient, $manageUrl));

        $delivery->increment('sent_count');
        $delivery->markCompleteIfFinished();
    }

    public function failed(?Throwable $exception): void
    {
        $delivery = NewsletterDelivery::find($this->deliveryId);

        if (! $delivery instanceof NewsletterDelivery) {
            return;
        }

        $delivery->increment('failed_count');
        $message = $exception?->getMessage() ?? 'Unknown mail failure.';
        $delivery->appendError($this->recipient->email.': '.$message);
        $delivery->markCompleteIfFinished();
    }
}
