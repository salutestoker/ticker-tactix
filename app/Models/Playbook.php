<?php

namespace App\Models;

use Database\Factories\PlaybookFactory;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Playbook extends Model
{
    /** @use HasFactory<PlaybookFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'playbook_category_id',
        'framework',
        'slug',
        'access',
        'market',
        'best_for',
        'average_hold_time',
        'price_cents',
        'currency',
        'payment_url',
        'sort_order',
        'is_featured',
        'is_active',
        'published_at',
        'meta_title',
        'meta_description',
    ];

    protected function casts(): array
    {
        return [
            'price_cents' => 'integer',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'published_at' => 'datetime',
            'sort_order' => 'integer',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(PlaybookCategory::class, 'playbook_category_id');
    }

    #[Scope]
    protected function public(Builder $query): void
    {
        $query->where('is_active', true)->whereNotNull('published_at');
    }

    #[Scope]
    protected function ordered(Builder $query): void
    {
        $query->orderBy('sort_order')->orderBy('framework');
    }
}
