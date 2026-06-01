<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WelcomePageAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_direct_guest_access_is_not_found(): void
    {
        $this->get(route('welcome'))->assertNotFound();
    }

    public function test_stripe_referrer_can_view_welcome_page_and_refresh(): void
    {
        $this->withHeader('referer', 'https://checkout.stripe.com/c/pay/cs_test_example')
            ->get(route('welcome'))
            ->assertOk();

        $this->get(route('welcome'))->assertOk();
    }

    public function test_admin_can_view_welcome_page_without_stripe_referrer(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)
            ->get(route('welcome'))
            ->assertOk();
    }
}
