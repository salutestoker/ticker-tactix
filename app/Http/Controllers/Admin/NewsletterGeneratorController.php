<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterGeneration;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NewsletterGeneratorController extends Controller
{
    private const TICKER_CARD_KEYS = [
        'spyi',
        'qqqi',
        'iwmi',
        'tltw',
    ];

    private const PRICE_FIELD_KEYS = [
        'price',
        's2',
        's1',
        'b1',
        'b2',
    ];

    private const PROBABILITY_KEYS = [
        'es1',
        'nq1',
        'spx',
        'qqq',
        'fatmaan',
        'svix',
        'dxy',
    ];

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
        $rules = [
            'values' => ['required', 'array:date,cards,probabilities,marketCommentary'],
            'values.date' => ['present', 'nullable', 'date_format:Y-m-d'],
            'values.cards' => ['required', 'array:'.implode(',', self::TICKER_CARD_KEYS)],
            'values.probabilities' => ['required', 'array:'.implode(',', self::PROBABILITY_KEYS)],
            'values.marketCommentary' => ['present', 'nullable', 'string', 'max:5000'],
        ];

        foreach (self::TICKER_CARD_KEYS as $cardKey) {
            $rules["values.cards.{$cardKey}"] = ['required', 'array:'.implode(',', self::PRICE_FIELD_KEYS)];

            foreach (self::PRICE_FIELD_KEYS as $fieldKey) {
                $rules["values.cards.{$cardKey}.{$fieldKey}"] = ['present', 'nullable', 'string', 'max:64'];
            }
        }

        foreach (self::PROBABILITY_KEYS as $probabilityKey) {
            $rules["values.probabilities.{$probabilityKey}"] = ['present', 'nullable', 'string', 'max:64'];
        }

        $data = $request->validate($rules);
        $values = $data['values'];

        return [
            'date' => (string) ($values['date'] ?? ''),
            'cards' => $this->normalizeCardValues($values['cards'] ?? []),
            'probabilities' => $this->normalizeProbabilityValues($values['probabilities'] ?? []),
            'marketCommentary' => (string) ($values['marketCommentary'] ?? ''),
        ];
    }

    private function normalizeCardValues(array $cards): array
    {
        $normalized = [];

        foreach (self::TICKER_CARD_KEYS as $cardKey) {
            $normalized[$cardKey] = [];

            foreach (self::PRICE_FIELD_KEYS as $fieldKey) {
                $normalized[$cardKey][$fieldKey] = (string) ($cards[$cardKey][$fieldKey] ?? '');
            }
        }

        return $normalized;
    }

    private function normalizeProbabilityValues(array $probabilities): array
    {
        $normalized = [];

        foreach (self::PROBABILITY_KEYS as $probabilityKey) {
            $normalized[$probabilityKey] = (string) ($probabilities[$probabilityKey] ?? '');
        }

        return $normalized;
    }
}
