<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WelcomePageAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_direct_guest_access_is_allowed(): void
    {
        $this->get(route('welcome'))->assertOk();
    }

    public function test_stripe_referrer_can_still_view_welcome_page(): void
    {
        $this->withHeader('referer', 'https://checkout.stripe.com/c/pay/cs_test_example')
            ->get(route('welcome'))
            ->assertOk();
    }
}
