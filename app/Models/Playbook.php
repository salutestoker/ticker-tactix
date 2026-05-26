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

class Playbook extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'market_id',
        'icon',
        'logo_path',
        'title',
        'slug',
        'access',
        'best_for',
        'trading_pace',
        'average_hold_time',
        'price',
        'action_url',
        'sort_order',
        'is_featured',
        'is_active',
        'published_at',
        'meta_title',
        'meta_description',
    ];

    protected $appends = [
        'logo_url',
    ];

    protected function casts(): array
    {
        return [
            'access' => AccessLevel::class,
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

    public function getLogoUrlAttribute(): ?string
    {
        if (! $this->logo_path) {
            return null;
        }

        return Storage::disk((string) config('filesystems.playbook_logo_disk', 'public'))->url($this->logo_path);
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
