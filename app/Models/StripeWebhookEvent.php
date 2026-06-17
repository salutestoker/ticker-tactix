<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StripeWebhookEvent extends Model
{
    public const STATUS_RECEIVED = 'received';

    public const STATUS_QUEUED = 'queued';

    public const STATUS_SENT = 'sent';

    public const STATUS_SKIPPED = 'skipped';

    public const STATUS_FAILED = 'failed';

    protected $fillable = [
        'stripe_event_id',
        'stripe_event_type',
        'stripe_created_at',
        'stripe_invoice_id',
        'stripe_customer_id',
        'stripe_subscription_id',
        'stripe_product_id',
        'stripe_price_id',
        'catalog_type',
        'catalog_id',
        'customer_email',
        'customer_name',
        'status',
        'skip_reason',
        'error',
        'sent_at',
    ];

    protected function casts(): array
    {
        return [
            'stripe_created_at' => 'immutable_datetime',
            'sent_at' => 'immutable_datetime',
        ];
    }

    public function catalogItem(): ?Model
    {
        if (! $this->catalog_type || ! $this->catalog_id) {
            return null;
        }

        return match ($this->catalog_type) {
            Module::class => Module::withTrashed()->find($this->catalog_id),
            Playbook::class => Playbook::withTrashed()->find($this->catalog_id),
            default => null,
        };
    }
}
