<?php

namespace App\Support;

use App\Models\Module;
use App\Models\Playbook;
use App\Models\TraderType;

final class SeoMetadata
{
    public const DEFAULT_TITLE = 'Ticker-Tactix';

    public const DEFAULT_DESCRIPTION = 'Trade with structure not emotion. A rules-based market operating system for traders who value structure over signals.';

    public const DEFAULT_IMAGE_PATH = '/design/assets/images/open-graph/ticker-tactix-2026--compressed.jpg';

    public const DEFAULT_IMAGE_ALT = 'Ticker-Tactix hero artwork with the headline Trade with Structure Not Emotion.';

    /**
     * @var list<string>
     */
    private const MODULE_BANNER_SLUGS = [
        'crypto-info-box',
        'crypto-info-line',
        'crypto-velocity-stats',
        'info-box',
        'info-line',
        'range-rails',
        'sequence-pressure',
        'trend-tracer',
    ];

    /**
     * @param  array{url: string, type: string|null, width: int|null, height: int|null}|null  $image
     */
    public function __construct(
        private readonly ?string $title = null,
        private readonly ?string $description = null,
        private readonly ?array $image = null,
        private readonly ?string $imageAlt = null,
        private readonly ?string $canonicalUrl = null,
        private readonly ?string $robots = null,
    ) {}

    public static function default(): self
    {
        return new self();
    }

    public static function staticPage(
        string $title,
        string $description,
        ?string $imagePath = null,
        ?string $imageAlt = null,
        ?string $robots = null,
    ): self {
        return new self(
            title: $title,
            description: $description,
            image: $imagePath ? self::publicImage($imagePath) : null,
            imageAlt: $imageAlt,
            robots: $robots,
        );
    }

    public static function forModule(Module $module): self
    {
        $staticBannerPath = self::moduleBannerPath($module);

        return new self(
            title: self::clean($module->meta_title) ?: self::brandedTitle((string) $module->title),
            description: self::clean($module->meta_description)
                ?: self::clean($module->description)
                ?: self::clean($module->summary),
            image: self::externalImage($module->banner_image_url)
                ?? ($staticBannerPath ? self::publicImage($staticBannerPath) : null)
                ?? self::externalImage($module->image_url),
            imageAlt: "{$module->title} module preview from Ticker-Tactix.",
        );
    }

    public static function forPlaybook(Playbook $playbook): self
    {
        return new self(
            title: self::clean($playbook->meta_title) ?: self::brandedTitle((string) $playbook->title),
            description: self::clean($playbook->meta_description)
                ?: self::clean($playbook->best_for)
                ?: self::clean($playbook->long_description),
            image: self::externalImage($playbook->banner_image_url)
                ?? self::externalImage($playbook->logo_url),
            imageAlt: "{$playbook->title} playbook preview from Ticker-Tactix.",
        );
    }

    public static function forTraderType(TraderType $traderType): self
    {
        return new self(
            title: self::brandedTitle((string) $traderType->name),
            description: self::clean($traderType->description)
                ?: 'A Ticker-Tactix framework path for matching market pace, structure level, and execution support.',
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toViewData(): array
    {
        $image = $this->image ?? self::publicImage(self::DEFAULT_IMAGE_PATH);

        return [
            'seoTitle' => self::clean($this->title) ?: self::DEFAULT_TITLE,
            'seoDescription' => self::clean($this->description) ?: self::DEFAULT_DESCRIPTION,
            'seoCanonicalUrl' => $this->canonicalUrl ?: request()->fullUrl(),
            'seoImageUrl' => $image['url'],
            'seoImageType' => $image['type'],
            'seoImageWidth' => $image['width'],
            'seoImageHeight' => $image['height'],
            'seoImageAlt' => self::clean($this->imageAlt) ?: self::DEFAULT_IMAGE_ALT,
            'seoRobots' => self::clean($this->robots) ?: 'index, follow',
        ];
    }

    private static function brandedTitle(string $title): string
    {
        $title = self::clean($title) ?: self::DEFAULT_TITLE;

        if ($title === self::DEFAULT_TITLE || str_contains($title, self::DEFAULT_TITLE)) {
            return $title;
        }

        return "{$title} - ".self::DEFAULT_TITLE;
    }

    private static function moduleBannerPath(Module $module): ?string
    {
        $slug = self::clean($module->slug);

        if (! $slug || ! in_array($slug, self::MODULE_BANNER_SLUGS, true)) {
            return null;
        }

        return "/design/assets/images/modules/module-banner--{$slug}.jpg";
    }

    /**
     * @return array{url: string, type: string|null, width: int|null, height: int|null}
     */
    private static function publicImage(string $path): array
    {
        $dimensions = self::publicImageDimensions($path);

        return [
            'url' => url($path),
            'type' => self::imageType($path),
            'width' => $dimensions['width'],
            'height' => $dimensions['height'],
        ];
    }

    /**
     * @return array{url: string, type: string|null, width: int|null, height: int|null}|null
     */
    private static function externalImage(?string $url): ?array
    {
        $url = self::clean($url);

        if (! $url) {
            return null;
        }

        return [
            'url' => str_starts_with($url, 'http://') || str_starts_with($url, 'https://') ? $url : url($url),
            'type' => self::imageType(parse_url($url, PHP_URL_PATH) ?: $url),
            'width' => null,
            'height' => null,
        ];
    }

    /**
     * @return array{width: int|null, height: int|null}
     */
    private static function publicImageDimensions(string $path): array
    {
        $file = public_path(ltrim($path, '/'));

        if (! is_file($file)) {
            return ['width' => null, 'height' => null];
        }

        $dimensions = getimagesize($file);

        if ($dimensions === false) {
            return ['width' => null, 'height' => null];
        }

        return ['width' => $dimensions[0], 'height' => $dimensions[1]];
    }

    private static function imageType(string $path): ?string
    {
        return match (strtolower(pathinfo($path, PATHINFO_EXTENSION))) {
            'jpg', 'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'webp' => 'image/webp',
            default => null,
        };
    }

    private static function clean(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $value = html_entity_decode(strip_tags($value), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $value = preg_replace('/\s+/u', ' ', $value) ?? $value;
        $value = trim($value);

        return $value === '' ? null : $value;
    }
}
