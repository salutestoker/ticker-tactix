<?php

namespace Tests\Feature;

use App\Enums\AccessLevel;
use App\Models\Market;
use App\Models\Module;
use App\Models\Playbook;
use App\Models\TraderType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
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
        Storage::fake('public');

        $admin = User::factory()->create(['is_admin' => true]);
        [$market, $traderType] = $this->catalogTaxonomies();

        $this->actingAs($admin)
            ->post(route('admin.modules.store'), [
                'market_id' => $market->id,
                'trader_type_ids' => [$traderType->id],
                'related_module_ids' => [],
                'icon' => 'momentum-cycles',
                'image' => UploadedFile::fake()->create('momentum-cycles.jpg', 12, 'image/jpeg'),
                'banner_image' => UploadedFile::fake()->create('momentum-cycles-banner.jpg', 18, 'image/jpeg'),
                'title' => 'Momentum Cycles',
                'slug' => '',
                'description' => 'Identify momentum phase and trend strength.',
                'core_features' => [
                    [
                        'label' => 'Signal Line',
                        'icon' => 'pulse',
                        'tone' => 'green',
                        'description' => 'Captures real-time directional bias.',
                    ],
                    [
                        'label' => 'Range Rails',
                        'icon' => 'range-rails',
                        'tone' => 'gold',
                        'description' => 'Marks adaptive price boundaries.',
                    ],
                    [
                        'label' => '',
                        'icon' => 'chat',
                        'tone' => 'violet',
                        'description' => 'Ignored because it has no title.',
                    ],
                ],
                'version' => '1.0',
                'access' => AccessLevel::InviteOnlyIndicatorDiscord->value,
                'action_url' => 'https://example.com/modules/momentum-cycles',
                'youtube_url' => 'https://youtu.be/dQw4w9WgXcQ',
                'stripe_product_id' => 'prod_module_momentum_cycles',
                'stripe_price_id' => 'price_module_momentum_cycles',
                'purchase_email_subject' => 'Welcome to Momentum Cycles',
                'purchase_email_body' => "Open Discord.\nRequest TradingView access.",
                'sort_order' => 10,
                'is_featured' => true,
                'is_active' => true,
                'published_at' => now()->toDateTimeString(),
                'meta_title' => null,
                'meta_description' => null,
            ])
            ->assertRedirect(route('admin.modules.index'));

        $module = Module::where('slug', 'momentum-cycles')->firstOrFail();

        Storage::disk('public')->assertExists($module->image_path);
        Storage::disk('public')->assertExists($module->banner_image);
        $this->assertEquals([
            [
                'label' => 'Signal Line',
                'description' => 'Captures real-time directional bias.',
                'icon' => 'pulse',
                'tone' => 'green',
            ],
            [
                'label' => 'Range Rails',
                'description' => 'Marks adaptive price boundaries.',
                'icon' => 'range-rails',
                'tone' => 'gold',
            ],
        ], $module->core_features);
        $this->assertDatabaseHas(Module::class, [
            'title' => 'Momentum Cycles',
            'slug' => 'momentum-cycles',
            'market_id' => $market->id,
            'access' => AccessLevel::InviteOnlyIndicatorDiscord->value,
            'action_url' => 'https://example.com/modules/momentum-cycles',
            'youtube_url' => 'https://youtu.be/dQw4w9WgXcQ',
            'stripe_product_id' => 'prod_module_momentum_cycles',
            'stripe_price_id' => 'price_module_momentum_cycles',
            'purchase_email_subject' => 'Welcome to Momentum Cycles',
            'purchase_email_body' => "Open Discord.\nRequest TradingView access.",
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
                'logo' => UploadedFile::fake()->create('market-environment.jpg', 12, 'image/jpeg'),
                'banner_image' => UploadedFile::fake()->create('market-environment-banner.jpg', 18, 'image/jpeg'),
                'title' => 'Market Environment',
                'slug' => '',
                'access' => AccessLevel::DailyNewsletterDiscord->value,
                'best_for' => 'Context before execution.',
                'long_description' => "Context before execution.\nRepeat the same process every time.",
                'trading_pace' => 'Daily',
                'average_hold_time' => '1-3 days',
                'price' => '$70/mo',
                'action_url' => 'https://example.com/playbooks/market-environment',
                'youtube_url' => 'https://www.youtube.com/watch?v=oHg5SJYRHA0',
                'stripe_product_id' => 'prod_playbook_market_environment',
                'stripe_price_id' => 'price_playbook_market_environment',
                'purchase_email_subject' => 'Welcome to Market Environment',
                'purchase_email_body' => "Join Discord.\nWatch your inbox for daily delivery.",
                'sort_order' => 20,
                'is_featured' => true,
                'is_active' => true,
                'published_at' => now()->toDateTimeString(),
                'meta_title' => null,
                'meta_description' => null,
            ])
            ->assertRedirect(route('admin.playbooks.index'));

        $playbook = Playbook::where('slug', 'market-environment')->firstOrFail();

        Storage::disk('public')->assertExists($playbook->logo_path);
        Storage::disk('public')->assertExists($playbook->banner_image);
        $this->assertDatabaseHas(Playbook::class, [
            'title' => 'Market Environment',
            'slug' => 'market-environment',
            'market_id' => $market->id,
            'price' => '$70/mo',
            'action_url' => 'https://example.com/playbooks/market-environment',
            'youtube_url' => 'https://www.youtube.com/watch?v=oHg5SJYRHA0',
            'stripe_product_id' => 'prod_playbook_market_environment',
            'stripe_price_id' => 'price_playbook_market_environment',
            'purchase_email_subject' => 'Welcome to Market Environment',
            'purchase_email_body' => "Join Discord.\nWatch your inbox for daily delivery.",
            'long_description' => "Context before execution.\nRepeat the same process every time.",
        ]);
        $this->assertDatabaseHas('playbook_trader_type', [
            'playbook_id' => $playbook->id,
            'trader_type_id' => $traderType->id,
        ]);
    }

    public function test_admin_catalog_rich_text_fields_are_sanitized(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        [$market, $traderType] = $this->catalogTaxonomies();

        $this->actingAs($admin)
            ->post(route('admin.modules.store'), [
                'market_id' => $market->id,
                'trader_type_ids' => [$traderType->id],
                'title' => 'Rich Text Module',
                'slug' => '',
                'access' => AccessLevel::InviteOnlyIndicatorDiscord->value,
                'description' => '<h2>Setup</h2><p>Use <strong>structure</strong><script>alert(1)</script><a href="javascript:alert(1)" onclick="bad()">bad link</a><a href="https://example.com" onclick="bad()">safe link</a></p>',
                'module_overview' => '<p><u>Overview</u> with <em>timing</em>.</p>',
                'purchase_email_body' => '<p>Join <a href="mailto:support@example.com">support</a>.</p>',
                'is_featured' => false,
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.modules.index'));

        $module = Module::where('slug', 'rich-text-module')->firstOrFail();

        $this->assertStringContainsString('<h2>Setup</h2>', (string) $module->description);
        $this->assertStringContainsString('<strong>structure</strong>', (string) $module->description);
        $this->assertStringContainsString('<a>bad link</a>', (string) $module->description);
        $this->assertStringContainsString('<a href="https://example.com">safe link</a>', (string) $module->description);
        $this->assertStringContainsString('<u>Overview</u>', (string) $module->module_overview);
        $this->assertStringContainsString('<em>timing</em>', (string) $module->module_overview);
        $this->assertStringContainsString('mailto:support&#64;example.com', (string) $module->purchase_email_body);
        $this->assertStringNotContainsString('script', (string) $module->description);
        $this->assertStringNotContainsString('alert(1)', (string) $module->description);
        $this->assertStringNotContainsString('onclick', (string) $module->description);
        $this->assertStringNotContainsString('javascript:', (string) $module->description);

        $this->actingAs($admin)
            ->post(route('admin.playbooks.store'), [
                'market_id' => $market->id,
                'trader_type_ids' => [$traderType->id],
                'title' => 'Rich Text Playbook',
                'slug' => '',
                'access' => AccessLevel::DailyNewsletterDiscord->value,
                'long_description' => '<h3>Routine</h3><p>Review <strong>context</strong><script>alert(1)</script>.</p>',
                'purchase_email_body' => '<p>Read the <a href="https://example.com/checklist" onclick="bad()">checklist</a>.</p>',
                'is_featured' => false,
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.playbooks.index'));

        $playbook = Playbook::where('slug', 'rich-text-playbook')->firstOrFail();

        $this->assertStringContainsString('<h3>Routine</h3>', (string) $playbook->long_description);
        $this->assertStringContainsString('<strong>context</strong>', (string) $playbook->long_description);
        $this->assertStringContainsString('href="https://example.com/checklist"', (string) $playbook->purchase_email_body);
        $this->assertStringNotContainsString('script', (string) $playbook->long_description);
        $this->assertStringNotContainsString('alert(1)', (string) $playbook->long_description);
        $this->assertStringNotContainsString('onclick', (string) $playbook->purchase_email_body);
    }

    public function test_admin_catalog_requires_youtube_video_urls(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        [$market, $traderType] = $this->catalogTaxonomies();

        $this->actingAs($admin)
            ->from(route('admin.modules.create'))
            ->post(route('admin.modules.store'), [
                'market_id' => $market->id,
                'trader_type_ids' => [$traderType->id],
                'title' => 'Invalid Video Module',
                'access' => AccessLevel::InviteOnlyIndicatorDiscord->value,
                'youtube_url' => 'https://example.com/not-a-youtube-video',
                'is_featured' => false,
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.modules.create'))
            ->assertSessionHasErrors('youtube_url');

        $this->actingAs($admin)
            ->from(route('admin.playbooks.create'))
            ->post(route('admin.playbooks.store'), [
                'market_id' => $market->id,
                'trader_type_ids' => [$traderType->id],
                'title' => 'Invalid Video Playbook',
                'access' => AccessLevel::DailyNewsletterDiscord->value,
                'youtube_url' => 'https://vimeo.com/123456',
                'is_featured' => false,
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.playbooks.create'))
            ->assertSessionHasErrors('youtube_url');
    }

    public function test_admin_can_reorder_modules_and_playbooks(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        [$market, $traderType] = $this->catalogTaxonomies();

        $moduleA = Module::create([
            'market_id' => $market->id,
            'title' => 'First Module',
            'slug' => 'first-module',
            'access' => AccessLevel::InviteOnlyIndicatorDiscord,
            'sort_order' => 10,
            'is_featured' => false,
            'is_active' => true,
            'published_at' => now(),
        ]);
        $moduleA->traderTypes()->attach($traderType);

        $moduleB = Module::create([
            'market_id' => $market->id,
            'title' => 'Second Module',
            'slug' => 'second-module',
            'access' => AccessLevel::InviteOnlyIndicatorDiscord,
            'sort_order' => 20,
            'is_featured' => false,
            'is_active' => true,
            'published_at' => now(),
        ]);
        $moduleB->traderTypes()->attach($traderType);

        $this->actingAs($admin)
            ->post(route('admin.modules.reorder'), [
                'ordered_ids' => [$moduleB->id, $moduleA->id],
            ])
            ->assertRedirect();

        $this->assertDatabaseHas(Module::class, [
            'id' => $moduleB->id,
            'sort_order' => 0,
        ]);
        $this->assertDatabaseHas(Module::class, [
            'id' => $moduleA->id,
            'sort_order' => 1,
        ]);

        $playbookA = Playbook::create([
            'market_id' => $market->id,
            'title' => 'First Playbook',
            'slug' => 'first-playbook',
            'access' => AccessLevel::DailyNewsletterDiscord,
            'sort_order' => 10,
            'is_featured' => false,
            'is_active' => true,
            'published_at' => now(),
        ]);
        $playbookA->traderTypes()->attach($traderType);

        $playbookB = Playbook::create([
            'market_id' => $market->id,
            'title' => 'Second Playbook',
            'slug' => 'second-playbook',
            'access' => AccessLevel::DailyNewsletterDiscord,
            'sort_order' => 20,
            'is_featured' => false,
            'is_active' => true,
            'published_at' => now(),
        ]);
        $playbookB->traderTypes()->attach($traderType);

        $this->actingAs($admin)
            ->post(route('admin.playbooks.reorder'), [
                'ordered_ids' => [$playbookB->id, $playbookA->id],
            ])
            ->assertRedirect();

        $this->assertDatabaseHas(Playbook::class, [
            'id' => $playbookB->id,
            'sort_order' => 0,
        ]);
        $this->assertDatabaseHas(Playbook::class, [
            'id' => $playbookA->id,
            'sort_order' => 1,
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
