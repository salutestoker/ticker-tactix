<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterDelivery;
use App\Models\NewsletterGeneration;
use App\Support\NyseNewsletterValues;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
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
        $defaultValues = $latestGeneration?->values;

        if (is_array($defaultValues)) {
            $defaultValues['date'] = Date::now()->toDateString();
        }

        return Inertia::render('Admin/Newsletters/Generator', [
            'defaultValues' => $defaultValues,
            'defaultGeneratedAt' => $latestGeneration?->created_at?->toIso8601String(),
            'deliveryDefaults' => [
                'stripeProductId' => config('newsletters.templates.nyse_market_environment.stripe_product_id'),
                'subscriptionStatuses' => config('newsletters.templates.nyse_market_environment.subscription_statuses'),
                'subject' => config('newsletters.templates.nyse_market_environment.default_subject'),
                'preheader' => config('newsletters.templates.nyse_market_environment.default_preheader'),
            ],
            'scheduledDeliveries' => NewsletterDelivery::query()
                ->with('user:id,name')
                ->where('template', NewsletterGeneration::TEMPLATE_NYSE_MARKET_ENVIRONMENT)
                ->where('status', NewsletterDelivery::STATUS_SCHEDULED)
                ->orderBy('scheduled_for')
                ->orderBy('id')
                ->get()
                ->map(fn (NewsletterDelivery $delivery): array => [
                    'id' => $delivery->id,
                    'subject' => $delivery->subject,
                    'scheduledFor' => $delivery->scheduled_for?->toIso8601String(),
                    'createdAt' => $delivery->created_at?->toIso8601String(),
                    'userName' => $delivery->user?->name,
                ]),
            'schedulerMeta' => [
                'appTimezone' => config('app.timezone'),
                'newsletterTimezone' => config('newsletters.timezone', 'America/New_York'),
                'serverNow' => Date::now()->toIso8601String(),
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
