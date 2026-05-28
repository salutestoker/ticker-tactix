<?php

namespace App\Models;

use App\Enums\AccessLevel;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Module extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'market_id',
        'icon',
        'image_path',
        'banner_image',
        'title',
        'slug',
        'description',
        'purpose',
        'layer',
        'key_output',
        'trading_pace',
        'short_name',
        'price',
        'module_overview',
        'core_features',
        'customization_options',
        'best_used_for',
        'summary',
        'version',
        'access',
        'action_url',
        'sort_order',
        'is_featured',
        'is_active',
        'published_at',
        'meta_title',
        'meta_description',
    ];

    protected $appends = [
        'image_url',
        'banner_image_url',
    ];

    protected function casts(): array
    {
        return [
            'access' => AccessLevel::class,
            'version' => 'float',
            'core_features' => 'array',
            'customization_options' => 'array',
            'best_used_for' => 'array',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'published_at' => 'datetime',
            'sort_order' => 'integer',
        ];
    }

    public function market(): BelongsTo
    {
        return $this->belongsTo(Market::class);
    }

    public function traderTypes(): BelongsToMany
    {
        return $this->belongsToMany(TraderType::class)->withTimestamps();
    }

    public function relatedModules(): BelongsToMany
    {
        return $this->belongsToMany(
            self::class,
            'module_related_modules',
            'module_id',
            'related_module_id',
        )->withTimestamps();
    }

    public function getImageUrlAttribute(): ?string
    {
        if (! $this->image_path) {
            return null;
        }

        return Storage::disk((string) config('filesystems.module_image_disk', 'public'))->url($this->image_path);
    }

    public function getBannerImageUrlAttribute(): ?string
    {
        if (! $this->banner_image) {
            return null;
        }

        return Storage::disk((string) config('filesystems.module_image_disk', 'public'))->url($this->banner_image);
    }

    #[Scope]
    protected function public(Builder $query): void
    {
        $query->where('is_active', true)->whereNotNull('published_at');
    }

    #[Scope]
    protected function ordered(Builder $query): void
    {
        $query->orderBy('sort_order')->orderBy('title');
    }
}
