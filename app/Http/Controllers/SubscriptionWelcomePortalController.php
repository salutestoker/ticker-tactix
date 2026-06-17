<?php

namespace App\Http\Controllers;

use App\Models\StripeWebhookEvent;
use App\Services\Newsletters\StripeNewsletterSubscriberService;
use Illuminate\Http\RedirectResponse;

class SubscriptionWelcomePortalController extends Controller
{
    public function __invoke(
        StripeWebhookEvent $event,
        StripeNewsletterSubscriberService $subscribers,
    ): RedirectResponse {
        abort_if(! $event->stripe_customer_id, 404);

        return redirect()->away($subscribers->createPortalUrl($event->stripe_customer_id));
    }
}
