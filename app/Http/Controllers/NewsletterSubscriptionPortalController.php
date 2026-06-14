<?php

namespace App\Http\Controllers;

use App\Models\NewsletterDelivery;
use App\Services\Newsletters\StripeNewsletterSubscriberService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class NewsletterSubscriptionPortalController extends Controller
{
    public function __invoke(
        Request $request,
        NewsletterDelivery $delivery,
        StripeNewsletterSubscriberService $subscribers,
    ): RedirectResponse {
        $customerId = (string) $request->query('customer', '');

        abort_if($customerId === '', 404);

        return redirect()->away($subscribers->createPortalUrl($customerId));
    }
}
