<?php

namespace Tests\Feature;

use App\Enums\AccessLevel;
use App\Models\Market;
use App\Models\Module;
use App\Models\Playbook;
use App\Models\TraderType;
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
        [$market, $traderType] = $this->catalogTaxonomies();

        $this->actingAs($admin)
            ->post(route('admin.modules.store'), [
                'market_id' => $market->id,
                'trader_type_ids' => [$traderType->id],
                'related_module_ids' => [],
                'icon' => 'momentum-cycles',
                'title' => 'Momentum Cycles',
                'slug' => '',
                'description' => 'Identify momentum phase and trend strength.',
                'version' => '1.0',
                'access' => AccessLevel::InviteOnlyIndicatorDiscord->value,
                'action_url' => 'https://example.com/modules/momentum-cycles',
                'sort_order' => 10,
                'is_featured' => true,
                'is_active' => true,
                'published_at' => now()->toDateTimeString(),
                'meta_title' => null,
                'meta_description' => null,
            ])
            ->assertRedirect(route('admin.modules.index'));

        $module = Module::where('slug', 'momentum-cycles')->firstOrFail();

        $this->assertDatabaseHas(Module::class, [
            'title' => 'Momentum Cycles',
            'slug' => 'momentum-cycles',
            'market_id' => $market->id,
            'access' => AccessLevel::InviteOnlyIndicatorDiscord->value,
            'action_url' => 'https://example.com/modules/momentum-cycles',
        ]);
        $this->assertDatabaseHas('module_trader_type', [
            'module_id' => $module->id,
            'trader_type_id' => $traderType->id,
        ]);

        $this->actingAs($admin)
            ->post(route('admin.playbooks.store'), [
                'market_id' => $market->id,
                'trader_type_ids' => [$traderType->id],
                'icon' => 'market-data-bars',
                'title' => 'Market Environment',
                'slug' => '',
                'access' => AccessLevel::DailyNewsletterDiscord->value,
                'best_for' => 'Context before execution.',
                'trading_pace' => 'Daily',
                'average_hold_time' => '1-3 days',
                'price' => '$70/mo',
                'action_url' => 'https://example.com/playbooks/market-environment',
                'sort_order' => 20,
                'is_featured' => true,
                'is_active' => true,
                'published_at' => now()->toDateTimeString(),
                'meta_title' => null,
                'meta_description' => null,
            ])
            ->assertRedirect(route('admin.playbooks.index'));

        $playbook = Playbook::where('slug', 'market-environment')->firstOrFail();

        $this->assertDatabaseHas(Playbook::class, [
            'title' => 'Market Environment',
            'slug' => 'market-environment',
            'market_id' => $market->id,
            'price' => '$70/mo',
            'action_url' => 'https://example.com/playbooks/market-environment',
        ]);
        $this->assertDatabaseHas('playbook_trader_type', [
            'playbook_id' => $playbook->id,
            'trader_type_id' => $traderType->id,
        ]);
    }

    public function test_admin_can_create_taxonomies(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)
            ->post(route('admin.markets.store'), [
                'name' => 'All',
                'slug' => '',
                'description' => 'Products and playbooks that apply across all supported markets.',
                'color' => 'gold',
                'sort_order' => 30,
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.markets.index'));

        $this->assertDatabaseHas(Market::class, [
            'name' => 'All',
            'slug' => 'all',
            'color' => 'gold',
        ]);

        $this->actingAs($admin)
            ->post(route('admin.trader-types.store'), [
                'name' => 'NYSE CORE',
                'slug' => '',
                'description' => 'Core-level trader type for NYSE market products.',
                'color' => 'seafoam-green',
                'icon' => 'turtle',
                'sort_order' => 10,
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.trader-types.index'));

        $this->assertDatabaseHas(TraderType::class, [
            'name' => 'NYSE CORE',
            'slug' => 'nyse-core',
            'icon' => 'turtle',
        ]);
    }

    /**
     * @return array{Market, TraderType}
     */
    private function catalogTaxonomies(): array
    {
        $market = Market::create([
            'name' => 'NYSE',
            'slug' => 'nyse',
            'description' => 'NYSE market products and playbooks.',
            'color' => 'seafoam-green',
            'sort_order' => 10,
            'is_active' => true,
        ]);

        $traderType = TraderType::create([
            'name' => 'NYSE CORE',
            'slug' => 'nyse-core',
            'description' => 'Core-level trader type for NYSE market products.',
            'color' => 'seafoam-green',
            'icon' => 'turtle',
            'sort_order' => 10,
            'is_active' => true,
        ]);

        return [$market, $traderType];
    }
}
