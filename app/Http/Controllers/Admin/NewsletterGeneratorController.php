<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterGeneration;
use App\Support\NyseNewsletterValues;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NewsletterGeneratorController extends Controller
{
    public function __invoke(): Response
    {
        $latestGeneration = NewsletterGeneration::query()
            ->where('template', NewsletterGeneration::TEMPLATE_NYSE_MARKET_ENVIRONMENT)
            ->latest('created_at')
            ->latest('id')
            ->first();

        return Inertia::render('Admin/Newsletters/Generator', [
            'defaultValues' => $latestGeneration?->values,
            'defaultGeneratedAt' => $latestGeneration?->created_at?->toIso8601String(),
            'deliveryDefaults' => [
                'stripeProductId' => config('newsletters.templates.nyse_market_environment.stripe_product_id'),
                'subscriptionStatuses' => config('newsletters.templates.nyse_market_environment.subscription_statuses'),
                'subject' => config('newsletters.templates.nyse_market_environment.default_subject'),
                'preheader' => config('newsletters.templates.nyse_market_environment.default_preheader'),
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        NewsletterGeneration::create([
            'template' => NewsletterGeneration::TEMPLATE_NYSE_MARKET_ENVIRONMENT,
            'user_id' => $request->user()?->id,
            'values' => $this->validatedValues($request),
        ]);

        return redirect()
            ->route('admin.newsletter-generator')
            ->with('success', 'Newsletter defaults saved.');
    }

    private function validatedValues(Request $request): array
    {
        $data = $request->validate(NyseNewsletterValues::validationRules());

        return NyseNewsletterValues::normalize($data['values']);
    }
}
