<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

final class YouTubeVideoUrl implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) || $this->videoId($value) === null) {
            $fail('The :attribute must be a valid YouTube video URL.');
        }
    }

    private function videoId(string $url): ?string
    {
        $parts = parse_url(trim($url));

        if (! is_array($parts)) {
            return null;
        }

        $host = strtolower($parts['host'] ?? '');
        $pathSegments = array_values(array_filter(explode('/', trim($parts['path'] ?? '', '/'))));

        if ($host === 'youtu.be' || $host === 'www.youtu.be') {
            return $this->validVideoId($pathSegments[0] ?? null);
        }

        if (! $this->isYouTubeHost($host)) {
            return null;
        }

        parse_str($parts['query'] ?? '', $query);
        $watchId = $query['v'] ?? null;

        if (is_string($watchId) && $this->validVideoId($watchId) !== null) {
            return $watchId;
        }

        $videoPathPrefixes = ['embed', 'shorts', 'live', 'v'];

        if (in_array($pathSegments[0] ?? '', $videoPathPrefixes, true)) {
            return $this->validVideoId($pathSegments[1] ?? null);
        }

        return null;
    }

    private function isYouTubeHost(string $host): bool
    {
        return $host === 'youtube.com'
            || str_ends_with($host, '.youtube.com')
            || $host === 'youtube-nocookie.com'
            || str_ends_with($host, '.youtube-nocookie.com');
    }

    private function validVideoId(?string $value): ?string
    {
        if (! is_string($value)) {
            return null;
        }

        return preg_match('/^[A-Za-z0-9_-]{6,32}$/', $value) === 1 ? $value : null;
    }
}
