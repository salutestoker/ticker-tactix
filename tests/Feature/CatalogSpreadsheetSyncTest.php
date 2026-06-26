<?php

namespace Tests\Feature;

use App\Enums\AccessLevel;
use App\Models\Market;
use App\Models\Module;
use App\Models\Playbook;
use App\Models\TraderType;
use App\Services\CatalogSpreadsheetSyncService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CatalogSpreadsheetSyncTest extends TestCase
{
    use RefreshDatabase;

    public function test_spreadsheet_sync_can_use_a_private_storage_disk(): void
    {
        config([
            'catalog.spreadsheet_disk' => 'catalog_spreadsheets',
            'catalog.spreadsheet_directory' => 'catalog',
        ]);

        Storage::fake('catalog_spreadsheets');

        [$module, $playbook] = $this->catalogRecords();

        $sync = app(CatalogSpreadsheetSyncService::class);
        $counts = $sync->exportAll();

        $this->assertSame([
            'trader_types' => 1,
            'modules' => 1,
            'playbooks' => 1,
        ], $counts);

        Storage::disk('catalog_spreadsheets')->assertExists('catalog/trader_types.csv');
        Storage::disk('catalog_spreadsheets')->assertExists('catalog/modules.csv');
        Storage::disk('catalog_spreadsheets')->assertExists('catalog/playbooks.csv');
        Storage::disk('catalog_spreadsheets')->assertExists('catalog/catalog-spreadsheet-sync.json');

        Storage::disk('catalog_spreadsheets')->put(
            'catalog/playbooks.csv',
            str_replace(
                [
                    'https://www.youtube.com/watch?v=oHg5SJYRHA0',
                    '$10/mo',
                    'Check your Discord onboarding steps.',
                ],
                [
                    'https://youtu.be/dQw4w9WgXcQ',
                    '$15/mo',
                    '<p>Check <strong>Discord</strong><script>alert(1)</script><a href="javascript:alert(1)">bad link</a>.</p>',
                ],
                Storage::disk('catalog_spreadsheets')->get('catalog/playbooks.csv'),
            ),
        );
        Storage::disk('catalog_spreadsheets')->put(
            'catalog/modules.csv',
            str_replace(
                'Request TradingView access.',
                '<p>Request <strong>TradingView</strong><script>alert(1)</script>.</p>',
                Storage::disk('catalog_spreadsheets')->get('catalog/modules.csv'),
            ),
        );

        $result = $sync->importChanged();

        $this->assertTrue($result['imported']);
        $this->assertSame('$15/mo', $playbook->refresh()->price);
        $this->assertSame('https://youtu.be/dQw4w9WgXcQ', $playbook->youtube_url);
        $this->assertSame('$7/mo', $module->refresh()->price);
        $this->assertSame('https://youtu.be/9bZkp7q19f0', $module->youtube_url);
        $this->assertStringContainsString('<strong>Discord</strong>', (string) $playbook->purchase_email_body);
        $this->assertStringContainsString('<a>bad link</a>', (string) $playbook->purchase_email_body);
        $this->assertStringContainsString('<strong>TradingView</strong>', (string) $module->purchase_email_body);
        $this->assertStringNotContainsString('script', (string) $playbook->purchase_email_body);
        $this->assertStringNotContainsString('alert(1)', (string) $playbook->purchase_email_body);
        $this->assertStringNotContainsString('javascript:', (string) $playbook->purchase_email_body);
        $this->assertStringNotContainsString('script', (string) $module->purchase_email_body);
    }

    /**
     * @return array{Module, Playbook}
     */
    private function catalogRecords(): array
    {
        $market = Market::create([
            'name' => 'NYSE',
            'slug' => 'nyse',
            'sort_order' => 10,
            'is_active' => true,
        ]);

        $traderType = TraderType::create([
            'name' => 'Daily Context',
            'slug' => 'daily-context',
            'sort_order' => 10,
            'is_active' => true,
        ]);

        $module = Module::create([
            'market_id' => $market->id,
            'title' => 'Market Structure',
            'slug' => 'market-structure',
            'price' => '$7/mo',
            'youtube_url' => 'https://youtu.be/9bZkp7q19f0',
            'access' => AccessLevel::InviteOnlyIndicatorDiscord,
            'sort_order' => 10,
            'stripe_product_id' => 'prod_module_market_structure',
            'stripe_price_id' => 'price_module_market_structure',
            'purchase_email_subject' => 'Welcome to Market Structure',
            'purchase_email_body' => 'Request TradingView access.',
            'is_featured' => false,
            'is_active' => true,
            'published_at' => now(),
        ]);
        $module->traderTypes()->attach($traderType);

        $playbook = Playbook::create([
            'market_id' => $market->id,
            'title' => 'Opening Range',
            'slug' => 'opening-range',
            'access' => AccessLevel::DailyNewsletterDiscord,
            'price' => '$10/mo',
            'youtube_url' => 'https://www.youtube.com/watch?v=oHg5SJYRHA0',
            'sort_order' => 10,
            'stripe_product_id' => 'prod_playbook_opening_range',
            'stripe_price_id' => 'price_playbook_opening_range',
            'purchase_email_subject' => 'Welcome to Opening Range',
            'purchase_email_body' => 'Check your Discord onboarding steps.',
            'is_featured' => false,
            'is_active' => true,
            'published_at' => now(),
        ]);
        $playbook->traderTypes()->attach($traderType);

        return [$module, $playbook];
    }
}
