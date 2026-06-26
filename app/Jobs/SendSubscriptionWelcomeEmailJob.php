<?php

namespace App\Jobs;

use App\Mail\SubscriptionWelcomeEmail;
use App\Models\Module;
use App\Models\Playbook;
use App\Models\StripeWebhookEvent;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Throwable;

class SendSubscriptionWelcomeEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $backoff = 60;

    public function __construct(private readonly int $stripeWebhookEventId) {}

    public function handle(): void
    {
        $event = StripeWebhookEvent::find($this->stripeWebhookEventId);

        if (! $event instanceof StripeWebhookEvent) {
            return;
        }

        if ($event->status === StripeWebhookEvent::STATUS_SENT) {
            return;
        }

        if ($event->status !== StripeWebhookEvent::STATUS_QUEUED) {
            return;
        }

        $catalogItem = $event->catalogItem();

        if (! $catalogItem instanceof Model) {
            $this->skip($event, 'Matched catalog item no longer exists.');

            return;
        }

        $email = trim((string) $event->customer_email);

        if ($email === '') {
            $this->skip($event, 'Stripe event has no customer email address.');

            return;
        }

        $productUrl = $this->productUrl($catalogItem);
        $manageUrl = $event->stripe_customer_id
            ? URL::signedRoute('subscription-welcome.portal', ['event' => $event])
            : null;

        Mail::to($email, $event->customer_name)
            ->send(new SubscriptionWelcomeEmail($event, $catalogItem, $productUrl, $manageUrl));

        $event->forceFill([
            'status' => StripeWebhookEvent::STATUS_SENT,
            'sent_at' => now(),
            'error' => null,
        ])->save();
    }

    public function failed(?Throwable $exception): void
    {
        $event = StripeWebhookEvent::find($this->stripeWebhookEventId);

        if (! $event instanceof StripeWebhookEvent) {
            return;
        }

        $event->forceFill([
            'status' => StripeWebhookEvent::STATUS_FAILED,
            'error' => $exception?->getMessage() ?? 'Unknown subscription welcome email failure.',
        ])->save();
    }

    private function skip(StripeWebhookEvent $event, string $reason): void
    {
        $event->forceFill([
            'status' => StripeWebhookEvent::STATUS_SKIPPED,
            'skip_reason' => $reason,
        ])->save();
    }

    private function productUrl(Model $catalogItem): string
    {
        return match ($catalogItem::class) {
            Module::class => route('modules.show', $catalogItem->slug),
            Playbook::class => route('playbooks.show', $catalogItem->slug),
            default => route('home'),
        };
    }
}
