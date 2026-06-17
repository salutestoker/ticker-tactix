<?php

namespace App\Mail;

use App\Models\Module;
use App\Models\Playbook;
use App\Models\StripeWebhookEvent;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SubscriptionWelcomeEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly StripeWebhookEvent $event,
        public readonly Module|Playbook $catalogItem,
        public readonly string $productUrl,
        public readonly ?string $manageUrl,
    ) {}

    public function envelope(): Envelope
    {
        $subject = trim((string) $this->catalogItem->purchase_email_subject);

        return new Envelope(
            subject: $subject !== '' ? $subject : 'Welcome to '.$this->catalogItem->title,
            tags: ['subscription-welcome'],
            metadata: [
                'stripe_event_id' => $this->event->stripe_event_id,
                'stripe_invoice_id' => (string) $this->event->stripe_invoice_id,
                'catalog_type' => class_basename($this->catalogItem),
                'catalog_id' => (string) $this->catalogItem->id,
            ],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.subscriptions.welcome',
            with: [
                'event' => $this->event,
                'catalogItem' => $this->catalogItem,
                'productUrl' => $this->productUrl,
                'manageUrl' => $this->manageUrl,
                'accessInstructions' => trim((string) $this->catalogItem->purchase_email_body),
            ],
        );
    }
}
