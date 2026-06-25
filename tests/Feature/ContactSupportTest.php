<?php

namespace Tests\Feature;

use App\Mail\SupportContactRequestMail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ContactSupportTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_page_is_public(): void
    {
        $this->get(route('contact'))->assertOk();
    }

    public function test_contact_form_sends_support_request_email(): void
    {
        Mail::fake();
        config([
            'mail.support.address' => 'support@tickertactix.test',
            'mail.support.name' => 'Ticker-Tactix Support',
        ]);

        $payload = [
            'checkout_name' => 'Subscriber Name',
            'subscription_email' => 'subscriber@example.com',
            'tradingview_username' => 'ChartPilot',
            'subscription_date' => '2026-06-25',
            'issue' => 'I joined Discord but still need TradingView access.',
        ];

        $this->post(route('contact.send'), $payload)
            ->assertRedirect()
            ->assertSessionHasNoErrors()
            ->assertSessionHas('success');

        Mail::assertSent(SupportContactRequestMail::class, function (SupportContactRequestMail $mail) use ($payload): bool {
            return $mail->hasTo('support@tickertactix.test')
                && $mail->data === $payload
                && str_contains($mail->render(), 'ChartPilot')
                && str_contains($mail->render(), 'I joined Discord');
        });
    }

    public function test_contact_form_sends_to_multiple_configured_support_addresses(): void
    {
        Mail::fake();
        config([
            'mail.support.address' => 'support@tickertactix.test, ops@tickertactix.test; admin@tickertactix.test',
            'mail.support.name' => 'Ticker-Tactix Support',
        ]);

        $payload = [
            'checkout_name' => 'Subscriber Name',
            'subscription_email' => 'subscriber@example.com',
            'tradingview_username' => 'ChartPilot',
            'subscription_date' => '2026-06-25',
            'issue' => 'I joined Discord but still need TradingView access.',
        ];

        $this->post(route('contact.send'), $payload)
            ->assertRedirect()
            ->assertSessionHasNoErrors()
            ->assertSessionHas('success');

        Mail::assertSent(SupportContactRequestMail::class, function (SupportContactRequestMail $mail): bool {
            return $mail->hasTo('support@tickertactix.test')
                && $mail->hasTo('ops@tickertactix.test')
                && $mail->hasTo('admin@tickertactix.test');
        });
    }

    public function test_contact_form_validates_required_support_details(): void
    {
        Mail::fake();

        $this->post(route('contact.send'), [])
            ->assertRedirect()
            ->assertSessionHasErrors([
                'checkout_name',
                'subscription_email',
                'tradingview_username',
                'subscription_date',
                'issue',
            ]);

        Mail::assertNothingSent();
    }
}
