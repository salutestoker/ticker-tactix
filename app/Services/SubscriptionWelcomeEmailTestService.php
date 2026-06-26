<?php

namespace App\Services;

use App\Mail\SubscriptionWelcomeEmail;
use App\Models\Module;
use App\Models\Playbook;
use App\Models\StripeWebhookEvent;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;

class SubscriptionWelcomeEmailTestService
{
    private const MAX_RECIPIENTS = 20;

    /**
     * @param  list<string>  $emails
     */
    public function sendMany(Module|Playbook $catalogItem, array $emails): int
    {
        try {
            foreach ($emails as $email) {
                $this->send($catalogItem, $email);
            }
        } catch (TransportExceptionInterface $exception) {
            throw ValidationException::withMessages([
                'test_email' => $this->mailTransportValidationMessage($exception),
            ]);
        }

        return count($emails);
    }

    public function send(Module|Playbook $catalogItem, string $email): void
    {
        $event = new StripeWebhookEvent([
            'stripe_event_id' => 'test_'.Str::uuid(),
            'stripe_event_type' => 'admin.test',
            'stripe_product_id' => $catalogItem->stripe_product_id,
            'stripe_price_id' => $catalogItem->stripe_price_id,
            'catalog_type' => $catalogItem::class,
            'catalog_id' => $catalogItem->id,
            'customer_email' => $email,
            'status' => StripeWebhookEvent::STATUS_SENT,
        ]);

        Mail::to($email)->send(new SubscriptionWelcomeEmail(
            event: $event,
            catalogItem: $catalogItem,
            productUrl: $this->productUrl($catalogItem),
            manageUrl: null,
        ));
    }

    /**
     * @return list<string>
     */
    public function parseRecipients(string $value): array
    {
        $emails = collect(preg_split('/[\s,;]+/', $value) ?: [])
            ->map(fn (string $email): string => trim($email))
            ->filter()
            ->unique(fn (string $email): string => strtolower($email))
            ->values();

        if ($emails->isEmpty()) {
            throw ValidationException::withMessages([
                'test_email' => 'Enter at least one test email address.',
            ]);
        }

        $invalidEmail = $emails->first(
            fn (string $email): bool => filter_var($email, FILTER_VALIDATE_EMAIL) === false,
        );

        if (is_string($invalidEmail)) {
            throw ValidationException::withMessages([
                'test_email' => "{$invalidEmail} is not a valid email address.",
            ]);
        }

        if ($emails->count() > self::MAX_RECIPIENTS) {
            throw ValidationException::withMessages([
                'test_email' => 'Enter 20 or fewer test email addresses.',
            ]);
        }

        return $emails->all();
    }

    private function productUrl(Module|Playbook $catalogItem): string
    {
        return match ($catalogItem::class) {
            Module::class => route('modules.show', $catalogItem->slug),
            Playbook::class => route('playbooks.show', $catalogItem->slug),
        };
    }

    private function mailTransportValidationMessage(TransportExceptionInterface $exception): string
    {
        $base = config('mail.default') === 'mailgun'
            ? 'Mailgun rejected the test purchase email. Confirm MAILGUN_SECRET and MAILGUN_DOMAIN are correct, MAIL_FROM_ADDRESS belongs to MAILGUN_DOMAIN, the recipient is allowed by Mailgun, and Mailgun IP Access Management allows this server.'
            : 'The configured mail transport rejected the test purchase email. Check the mail sender and recipient settings.';

        $message = trim($exception->getMessage());

        return $message === '' ? $base : $base.' Mail transport response: '.$message;
    }
}
