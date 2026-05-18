<?php

namespace Tests\Feature;

use App\Models\Module;
use App\Models\Playbook;
use App\Models\PlaybookCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCatalogTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_pages_require_admin_access(): void
    {
        $this->get('/admin')->assertRedirect('/login');

        $user = User::factory()->create(['is_admin' => false]);

        $this->actingAs($user)->get('/admin')->assertForbidden();
    }

    public function test_admin_can_create_catalog_records(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $category = PlaybookCategory::create([
            'name' => 'Market Data',
            'slug' => 'market-data',
            'sort_order' => 10,
            'is_active' => true,
        ]);

        $this->actingAs($admin)
            ->post(route('admin.modules.store'), [
                'playbook_category_id' => $category->id,
                'icon' => 'momentum-cycles',
                'title' => 'Momentum Cycles',
                'slug' => '',
                'purpose' => 'Identify momentum phase and trend strength.',
                'description' => null,
                'what_it_does' => null,
                'key_output' => 'Momentum Phase',
                'version' => 'v1.0',
                'access' => 'core',
                'payment_url' => null,
                'sort_order' => 10,
                'is_featured' => true,
                'is_active' => true,
                'published_at' => now()->toDateTimeString(),
                'meta_title' => null,
                'meta_description' => null,
            ])
            ->assertRedirect(route('admin.modules.index'));

        $this->assertDatabaseHas(Module::class, [
            'title' => 'Momentum Cycles',
            'slug' => 'momentum-cycles',
        ]);

        $this->actingAs($admin)
            ->post(route('admin.playbooks.store'), [
                'playbook_category_id' => $category->id,
                'framework' => 'Market Environment',
                'slug' => '',
                'access' => 'base_access',
                'market' => 'Broad Market',
                'best_for' => 'Context before execution.',
                'average_hold_time' => null,
                'price_cents' => 7000,
                'currency' => 'USD',
                'payment_url' => null,
                'sort_order' => 20,
                'is_featured' => true,
                'is_active' => true,
                'published_at' => now()->toDateTimeString(),
                'meta_title' => null,
                'meta_description' => null,
            ])
            ->assertRedirect(route('admin.playbooks.index'));

        $this->assertDatabaseHas(Playbook::class, [
            'framework' => 'Market Environment',
            'slug' => 'market-environment',
            'price_cents' => 7000,
        ]);
    }

    public function test_admin_can_create_playbook_categories(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)
            ->post(route('admin.playbook-categories.store'), [
                'name' => 'Volatility & Structure',
                'slug' => '',
                'description' => 'Targets and structural confirmation.',
                'icon' => 'volatility-pulse',
                'color' => 'gold',
                'sort_order' => 30,
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.playbook-categories.index'));

        $this->assertDatabaseHas(PlaybookCategory::class, [
            'name' => 'Volatility & Structure',
            'slug' => 'volatility-structure',
        ]);
    }
}
