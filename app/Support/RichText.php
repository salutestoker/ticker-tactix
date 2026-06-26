<?php

namespace App\Support;

use Illuminate\Support\HtmlString;
use Symfony\Component\HtmlSanitizer\HtmlSanitizer;
use Symfony\Component\HtmlSanitizer\HtmlSanitizerAction;
use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;

final class RichText
{
    public static function sanitize(?string $value): ?string
    {
        $value = trim((string) $value);

        if ($value === '') {
            return null;
        }

        $sanitized = trim(self::sanitizer()->sanitize($value));

        return self::isBlankHtml($sanitized) ? null : $sanitized;
    }

    public static function isBlank(?string $value): bool
    {
        return self::sanitize($value) === null;
    }

    public static function render(?string $value): HtmlString
    {
        $value = trim((string) $value);

        if ($value === '') {
            return new HtmlString('');
        }

        if (! self::containsHtml($value)) {
            return new HtmlString(self::plainTextToHtml($value));
        }

        return new HtmlString(self::sanitize($value) ?? '');
    }

    private static function sanitizer(): HtmlSanitizer
    {
        static $sanitizer = null;

        if ($sanitizer instanceof HtmlSanitizer) {
            return $sanitizer;
        }

        $config = (new HtmlSanitizerConfig)
            ->defaultAction(HtmlSanitizerAction::Block)
            ->allowLinkSchemes(['http', 'https', 'mailto'])
            ->allowElement('p')
            ->allowElement('br')
            ->allowElement('strong')
            ->allowElement('em')
            ->allowElement('u')
            ->allowElement('s')
            ->allowElement('blockquote')
            ->allowElement('ul')
            ->allowElement('ol')
            ->allowElement('li')
            ->allowElement('h2')
            ->allowElement('h3')
            ->allowElement('a', ['href', 'title', 'target', 'rel'])
            ->dropElement('script')
            ->dropElement('style')
            ->dropElement('iframe')
            ->dropElement('object')
            ->dropElement('embed')
            ->dropElement('svg')
            ->dropElement('math')
            ->withMaxInputLength(65_000);

        $sanitizer = new HtmlSanitizer($config);

        return $sanitizer;
    }

    private static function containsHtml(string $value): bool
    {
        return preg_match('/<[a-z][\s\S]*>/i', $value) === 1;
    }

    private static function plainTextToHtml(string $value): string
    {
        $paragraphs = preg_split('/\r\n|\r|\n{2,}/', $value) ?: [];

        return collect($paragraphs)
            ->map(fn (string $paragraph): string => trim($paragraph))
            ->filter()
            ->map(fn (string $paragraph): string => '<p>'.nl2br(e($paragraph), false).'</p>')
            ->implode('');
    }

    private static function isBlankHtml(string $value): bool
    {
        $text = html_entity_decode(strip_tags($value), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $text = preg_replace('/\x{00a0}/u', ' ', $text) ?? $text;

        return trim($text) === '';
    }
}
