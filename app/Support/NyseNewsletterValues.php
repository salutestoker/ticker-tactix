<?php

namespace App\Support;

final class NyseNewsletterValues
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

    public static function validationRules(string $prefix = 'values'): array
    {
        $rules = [
            $prefix => ['required', 'array:date,cards,probabilities,marketCommentary'],
            "{$prefix}.date" => ['present', 'nullable', 'date_format:Y-m-d'],
            "{$prefix}.cards" => ['required', 'array:'.implode(',', self::TICKER_CARD_KEYS)],
            "{$prefix}.probabilities" => ['required', 'array:'.implode(',', self::PROBABILITY_KEYS)],
            "{$prefix}.marketCommentary" => ['present', 'nullable', 'string', 'max:5000'],
        ];

        foreach (self::TICKER_CARD_KEYS as $cardKey) {
            $rules["{$prefix}.cards.{$cardKey}"] = ['required', 'array:'.implode(',', self::PRICE_FIELD_KEYS)];

            foreach (self::PRICE_FIELD_KEYS as $fieldKey) {
                $rules["{$prefix}.cards.{$cardKey}.{$fieldKey}"] = ['present', 'nullable', 'string', 'max:64'];
            }
        }

        foreach (self::PROBABILITY_KEYS as $probabilityKey) {
            $rules["{$prefix}.probabilities.{$probabilityKey}"] = ['present', 'nullable', 'string', 'max:64'];
        }

        return $rules;
    }

    public static function normalize(array $values): array
    {
        return [
            'date' => (string) ($values['date'] ?? ''),
            'cards' => self::normalizeCardValues($values['cards'] ?? []),
            'probabilities' => self::normalizeProbabilityValues($values['probabilities'] ?? []),
            'marketCommentary' => (string) ($values['marketCommentary'] ?? ''),
        ];
    }

    private static function normalizeCardValues(array $cards): array
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

    private static function normalizeProbabilityValues(array $probabilities): array
    {
        $normalized = [];

        foreach (self::PROBABILITY_KEYS as $probabilityKey) {
            $normalized[$probabilityKey] = (string) ($probabilities[$probabilityKey] ?? '');
        }

        return $normalized;
    }
}
