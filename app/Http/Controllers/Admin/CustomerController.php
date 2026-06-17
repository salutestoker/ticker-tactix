<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\StripeSubscribers\StripeSubscriberDirectoryService;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class CustomerController extends Controller
{
    public function __invoke(StripeSubscriberDirectoryService $directory): Response
    {
        try {
            return Inertia::render('Admin/Customers/Index', [
                ...$directory->directory()->toInertiaArray(),
                'stripeError' => null,
            ]);
        } catch (Throwable $exception) {
            Log::warning('Stripe customer directory could not be loaded.', [
                'exception' => $exception,
            ]);

            return Inertia::render('Admin/Customers/Index', [
                'subscribers' => [],
                'productOptions' => [],
                'metadataColumns' => [],
                'fetchedAt' => null,
                'stripeError' => 'Stripe customers could not be loaded: '.$exception->getMessage(),
            ]);
        }
    }
}
