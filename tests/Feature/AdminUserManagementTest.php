<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminUserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_user_pages_require_admin_access(): void
    {
        $this->get(route('admin.users.index'))->assertRedirect('/login');

        $user = User::factory()->create(['is_admin' => false]);

        $this->actingAs($user)
            ->get(route('admin.users.index'))
            ->assertForbidden();
    }

    public function test_admin_can_create_user(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)
            ->post(route('admin.users.store'), [
                'name' => 'Tactix Member',
                'email' => 'member@example.com',
                'password' => 'password',
                'password_confirmation' => 'password',
                'is_admin' => false,
            ])
            ->assertRedirect(route('admin.users.index'));

        $user = User::where('email', 'member@example.com')->firstOrFail();

        $this->assertSame('Tactix Member', $user->name);
        $this->assertFalse($user->is_admin);
        $this->assertTrue(Hash::check('password', $user->password));
    }

    public function test_admin_created_user_can_login(): void
    {
        User::factory()->create([
            'email' => 'member@example.com',
            'password' => Hash::make('password'),
        ]);

        $this->post('/login', [
            'email' => 'member@example.com',
            'password' => 'password',
        ])->assertRedirect(route('dashboard', absolute: false));

        $this->assertAuthenticated();
    }
}
