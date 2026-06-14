<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\DispatchNewsletterDeliveryJob;
use App\Mail\NewsletterSubscriptionEmail;
use App\Models\NewsletterDelivery;
use App\Models\NewsletterGeneration;
use App\Services\Newsletters\NewsletterRecipient;
use App\Services\Newsletters\StripeNewsletterSubscriberService;
use App\Support\NyseNewsletterValues;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;

class NewsletterDeliveryController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate($this->rules([
            'scheduled_for' => ['required', 'string', 'max:32'],
        ]));

        $template = NewsletterGeneration::TEMPLATE_NYSE_MARKET_ENVIRONMENT;
        $stripeProductId = $this->stripeProductId($template);
        $values = NyseNewsletterValues::normalize($data['values']);
        $disk = config('filesystems.newsletter_image_disk', 'local');
        $directory = config('filesystems.newsletter_image_directory', 'newsletter-deliveries');
        $imagePath = $request->file('image')?->store($directory, ['disk' => $disk]);

        if (! is_string($imagePath) || $imagePath === '') {
            throw ValidationException::withMessages([
                'image' => 'The generated newsletter image could not be stored.',
            ]);
        }

        $scheduledFor = $this->parseScheduledFor($data['scheduled_for']);

        if ($scheduledFor->lt(now())) {
            throw ValidationException::withMessages([
                'scheduled_for' => 'Choose a delivery time that is now or later in Eastern Time.',
            ]);
        }

        $delivery = NewsletterDelivery::create([
            'template' => $template,
            'user_id' => $request->user()?->id,
            'stripe_product_id' => $stripeProductId,
            'subscription_statuses' => config("newsletters.templates.{$template}.subscription_statuses", ['active']),
            'subject' => $data['subject'],
            'preheader' => $data['preheader'] ?? null,
            'values' => $values,
            'image_disk' => $disk,
            'image_path' => $imagePath,
            'scheduled_for' => $scheduledFor,
            'status' => NewsletterDelivery::STATUS_SCHEDULED,
        ]);

        NewsletterGeneration::create([
            'template' => $template,
            'user_id' => $request->user()?->id,
            'values' => $values,
        ]);

        $job = DispatchNewsletterDeliveryJob::dispatch($delivery);

        if ($scheduledFor->isFuture()) {
            $job->delay($scheduledFor);
        }

        return redirect()
            ->route('admin.newsletter-generator')
            ->with('success', 'Subscription email scheduled.');
    }

    public function test(Request $request): RedirectResponse
    {
        $testEmails = $this->testEmails();

        $data = $request->validate($this->rules());
        $template = NewsletterGeneration::TEMPLATE_NYSE_MARKET_ENVIRONMENT;
        $stripeProductId = $this->stripeProductId($template);
        $values = NyseNewsletterValues::normalize($data['values']);
        $disk = config('filesystems.newsletter_image_disk', 'local');
        $directory = trim(config('filesystems.newsletter_image_directory', 'newsletter-deliveries'), '/').'/tests';
        $imagePath = $request->file('image')?->store($directory, ['disk' => $disk]);

        if (! is_string($imagePath) || $imagePath === '') {
            throw ValidationException::withMessages([
                'image' => 'The generated newsletter image could not be stored.',
            ]);
        }

        $delivery = new NewsletterDelivery([
            'template' => $template,
            'stripe_product_id' => $stripeProductId,
            'subscription_statuses' => config("newsletters.templates.{$template}.subscription_statuses", ['active']),
            'subject' => $data['subject'],
            'preheader' => $data['preheader'] ?? null,
            'values' => $values,
            'image_disk' => $disk,
            'image_path' => $imagePath,
            'status' => NewsletterDelivery::STATUS_SCHEDULED,
        ]);

        try {
            foreach ($testEmails as $testEmail) {
                Mail::to($testEmail)->send(new NewsletterSubscriptionEmail(
                    $delivery,
                    new NewsletterRecipient($testEmail, 'test_customer', [], 'Ticker Tactix Test'),
                    route('admin.newsletter-generator'),
                ));
            }
        } catch (TransportExceptionInterface $exception) {
            throw ValidationException::withMessages([
                'email' => $this->mailTransportValidationMessage($exception),
            ]);
        } finally {
            Storage::disk($disk)->delete($imagePath);
        }

        return redirect()
            ->route('admin.newsletter-generator')
            ->with('success', 'Test newsletter email sent to '.implode(', ', $testEmails).'.');
    }

    public function recipientCount(StripeNewsletterSubscriberService $subscribers): JsonResponse
    {
        $template = NewsletterGeneration::TEMPLATE_NYSE_MARKET_ENVIRONMENT;
        $stripeProductId = $this->stripeProductId($template);
        $statuses = config("newsletters.templates.{$template}.subscription_statuses", ['active']);
        $result = $subscribers->recipientsForProduct($stripeProductId, $statuses);

        return response()->json([
            'count' => $result->count(),
            'skippedNoEmail' => $result->skippedNoEmail,
            'stripeProductId' => $stripeProductId,
            'subscriptionStatuses' => $statuses,
        ]);
    }

    public function sendNow(NewsletterDelivery $delivery): RedirectResponse
    {
        if ($delivery->status !== NewsletterDelivery::STATUS_SCHEDULED) {
            throw ValidationException::withMessages([
                'delivery' => 'Only scheduled newsletter emails can be sent now.',
            ]);
        }

        $delivery->forceFill(['scheduled_for' => now()])->save();

        DispatchNewsletterDeliveryJob::dispatch($delivery);

        return redirect()
            ->route('admin.newsletter-generator')
            ->with('success', 'Scheduled newsletter email is sending now.');
    }

    public function destroy(NewsletterDelivery $delivery): RedirectResponse
    {
        if ($delivery->status !== NewsletterDelivery::STATUS_SCHEDULED) {
            throw ValidationException::withMessages([
                'delivery' => 'Only scheduled newsletter emails can be deleted.',
            ]);
        }

        Storage::disk($delivery->image_disk)->delete($delivery->image_path);
        $delivery->delete();

        return redirect()
            ->route('admin.newsletter-generator')
            ->with('success', 'Scheduled newsletter email deleted.');
    }

    private function rules(array $extra = []): array
    {
        return [
            ...NyseNewsletterValues::validationRules(),
            'subject' => ['required', 'string', 'max:255'],
            'preheader' => ['present', 'nullable', 'string', 'max:255'],
            'image' => ['required', 'file', 'mimes:png', 'max:10240'],
            ...$extra,
        ];
    }

    private function stripeProductId(string $template): string
    {
        $stripeProductId = config("newsletters.templates.{$template}.stripe_product_id");

        if (! is_string($stripeProductId) || $stripeProductId === '') {
            throw ValidationException::withMessages([
                'stripe_product_id' => 'Set STRIPE_NYSE_NEWSLETTER_PRODUCT_ID before scheduling newsletter email delivery.',
            ]);
        }

        return $stripeProductId;
    }

    private function parseScheduledFor(string $value): CarbonImmutable
    {
        $timezone = (string) config('newsletters.timezone', 'America/New_York');

        $scheduledFor = CarbonImmutable::createFromFormat('Y-m-d\TH:i', $value, $timezone);

        if ($scheduledFor instanceof CarbonImmutable) {
            return $scheduledFor->utc();
        }

        try {
            return CarbonImmutable::parse($value, $timezone)->utc();
        } catch (\Throwable) {
            throw ValidationException::withMessages([
                'scheduled_for' => 'Choose a valid Eastern Time delivery date and time.',
            ]);
        }
    }

    /**
     * @return list<string>
     */
    private function testEmails(): array
    {
        $emails = collect(explode(',', (string) config('newsletters.test_emails')))
            ->map(fn (string $email): string => trim($email))
            ->filter()
            ->unique()
            ->values()
            ->all();

        if ($emails === []) {
            throw ValidationException::withMessages([
                'email' => 'Set NEWSLETTER_TEST_EMAILS before sending a test newsletter email.',
            ]);
        }

        return $emails;
    }

    private function mailTransportValidationMessage(TransportExceptionInterface $exception): string
    {
        $base = config('mail.default') === 'mailgun'
            ? 'Mailgun rejected the test newsletter email. Confirm MAIL_FROM_ADDRESS belongs to MAILGUN_DOMAIN and every NEWSLETTER_TEST_EMAILS recipient is allowed by Mailgun.'
            : 'The configured mail transport rejected the test newsletter email. Check the mail sender and recipient settings.';

        $message = trim($exception->getMessage());

        return $message === '' ? $base : $base.' Mail transport response: '.$message;
    }
}
