<?php

namespace Database\Seeders;

use App\Enums\AccessLevel;
use App\Models\Market;
use App\Models\Module;
use App\Models\Playbook;
use App\Models\TraderType;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@tickertactix.test'],
            [
                'name' => 'Ticker Tactix Admin',
                'password' => Hash::make('password'),
                'is_admin' => true,
                'email_verified_at' => now(),
            ],
        );

        DB::table('module_related_modules')->delete();
        DB::table('module_trader_type')->delete();
        DB::table('playbook_trader_type')->delete();
        Module::withTrashed()->forceDelete();
        Playbook::withTrashed()->forceDelete();

        $markets = collect([
            ['name' => 'Crypto', 'description' => 'Crypto market products and playbooks.', 'color' => 'violet-light', 'sort_order' => 10],
            ['name' => 'NYSE', 'description' => 'NYSE market products and playbooks.', 'color' => 'seafoam-green', 'sort_order' => 20],
            ['name' => 'All', 'description' => 'Products and playbooks that apply across all supported markets.', 'color' => 'gold', 'sort_order' => 30],
        ])->mapWithKeys(fn (array $market) => [
            $market['name'] => Market::updateOrCreate(
                ['slug' => Str::slug($market['name'])],
                [...$market, 'slug' => Str::slug($market['name']), 'is_active' => true],
            ),
        ]);

        $traderTypes = collect([
            ['name' => 'NYSE BASE', 'description' => 'Base-level trader type for NYSE market products.', 'color' => 'violet-light', 'icon' => null, 'sort_order' => 10],
            ['name' => 'CRYPTO BASE', 'description' => 'Base-level trader type for crypto market products.', 'color' => 'violet-light', 'icon' => null, 'sort_order' => 20],
            ['name' => 'NYSE CORE', 'description' => 'Core-level trader type for NYSE market products.', 'color' => 'seafoam-green', 'icon' => 'turtle', 'sort_order' => 30],
            ['name' => 'CRYPTO CORE', 'description' => 'Core-level trader type for crypto market products.', 'color' => 'seafoam-green', 'icon' => 'turtle', 'sort_order' => 40],
            ['name' => 'NYSE PRO', 'description' => 'Pro-level trader type for NYSE market products.', 'color' => 'gold', 'icon' => 'bunny', 'sort_order' => 50],
            ['name' => 'CRYPTO PRO', 'description' => 'Pro-level trader type for crypto market products.', 'color' => 'gold', 'icon' => 'bunny', 'sort_order' => 60],
        ])->mapWithKeys(fn (array $traderType) => [
            $traderType['name'] => TraderType::updateOrCreate(
                ['slug' => Str::slug($traderType['name'])],
                [...$traderType, 'slug' => Str::slug($traderType['name']), 'is_active' => true],
            ),
        ]);

        $moduleRows = [
            ['Momentum Cycles', 'Measures directional momentum phase and trend strength, helping identify when conditions are aligned bullish or bearish.', 'NYSE BASE; NYSE CORE; NYSE PRO; CRYPTO CORE; CRYPTO PRO', 'All', AccessLevel::InviteOnlyIndicatorDiscord->value, 'v1.33', 'Explore Module', 'momentum-cycles'],
            ['Sequence Pressure', 'Tracks directional exhaustion and pressure buildup to help identify when a move may be weakening or becoming vulnerable to recoil.', 'NYSE BASE; NYSE CORE; NYSE PRO; CRYPTO CORE; CRYPTO PRO', 'All', AccessLevel::InviteOnlyIndicatorDiscord->value, 'v1.44', 'Explore Module', 'sequence-pressure'],
            ['Trend Tracer', 'Maps broader directional flow and trend posture to help determine whether market structure is supporting continuation or deterioration.', 'NYSE PRO', 'NYSE', AccessLevel::InviteOnlyIndicatorDiscord->value, 'v1.2', 'Explore Module', 'trend-tracer'],
            ['Crypto Velocity Stats', 'Measures short-term crypto momentum statistics and directional acceleration across the selected asset and timeframe.', 'CRYPTO PRO', 'Crypto', AccessLevel::InviteOnlyIndicatorDiscord->value, 'v1.5', 'Explore Module', 'volatility-pulse'],
            ['Info Box', 'Displays a compact market HUD with key breadth, futures, ticker, range, and volume context for fast decision support.', 'NYSE PRO', 'NYSE', AccessLevel::InviteOnlyIndicatorDiscord->value, 'v1.28', 'Explore Module', 'info-box'],
            ['Info Line', 'Displays the same decision-support context as Info Box in a condensed horizontal format for users who prefer a streamlined HUD.', 'NYSE PRO', 'NYSE', AccessLevel::InviteOnlyIndicatorDiscord->value, 'v1.28', 'Explore Module', 'info-box'],
            ['Crypto Info Box', 'Displays a crypto-specific HUD with market-cap, BTC futures, stablecoin dominance, ticker, range, and volume context.', 'CRYPTO PRO', 'Crypto', AccessLevel::InviteOnlyIndicatorDiscord->value, 'v1.49', 'Explore Module', 'crypto-info-box'],
            ['Crypto Info Line', 'Displays the same crypto-specific context as Crypto Info Box in a compressed horizontal format for streamlined chart viewing.', 'CRYPTO PRO', 'Crypto', AccessLevel::InviteOnlyIndicatorDiscord->value, 'v1.49', 'Explore Module', 'crypto-info-box'],
            ['Pulse', 'Measures participation quality and internal market flow to help confirm whether price movement is being supported by real engagement.', 'NYSE PRO; CRYPTO PRO', 'All', AccessLevel::InviteOnlyIndicatorDiscord->value, 'v1.32', 'Explore Module', 'pulse'],
            ['Tide', 'Tracks broader market current and directional flow to help determine whether participation is supportive, fading, or shifting.', 'NYSE PRO; CRYPTO PRO', 'All', AccessLevel::InviteOnlyIndicatorDiscord->value, 'v1.6', 'Explore Module', 'participation-network'],
            ['Range Rails', 'Maps expected range structure and buy/sell rails to help identify where price is stretched, reactive, or positioned for expansion.', 'NYSE PRO; CRYPTO PRO', 'All', AccessLevel::InviteOnlyIndicatorDiscord->value, 'v1.20', 'Explore Module', 'range-rails'],
            ['AAVWAP', 'Anchors price to a meaningful reference point to show whether price is holding above or below an important value area.', 'NYSE PRO; CRYPTO PRO', 'All', AccessLevel::InviteOnlyIndicatorDiscord->value, 'v1.143', 'Explore Module', 'avwap-doc'],
            ['Long WAP', 'Tracks longer-duration value positioning to help identify broader support, resistance, and higher-timeframe control.', 'NYSE BASE; NYSE CORE; CRYPTO CORE', 'All', AccessLevel::InviteOnlyIndicatorDiscord->value, 'v1.0', 'Explore Module', 'long-vwap-wave'],
            ['Candle Color', 'Simplifies candle-state interpretation by visually classifying bar behavior based on the module’s directional logic.', 'NYSE PRO; CRYPTO PRO', 'All', AccessLevel::InviteOnlyIndicatorDiscord->value, 'v1.11', 'Explore Module', 'candle-color'],
        ];

        foreach ($moduleRows as $index => [$title, $description, $traderTypeList, $marketName, $access, $version, $actionLabel, $icon]) {
            $module = Module::create([
                'market_id' => $markets[$marketName]->id,
                'icon' => $icon,
                'title' => $title,
                'slug' => Str::slug($title),
                'description' => $description,
                'version' => ltrim($version, 'v'),
                'access' => $access,
                'action_label' => $actionLabel,
                'sort_order' => ($index + 1) * 10,
                'is_featured' => $index < 3,
                'is_active' => true,
                'published_at' => now(),
            ]);

            $module->traderTypes()->sync($this->traderTypeIds($traderTypes, $traderTypeList));
        }

        $playbookRows = [
            ['NYSE Market Environment Daily Newsletter', 'Traders who want market context, sentiment, and volatility guidance before execution.', 'NYSE BASE', 'NYSE', 'Swing Trading', '~90 days', AccessLevel::DailyNewsletterDiscord->value, '$70/mo', 'Explore Playbook', 'market-data-bars'],
            ['Crypto Market Environment Daily Newsletter', 'Crypto traders who want sentiment and volatility context before taking positions.', 'CRYPTO BASE', 'Crypto', 'Swing Trading', '~60 days', AccessLevel::DailyNewsletterDiscord->value, '$70/mo', 'Explore Playbook', 'crypto-info-box'],
            ['Sigma Pro Engine (insert logo)', 'Crypto traders who want optimized trend-flip alerts through a partner community access model.', 'CRYPTO BASE', 'Crypto', 'System Alerts', '—', AccessLevel::PartnerCommunityAccess->value, 'External / Token-Gated', 'View Deployment', 'command-cube'],
            ['NYSE ETF Environment Daily Newsletter', 'Investors targeting multi-week sector rotation opportunities.', 'NYSE CORE', 'NYSE', 'Swing Trading', '~90 days', AccessLevel::DailyNewsletterDiscord->value, '$125/mo', 'Explore Playbook', 'sector-rotation'],
            ['XRP Turtle Playbook', 'Patient XRP traders looking for slower-developing momentum swings.', 'CRYPTO CORE', 'Crypto', 'Swing Trading', '~16 days', AccessLevel::AlertsGuidedDiscord->value, '$90/mo', 'Explore Playbook', 'turtle'],
            ['SPY Scalp Playbook', 'Active traders focused on structured intraday momentum and higher-frequency execution.', 'NYSE PRO', 'NYSE', 'Day Trading', '~4 minutes', AccessLevel::AlertsGuidedDiscord->value, '$180/mo', 'Explore Playbook', 'spy-playbook'],
            ['BTC Bunny Playbook', 'Short-term BTC traders seeking structured intraday momentum setups.', 'CRYPTO PRO', 'Crypto', 'Day Trading', '~10 hours', AccessLevel::AlertsGuidedDiscord->value, '$180/mo', 'Explore Playbook', 'bunny'],
            ['SOL Bunny Playbook', 'Short-term SOL traders seeking structured intraday momentum setups.', 'CRYPTO PRO', 'Crypto', 'Day Trading', '~9 hours', AccessLevel::AlertsGuidedDiscord->value, 'Coming Soon', 'Explore Playbook', 'bunny'],
            ['XRP Bunny Playbook', 'Short-term XRP traders seeking structured intraday momentum setups.', 'CRYPTO PRO', 'Crypto', 'Day Trading', '~16 hours', AccessLevel::AlertsGuidedDiscord->value, '$180/mo', 'Explore Playbook', 'bunny'],
        ];

        foreach ($playbookRows as $index => [$title, $bestFor, $traderTypeList, $marketName, $tradingPace, $averageHold, $access, $price, $actionLabel, $icon]) {
            $playbook = Playbook::create([
                'market_id' => $markets[$marketName]->id,
                'icon' => $icon,
                'title' => $title,
                'slug' => Str::slug($title),
                'access' => $access,
                'best_for' => $bestFor,
                'trading_pace' => $tradingPace,
                'average_hold_time' => $averageHold,
                'price' => $price,
                'action_label' => $actionLabel,
                'sort_order' => ($index + 1) * 10,
                'is_featured' => in_array($title, ['XRP Turtle Playbook', 'BTC Bunny Playbook'], true),
                'is_active' => true,
                'published_at' => now(),
            ]);

            $playbook->traderTypes()->sync($this->traderTypeIds($traderTypes, $traderTypeList));
        }
    }

    /**
     * @param  Collection<string, TraderType>  $traderTypes
     * @return list<int>
     */
    private function traderTypeIds($traderTypes, string $traderTypeList): array
    {
        return collect(explode(';', $traderTypeList))
            ->map(fn (string $name): string => trim($name))
            ->filter()
            ->map(fn (string $name): int => $traderTypes[$name]->id)
            ->values()
            ->all();
    }
}
