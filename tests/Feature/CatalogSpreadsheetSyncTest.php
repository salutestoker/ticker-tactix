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
            str_replace('$10/mo', '$15/mo', Storage::disk('catalog_spreadsheets')->get('catalog/playbooks.csv')),
        );

        $result = $sync->importChanged();

        $this->assertTrue($result['imported']);
        $this->assertSame('$15/mo', $playbook->refresh()->price);
        $this->assertSame('$7/mo', $module->refresh()->price);
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
            'access' => AccessLevel::InviteOnlyIndicatorDiscord,
            'sort_order' => 10,
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
            'sort_order' => 10,
            'is_featured' => false,
            'is_active' => true,
            'published_at' => now(),
        ]);
        $playbook->traderTypes()->attach($traderType);

        return [$module, $playbook];
    }
}
