<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\StripeProducts\StripeProductDirectoryService;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class ProductController extends Controller
{
    public function __invoke(StripeProductDirectoryService $directory): Response
    {
        try {
            return Inertia::render('Admin/Products/Index', [
                ...$directory->directory()->toInertiaArray(),
                'stripeError' => null,
            ]);
        } catch (Throwable $exception) {
            Log::warning('Stripe product directory could not be loaded.', [
                'exception' => $exception,
            ]);

            return Inertia::render('Admin/Products/Index', [
                'products' => [],
                'metadataColumns' => [],
                'fetchedAt' => null,
                'stripeError' => 'Stripe products could not be loaded: '.$exception->getMessage(),
            ]);
        }
    }
}
