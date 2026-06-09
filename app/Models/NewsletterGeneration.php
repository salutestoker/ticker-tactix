<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NewsletterGeneration extends Model
{
    public const TEMPLATE_NYSE_MARKET_ENVIRONMENT = 'nyse_market_environment';

    protected $fillable = [
        'template',
        'user_id',
        'values',
    ];

    protected function casts(): array
    {
        return [
            'values' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
