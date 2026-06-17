<?php

namespace App\Http\Controllers;

use App\Services\StripeSubscriptionWelcomeEmailService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;
use UnexpectedValueException;

class StripeWebhookController extends Controller
{
    public function __invoke(
        Request $request,
        StripeSubscriptionWelcomeEmailService $welcomeEmails,
    ): JsonResponse {
        $secret = config('services.stripe.webhook_secret');

        if (! is_string($secret) || $secret === '') {
            Log::error('Stripe webhook received before STRIPE_WEBHOOK_SECRET was configured.');

            return response()->json(['message' => 'Stripe webhook is not configured.'], 500);
        }

        $payload = $request->getContent();
        $signature = (string) $request->header('Stripe-Signature', '');

        try {
            $event = Webhook::constructEvent($payload, $signature, $secret);
        } catch (UnexpectedValueException|SignatureVerificationException $exception) {
            Log::warning('Stripe webhook signature verification failed.', [
                'error' => $exception->getMessage(),
            ]);

            return response()->json(['message' => 'Invalid Stripe webhook payload.'], 400);
        }

        $welcomeEmails->handle($event);

        return response()->json(['received' => true]);
    }
}
