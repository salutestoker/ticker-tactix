<?php

namespace App\Mail;

use App\Models\NewsletterDelivery;
use App\Services\Newsletters\NewsletterRecipient;
use Carbon\CarbonImmutable;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewsletterSubscriptionEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly NewsletterDelivery $delivery,
        public readonly NewsletterRecipient $recipient,
        public readonly string $manageUrl,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->delivery->subject,
            tags: ['newsletter', $this->delivery->template],
            metadata: [
                'newsletter_delivery_id' => (string) $this->delivery->id,
                'stripe_product_id' => $this->delivery->stripe_product_id,
            ],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: config("newsletters.templates.{$this->delivery->template}.mail_view", 'emails.newsletters.subscription'),
            with: [
                'delivery' => $this->delivery,
                'recipient' => $this->recipient,
                'manageUrl' => $this->manageUrl,
                'newsletterDate' => $this->formattedDate(),
            ],
        );
    }

    public function attachments(): array
    {
        return [
            Attachment::fromStorageDisk($this->delivery->image_disk, $this->delivery->image_path)
                ->as($this->delivery->imageFilename())
                ->withMime('image/png'),
        ];
    }

    private function formattedDate(): string
    {
        $value = (string) data_get($this->delivery->values, 'date', '');

        if ($value === '') {
            return 'Draft';
        }

        try {
            return CarbonImmutable::createFromFormat('Y-m-d', $value)->format('m.d.Y');
        } catch (\Throwable) {
            return $value;
        }
    }
}
