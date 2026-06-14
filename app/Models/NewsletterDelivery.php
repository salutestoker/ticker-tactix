<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class NewsletterDelivery extends Model
{
    public const STATUS_SCHEDULED = 'scheduled';

    public const STATUS_SENDING = 'sending';

    public const STATUS_SENT = 'sent';

    public const STATUS_FAILED = 'failed';

    protected $fillable = [
        'template',
        'user_id',
        'stripe_product_id',
        'subscription_statuses',
        'subject',
        'preheader',
        'values',
        'image_disk',
        'image_path',
        'scheduled_for',
        'sent_at',
        'status',
        'recipient_count',
        'sent_count',
        'failed_count',
        'skipped_count',
        'error',
    ];

    protected function casts(): array
    {
        return [
            'subscription_statuses' => 'array',
            'values' => 'array',
            'scheduled_for' => 'immutable_datetime',
            'sent_at' => 'immutable_datetime',
            'recipient_count' => 'integer',
            'sent_count' => 'integer',
            'failed_count' => 'integer',
            'skipped_count' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function imageFilename(): string
    {
        $date = (string) data_get($this->values, 'date', 'draft');
        $slug = Str::slug($this->subject) ?: 'newsletter';

        return "{$slug}-{$date}.png";
    }

    public function markCompleteIfFinished(): void
    {
        $this->refresh();

        if ($this->status !== self::STATUS_SENDING) {
            return;
        }

        if (($this->sent_count + $this->failed_count) < $this->recipient_count) {
            return;
        }

        $this->forceFill([
            'status' => $this->failed_count > 0 ? self::STATUS_FAILED : self::STATUS_SENT,
            'sent_at' => now(),
        ])->save();
    }

    public function appendError(string $message): void
    {
        $existing = trim((string) $this->error);
        $next = $existing === '' ? $message : "{$existing}\n{$message}";

        $this->forceFill(['error' => Str::limit($next, 60000, '')])->save();
    }
}
