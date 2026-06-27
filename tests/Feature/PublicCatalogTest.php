<?php

namespace Tests\Feature;

use App\Enums\AccessLevel;
use App\Models\Market;
use App\Models\Module;
use App\Models\Playbook;
use App\Models\TraderType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicCatalogTest extends TestCase
{
    use RefreshDatabase;

    public function test_homepage_renders_social_metadata(): void
    {
        $description = 'Trade with structure not emotion. A rules-based market operating system for traders who value structure over signals.';

        $this->assertSocialMetadata(
            response: $this->get('/')->assertOk(),
            title: 'Ticker-Tactix',
            description: $description,
            canonicalUrl: url('/'),
            imageUrl: url('/design/assets/images/open-graph/ticker-tactix-2026--compressed.jpg'),
            imageAlt: 'Ticker-Tactix hero artwork with the headline Trade with Structure Not Emotion.',
            imageWidth: 1200,
            imageHeight: 630,
        );
    }

    public function test_public_pages_render_unique_social_metadata(): void
    {
        [$market, $traderType] = $this->catalogTaxonomies();

        $module = Module::create([
            'market_id' => $market->id,
            'title' => 'Sequence Pressure',
            'slug' => 'sequence-pressure',
            'description' => 'Track exhaustion and pressure buildup.',
            'access' => AccessLevel::InviteOnlyIndicatorDiscord,
            'sort_order' => 10,
            'is_featured' => true,
            'is_active' => true,
            'published_at' => now(),
            'meta_title' => 'Sequence Pressure Timing Module',
            'meta_description' => 'Spot directional exhaustion and pressure buildup before a move becomes vulnerable to recoil.',
        ]);
        $module->traderTypes()->attach($traderType);

        $playbook = Playbook::create([
            'market_id' => $market->id,
            'title' => 'Market Environment',
            'slug' => 'market-environment',
            'access' => AccessLevel::DailyNewsletterDiscord,
            'best_for' => 'Context before execution.',
            'long_description' => "Context before execution.\nRepeat the same process every time.",
            'banner_image' => 'playbook-banner-images/market-environment.jpg',
            'price' => '$70/mo',
            'sort_order' => 10,
            'is_featured' => true,
            'is_active' => true,
            'published_at' => now(),
            'meta_title' => 'Market Environment Briefing',
            'meta_description' => 'Daily context and volatility guidance for traders who want structure before execution.',
        ]);
        $playbook->traderTypes()->attach($traderType);

        $this->assertSocialMetadata(
            response: $this->get('/contact')->assertOk(),
            title: 'Contact Support - Ticker-Tactix',
            description: 'Send onboarding details needed to investigate subscription access, TradingView setup, or Discord membership issues.',
            canonicalUrl: url('/contact'),
            imageUrl: url('/design/assets/images/bg-testimonials.jpg'),
            imageAlt: 'Ticker-Tactix contact support hero artwork.',
            imageWidth: 1672,
            imageHeight: 941,
        );

        $this->assertSocialMetadata(
            response: $this->get('/modules')->assertOk(),
            title: 'Modules - Ticker-Tactix',
            description: 'Specialized components that power the Ticker-Tactix system by organizing market context, trend, participation, and structure.',
            canonicalUrl: url('/modules'),
            imageUrl: url('/design/assets/images/bg-modules.jpg'),
            imageAlt: 'Ticker-Tactix module matrix hero artwork.',
            imageWidth: 1672,
            imageHeight: 941,
        );

        $this->assertSocialMetadata(
            response: $this->get('/playbooks')->assertOk(),
            title: 'Playbooks - Ticker-Tactix',
            description: 'Deployable trading frameworks that convert module output into repeatable structure for market execution.',
            canonicalUrl: url('/playbooks'),
            imageUrl: url('/design/assets/images/bg-playbooks.jpg'),
            imageAlt: 'Ticker-Tactix playbook matrix hero artwork.',
            imageWidth: 1672,
            imageHeight: 941,
        );

        $this->assertSocialMetadata(
            response: $this->get('/modules/sequence-pressure')->assertOk(),
            title: 'Sequence Pressure Timing Module',
            description: 'Spot directional exhaustion and pressure buildup before a move becomes vulnerable to recoil.',
            canonicalUrl: url('/modules/sequence-pressure'),
            imageUrl: url('/design/assets/images/modules/module-banner--sequence-pressure.jpg'),
            imageAlt: 'Sequence Pressure module preview from Ticker-Tactix.',
            imageWidth: 1448,
            imageHeight: 699,
        );

        $playbookResponse = $this->get('/playbooks/market-environment')->assertOk();
        $this->assertSocialMetadata(
            response: $playbookResponse,
            title: 'Market Environment Briefing',
            description: 'Daily context and volatility guidance for traders who want structure before execution.',
            canonicalUrl: url('/playbooks/market-environment'),
            imageUrl: url('/storage/playbook-banner-images/market-environment.jpg'),
            imageAlt: 'Market Environment playbook preview from Ticker-Tactix.',
        );
        $playbookResponse
            ->assertDontSee('<meta property="og:image:width"', false)
            ->assertDontSee('<meta property="og:image:height"', false);

        $this->assertSocialMetadata(
            response: $this->get('/trader-types/nyse-core')->assertOk(),
            title: 'NYSE CORE - Ticker-Tactix',
            description: 'Core-level trader type for NYSE market products.',
            canonicalUrl: url('/trader-types/nyse-core'),
            imageUrl: url('/design/assets/images/open-graph/ticker-tactix-2026--compressed.jpg'),
            imageAlt: 'Ticker-Tactix hero artwork with the headline Trade with Structure Not Emotion.',
            imageWidth: 1200,
            imageHeight: 630,
        );
    }

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
            'long_description' => "Context before execution.\nRepeat the same process every time.",
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
            'long_description' => "Active associated playbook.\nKeep it private.",
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
            'long_description' => 'Inactive playbook.',
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

        $this->get('/trader-types/nyse-core')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('TraderTypes/Show')
                ->where('traderType.slug', 'nyse-core')
                ->has('traderType.modules', 2)
                ->where('traderType.modules.0.title', 'Momentum Cycles')
                ->where('traderType.modules.1.title', 'Sequence Pressure')
                ->has('traderType.playbooks', 1)
                ->where('traderType.playbooks.0.title', 'Market Environment'));

        $this->get('/terms-of-service')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Legal/Show')
                ->where('title', 'Terms of Service')
                ->where('slug', 'terms-of-service'));

        $this->get('/membership-agreement')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Legal/Show')
                ->where('title', 'Membership Agreement')
                ->where('slug', 'membership-agreement'));

        $this->get('/privacy-policy')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Legal/Show')
                ->where('title', 'Privacy Policy')
                ->where('slug', 'privacy-policy'));

        $this->get('/financial-disclaimer')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Legal/Show')
                ->where('title', 'Financial Disclaimer')
                ->where('slug', 'financial-disclaimer'));

        $this->get('/risk-disclaimer')->assertRedirect('/financial-disclaimer');
    }

    public function test_public_detail_pages_respect_publish_state(): void
    {
        [$market, $traderType] = $this->catalogTaxonomies();

        $module = Module::create([
            'market_id' => $market->id,
            'title' => 'Momentum Cycles',
            'slug' => 'momentum-cycles',
            'description' => 'Identify momentum phase and trend strength.',
            'youtube_url' => 'https://youtu.be/dQw4w9WgXcQ',
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
            'long_description' => "Context before execution.\nRepeat the same process every time.",
            'youtube_url' => 'https://www.youtube.com/watch?v=oHg5SJYRHA0',
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
                ->where('module.slug', 'momentum-cycles')
                ->where('module.youtube_url', 'https://youtu.be/dQw4w9WgXcQ'));

        $this->get('/playbooks/market-environment')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Playbooks/Show')
                ->where('playbook.slug', 'market-environment')
                ->where('playbook.youtube_url', 'https://www.youtube.com/watch?v=oHg5SJYRHA0'));

        $this->get('/trader-types/nyse-core')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('TraderTypes/Show')
                ->where('traderType.slug', 'nyse-core'));

        $inactiveTraderType = TraderType::create([
            'name' => 'Inactive Trader Type',
            'slug' => 'inactive-trader-type',
            'color' => 'violet-light',
            'icon' => 'command-cube',
            'sort_order' => 20,
            'is_active' => false,
        ]);

        $this->get('/modules/private-module')->assertNotFound();
        $this->get('/trader-types/'.$inactiveTraderType->slug)->assertNotFound();
    }

    public function test_public_detail_pages_receive_safe_rich_text_html(): void
    {
        [$market, $traderType] = $this->catalogTaxonomies();

        $module = Module::create([
            'market_id' => $market->id,
            'title' => 'Momentum Cycles',
            'slug' => 'momentum-cycles',
            'description' => '<p>Trade with <strong>structure</strong><script>alert(1)</script><a href="javascript:alert(1)">bad link</a>.</p>',
            'module_overview' => "Overview line one\nOverview line two.",
            'access' => AccessLevel::InviteOnlyIndicatorDiscord,
            'sort_order' => 10,
            'is_featured' => true,
            'is_active' => true,
            'published_at' => now(),
        ]);
        $module->traderTypes()->attach($traderType);

        $playbook = Playbook::create([
            'market_id' => $market->id,
            'title' => 'Market Environment',
            'slug' => 'market-environment',
            'access' => AccessLevel::DailyNewsletterDiscord,
            'long_description' => "Context before execution.\nRepeat the same process every time.",
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
                ->where('module.description', fn (string $description): bool => str_contains($description, '<strong>structure</strong>')
                    && str_contains($description, '<a>bad link</a>')
                    && ! str_contains($description, 'alert(1)')
                    && ! str_contains($description, 'javascript:'))
                ->where('module.module_overview', fn (string $overview): bool => str_contains($overview, '<p>Overview line one<br>')
                    && str_contains($overview, 'Overview line two.</p>')));

        $this->get('/playbooks/market-environment')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Playbooks/Show')
                ->where('playbook.long_description', fn (string $description): bool => str_contains($description, '<p>Context before execution.<br>')
                    && str_contains($description, 'Repeat the same process every time.</p>')));
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

    private function assertSocialMetadata(
        TestResponse $response,
        string $title,
        string $description,
        string $canonicalUrl,
        string $imageUrl,
        string $imageAlt,
        string $imageType = 'image/jpeg',
        ?int $imageWidth = null,
        ?int $imageHeight = null,
    ): void {
        $response
            ->assertSee('<title inertia>'.$title.'</title>', false)
            ->assertSee('<meta name="description" content="'.$description.'">', false)
            ->assertSee('<link rel="canonical" href="'.$canonicalUrl.'">', false)
            ->assertSee('<meta property="og:type" content="website">', false)
            ->assertSee('<meta property="og:site_name" content="Ticker-Tactix">', false)
            ->assertSee('<meta property="og:title" content="'.$title.'">', false)
            ->assertSee('<meta property="og:description" content="'.$description.'">', false)
            ->assertSee('<meta property="og:url" content="'.$canonicalUrl.'">', false)
            ->assertSee('<meta property="og:image" content="'.$imageUrl.'">', false)
            ->assertSee('<meta property="og:image:secure_url" content="'.$imageUrl.'">', false)
            ->assertSee('<meta property="og:image:type" content="'.$imageType.'">', false)
            ->assertSee('<meta property="og:image:alt" content="'.$imageAlt.'">', false)
            ->assertSee('<meta name="twitter:card" content="summary_large_image">', false)
            ->assertSee('<meta name="twitter:title" content="'.$title.'">', false)
            ->assertSee('<meta name="twitter:description" content="'.$description.'">', false)
            ->assertSee('<meta name="twitter:image" content="'.$imageUrl.'">', false)
            ->assertSee('<meta name="twitter:image:alt" content="'.$imageAlt.'">', false);

        if ($imageWidth !== null) {
            $response->assertSee('<meta property="og:image:width" content="'.$imageWidth.'">', false);
        }

        if ($imageHeight !== null) {
            $response->assertSee('<meta property="og:image:height" content="'.$imageHeight.'">', false);
        }
    }
}
