<?php

namespace Tests\Feature;

use App\Enums\AccessLevel;
use App\Models\Market;
use App\Models\Module;
use App\Models\Playbook;
use App\Models\TraderType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicCatalogTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_and_catalog_pages_render_public_records(): void
    {
        [$market, $traderType] = $this->catalogTaxonomies();

        $module = Module::create([
            'market_id' => $market->id,
            'title' => 'Momentum Cycles',
            'slug' => 'momentum-cycles',
            'description' => 'Identify momentum phase and trend strength.',
            'version' => 1.0,
            'access' => AccessLevel::InviteOnlyIndicatorDiscord,
            'sort_order' => 10,
            'is_featured' => true,
            'is_active' => true,
            'published_at' => now(),
        ]);
        $module->traderTypes()->attach($traderType);

        $nonFeaturedModule = Module::create([
            'market_id' => $market->id,
            'title' => 'Sequence Pressure',
            'slug' => 'sequence-pressure',
            'description' => 'Track exhaustion and pressure buildup.',
            'version' => 1.1,
            'access' => AccessLevel::InviteOnlyIndicatorDiscord,
            'sort_order' => 15,
            'is_featured' => false,
            'is_active' => true,
            'published_at' => now(),
        ]);
        $nonFeaturedModule->traderTypes()->attach($traderType);

        $activeUnpublishedModule = Module::create([
            'market_id' => $market->id,
            'title' => 'Active Unpublished Module',
            'slug' => 'active-unpublished-module',
            'access' => AccessLevel::InviteOnlyIndicatorDiscord,
            'sort_order' => 20,
            'is_featured' => false,
            'is_active' => true,
            'published_at' => null,
        ]);
        $activeUnpublishedModule->traderTypes()->attach($traderType);

        $inactiveModule = Module::create([
            'market_id' => $market->id,
            'title' => 'Inactive Module',
            'slug' => 'inactive-module',
            'access' => AccessLevel::InviteOnlyIndicatorDiscord,
            'sort_order' => 25,
            'is_featured' => true,
            'is_active' => false,
            'published_at' => now(),
        ]);
        $inactiveModule->traderTypes()->attach($traderType);

        $playbook = Playbook::create([
            'market_id' => $market->id,
            'title' => 'Market Environment',
            'slug' => 'market-environment',
            'access' => AccessLevel::DailyNewsletterDiscord,
            'best_for' => 'Context before execution.',
            'price' => '$70/mo',
            'sort_order' => 10,
            'is_featured' => true,
            'is_active' => true,
            'published_at' => now(),
        ]);
        $playbook->traderTypes()->attach($traderType);

        $activeUnpublishedPlaybook = Playbook::create([
            'market_id' => $market->id,
            'title' => 'Active Unpublished Playbook',
            'slug' => 'active-unpublished-playbook',
            'access' => AccessLevel::DailyNewsletterDiscord,
            'best_for' => 'Active associated playbook.',
            'price' => '$70/mo',
            'sort_order' => 15,
            'is_featured' => false,
            'is_active' => true,
            'published_at' => null,
        ]);
        $activeUnpublishedPlaybook->traderTypes()->attach($traderType);

        $inactivePlaybook = Playbook::create([
            'market_id' => $market->id,
            'title' => 'Inactive Playbook',
            'slug' => 'inactive-playbook',
            'access' => AccessLevel::DailyNewsletterDiscord,
            'best_for' => 'Inactive playbook.',
            'price' => '$70/mo',
            'sort_order' => 20,
            'is_featured' => true,
            'is_active' => false,
            'published_at' => now(),
        ]);
        $inactivePlaybook->traderTypes()->attach($traderType);

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Home')
                ->has('modules', 2)
                ->where('modules.0.title', 'Momentum Cycles')
                ->where('modules.1.title', 'Sequence Pressure')
                ->has('playbooks', 1)
                ->where('playbooks.0.title', 'Market Environment'));

        $this->get('/modules')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Modules/Index')
                ->has('modules', 2)
                ->where('modules.0.slug', 'momentum-cycles'));

        $this->get('/playbooks')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Playbooks/Index')
                ->has('playbooks', 1)
                ->where('playbooks.0.slug', 'market-environment'));

        $this->get('/trader-types')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('TraderTypes')
                ->has('traderTypes', 1)
                ->where('traderTypes.0.name', 'NYSE CORE')
                ->has('traderTypes.0.modules', 3)
                ->where('traderTypes.0.modules.0.title', 'Momentum Cycles')
                ->where('traderTypes.0.modules.1.title', 'Sequence Pressure')
                ->where('traderTypes.0.modules.2.title', 'Active Unpublished Module')
                ->has('traderTypes.0.playbooks', 2)
                ->where('traderTypes.0.playbooks.0.title', 'Market Environment')
                ->where('traderTypes.0.playbooks.1.title', 'Active Unpublished Playbook'));

        $this->get('/testimonials')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Testimonials'));
    }

    public function test_public_detail_pages_respect_publish_state(): void
    {
        [$market, $traderType] = $this->catalogTaxonomies();

        $module = Module::create([
            'market_id' => $market->id,
            'title' => 'Momentum Cycles',
            'slug' => 'momentum-cycles',
            'description' => 'Identify momentum phase and trend strength.',
            'access' => AccessLevel::InviteOnlyIndicatorDiscord,
            'sort_order' => 10,
            'is_featured' => true,
            'is_active' => true,
            'published_at' => now(),
        ]);
        $module->traderTypes()->attach($traderType);

        Module::create([
            'market_id' => $market->id,
            'title' => 'Private Module',
            'slug' => 'private-module',
            'access' => AccessLevel::InviteOnlyIndicatorDiscord,
            'sort_order' => 20,
            'is_featured' => false,
            'is_active' => false,
            'published_at' => now(),
        ]);

        $playbook = Playbook::create([
            'market_id' => $market->id,
            'title' => 'Market Environment',
            'slug' => 'market-environment',
            'access' => AccessLevel::DailyNewsletterDiscord,
            'price' => '$70/mo',
            'sort_order' => 10,
            'is_featured' => true,
            'is_active' => true,
            'published_at' => now(),
        ]);
        $playbook->traderTypes()->attach($traderType);

        $this->get('/modules/momentum-cycles')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Modules/Show')
                ->where('module.slug', 'momentum-cycles'));

        $this->get('/playbooks/market-environment')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Playbooks/Show')
                ->where('playbook.slug', 'market-environment'));

        $this->get('/modules/private-module')->assertNotFound();
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
