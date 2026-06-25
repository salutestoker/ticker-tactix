<?php

namespace App\Support;

final class YouTubeVideo
{
    public static function videoId(?string $url): ?string
    {
        $value = trim((string) $url);

        if ($value === '') {
            return null;
        }

        $parts = parse_url($value);

        if (! is_array($parts)) {
            return null;
        }

        $host = strtolower($parts['host'] ?? '');
        $pathSegments = array_values(array_filter(explode('/', trim($parts['path'] ?? '', '/'))));

        if ($host === 'youtu.be' || $host === 'www.youtu.be') {
            return self::validVideoId($pathSegments[0] ?? null);
        }

        if (! self::isYouTubeHost($host)) {
            return null;
        }

        parse_str($parts['query'] ?? '', $query);
        $watchId = $query['v'] ?? null;

        if (is_string($watchId) && self::validVideoId($watchId) !== null) {
            return $watchId;
        }

        if (in_array($pathSegments[0] ?? '', ['embed', 'shorts', 'live', 'v'], true)) {
            return self::validVideoId($pathSegments[1] ?? null);
        }

        return null;
    }

    public static function watchUrl(string $videoId): string
    {
        return 'https://www.youtube.com/watch?v='.$videoId;
    }

    public static function thumbnailUrl(string $videoId): string
    {
        return 'https://i.ytimg.com/vi/'.$videoId.'/hqdefault.jpg';
    }

    private static function isYouTubeHost(string $host): bool
    {
        return $host === 'youtube.com'
            || str_ends_with($host, '.youtube.com')
            || $host === 'youtube-nocookie.com'
            || str_ends_with($host, '.youtube-nocookie.com');
    }

    private static function validVideoId(?string $value): ?string
    {
        if (! is_string($value)) {
            return null;
        }

        return preg_match('/^[A-Za-z0-9_-]{6,32}$/', $value) === 1 ? $value : null;
    }
}
