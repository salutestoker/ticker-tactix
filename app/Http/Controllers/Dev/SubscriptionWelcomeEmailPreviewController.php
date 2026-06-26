<?php

namespace App\Http\Controllers\Dev;

use App\Http\Controllers\Controller;
use App\Mail\SubscriptionWelcomeEmail;
use App\Models\Module;
use App\Models\Playbook;
use App\Models\StripeWebhookEvent;

class SubscriptionWelcomeEmailPreviewController extends Controller
{
    public function module(Module $module): SubscriptionWelcomeEmail
    {
        return new SubscriptionWelcomeEmail(
            event: $this->previewEvent($module),
            catalogItem: $module,
            productUrl: route('modules.show', $module->slug),
            manageUrl: null,
        );
    }

    public function playbook(Playbook $playbook): SubscriptionWelcomeEmail
    {
        return new SubscriptionWelcomeEmail(
            event: $this->previewEvent($playbook),
            catalogItem: $playbook,
            productUrl: route('playbooks.show', $playbook->slug),
            manageUrl: null,
        );
    }

    private function previewEvent(Module|Playbook $catalogItem): StripeWebhookEvent
    {
        return new StripeWebhookEvent([
            'stripe_event_id' => 'preview_subscription_welcome_email',
            'stripe_event_type' => 'admin.preview',
            'stripe_product_id' => $catalogItem->stripe_product_id,
            'stripe_price_id' => $catalogItem->stripe_price_id,
            'catalog_type' => $catalogItem::class,
            'catalog_id' => $catalogItem->id,
            'customer_email' => 'preview@tickertactix.test',
            'customer_name' => 'Preview Customer',
            'status' => StripeWebhookEvent::STATUS_SENT,
        ]);
    }
}
