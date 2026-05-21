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
            ['Momentum Cycles', 'Measures directional momentum phase and trend strength, helping identify when conditions are aligned bullish or bearish.', 'NYSE BASE; NYSE CORE; NYSE PRO; CRYPTO CORE; CRYPTO PRO', 'All', AccessLevel::InviteOnlyIndicatorDiscord->value, 'v1.33', 'momentum-cycles'],
            ['Sequence Pressure', 'Tracks directional exhaustion and pressure buildup to help identify when a move may be weakening or becoming vulnerable to recoil.', 'NYSE BASE; NYSE CORE; NYSE PRO; CRYPTO CORE; CRYPTO PRO', 'All', AccessLevel::InviteOnlyIndicatorDiscord->value, 'v1.44', 'sequence-pressure'],
            ['Trend Tracer', 'Maps broader directional flow and trend posture to help determine whether market structure is supporting continuation or deterioration.', 'NYSE PRO', 'NYSE', AccessLevel::InviteOnlyIndicatorDiscord->value, 'v1.2', 'trend-tracer'],
            ['Crypto Velocity Stats', 'Measures short-term crypto momentum statistics and directional acceleration across the selected asset and timeframe.', 'CRYPTO PRO', 'Crypto', AccessLevel::InviteOnlyIndicatorDiscord->value, 'v1.5', 'volatility-pulse'],
            ['Info Box', 'Displays a compact market HUD with key breadth, futures, ticker, range, and volume context for fast decision support.', 'NYSE PRO', 'NYSE', AccessLevel::InviteOnlyIndicatorDiscord->value, 'v1.28', 'info-box'],
            ['Info Line', 'Displays the same decision-support context as Info Box in a condensed horizontal format for users who prefer a streamlined HUD.', 'NYSE PRO', 'NYSE', AccessLevel::InviteOnlyIndicatorDiscord->value, 'v1.28', 'info-box'],
            ['Crypto Info Box', 'Displays a crypto-specific HUD with market-cap, BTC futures, stablecoin dominance, ticker, range, and volume context.', 'CRYPTO PRO', 'Crypto', AccessLevel::InviteOnlyIndicatorDiscord->value, 'v1.49', 'crypto-info-box'],
            ['Crypto Info Line', 'Displays the same crypto-specific context as Crypto Info Box in a compressed horizontal format for streamlined chart viewing.', 'CRYPTO PRO', 'Crypto', AccessLevel::InviteOnlyIndicatorDiscord->value, 'v1.49', 'crypto-info-box'],
            ['Pulse', 'Measures participation quality and internal market flow to help confirm whether price movement is being supported by real engagement.', 'NYSE PRO; CRYPTO PRO', 'All', AccessLevel::InviteOnlyIndicatorDiscord->value, 'v1.32', 'pulse'],
            ['Tide', 'Tracks broader market current and directional flow to help determine whether participation is supportive, fading, or shifting.', 'NYSE PRO; CRYPTO PRO', 'All', AccessLevel::InviteOnlyIndicatorDiscord->value, 'v1.6', 'participation-network'],
            ['Range Rails', 'Maps expected range structure and buy/sell rails to help identify where price is stretched, reactive, or positioned for expansion.', 'NYSE PRO; CRYPTO PRO', 'All', AccessLevel::InviteOnlyIndicatorDiscord->value, 'v1.20', 'range-rails'],
            ['AAVWAP', 'Anchors price to a meaningful reference point to show whether price is holding above or below an important value area.', 'NYSE PRO; CRYPTO PRO', 'All', AccessLevel::InviteOnlyIndicatorDiscord->value, 'v1.143', 'avwap-doc'],
            ['Long WAP', 'Tracks longer-duration value positioning to help identify broader support, resistance, and higher-timeframe control.', 'NYSE BASE; NYSE CORE; CRYPTO CORE', 'All', AccessLevel::InviteOnlyIndicatorDiscord->value, 'v1.0', 'long-vwap-wave'],
            ['Candle Color', 'Simplifies candle-state interpretation by visually classifying bar behavior based on the module’s directional logic.', 'NYSE PRO; CRYPTO PRO', 'All', AccessLevel::InviteOnlyIndicatorDiscord->value, 'v1.11', 'candle-color'],
        ];

        $seededModules = collect();

        foreach ($moduleRows as $index => [$title, $description, $traderTypeList, $marketName, $access, $version, $icon]) {
            $module = Module::create([
                'market_id' => $markets[$marketName]->id,
                'icon' => $icon,
                'title' => $title,
                'slug' => Str::slug($title),
                'description' => $description,
                ...$this->moduleDetails($title, $description),
                'version' => ltrim($version, 'v'),
                'access' => $access,
                'action_url' => null,
                'sort_order' => ($index + 1) * 10,
                'is_featured' => $index < 3,
                'is_active' => true,
                'published_at' => now(),
            ]);

            $module->traderTypes()->sync($this->traderTypeIds($traderTypes, $traderTypeList));
            $seededModules[$title] = $module;
        }

        $relatedModuleMap = [
            'Momentum Cycles' => ['Sequence Pressure', 'Long WAP', 'Trend Tracer', 'Pulse'],
            'Sequence Pressure' => ['Momentum Cycles', 'Trend Tracer', 'Range Rails', 'Candle Color'],
            'Trend Tracer' => ['Momentum Cycles', 'Sequence Pressure', 'Tide', 'AAVWAP'],
            'Crypto Velocity Stats' => ['Crypto Info Box', 'Crypto Info Line', 'Pulse', 'Range Rails'],
            'Pulse' => ['Momentum Cycles', 'Tide', 'Range Rails', 'Candle Color'],
            'Range Rails' => ['Pulse', 'AAVWAP', 'Long WAP', 'Candle Color'],
        ];

        foreach ($relatedModuleMap as $moduleTitle => $relatedTitles) {
            if (! isset($seededModules[$moduleTitle])) {
                continue;
            }

            $seededModules[$moduleTitle]->relatedModules()->sync(
                collect($relatedTitles)
                    ->filter(fn (string $title): bool => isset($seededModules[$title]))
                    ->map(fn (string $title): int => $seededModules[$title]->id)
                    ->values()
                    ->all(),
            );
        }

        $playbookRows = [
            ['NYSE Market Environment Daily Newsletter', 'Traders who want market context, sentiment, and volatility guidance before execution.', 'NYSE BASE', 'NYSE', 'Swing Trading', '~90 days', AccessLevel::DailyNewsletterDiscord->value, '$70/mo', 'market-data-bars'],
            ['Crypto Market Environment Daily Newsletter', 'Crypto traders who want sentiment and volatility context before taking positions.', 'CRYPTO BASE', 'Crypto', 'Swing Trading', '~60 days', AccessLevel::DailyNewsletterDiscord->value, '$70/mo', 'crypto-info-box'],
            ['Sigma Pro Engine (insert logo)', 'Crypto traders who want optimized trend-flip alerts through a partner community access model.', 'CRYPTO BASE', 'Crypto', 'System Alerts', '—', AccessLevel::PartnerCommunityAccess->value, 'External / Token-Gated', 'command-cube'],
            ['NYSE ETF Environment Daily Newsletter', 'Investors targeting multi-week sector rotation opportunities.', 'NYSE CORE', 'NYSE', 'Swing Trading', '~90 days', AccessLevel::DailyNewsletterDiscord->value, '$125/mo', 'sector-rotation'],
            ['XRP Turtle Playbook', 'Patient XRP traders looking for slower-developing momentum swings.', 'CRYPTO CORE', 'Crypto', 'Swing Trading', '~16 days', AccessLevel::AlertsGuidedDiscord->value, '$90/mo', 'turtle'],
            ['SPY Scalp Playbook', 'Active traders focused on structured intraday momentum and higher-frequency execution.', 'NYSE PRO', 'NYSE', 'Day Trading', '~4 minutes', AccessLevel::AlertsGuidedDiscord->value, '$180/mo', 'spy-playbook'],
            ['BTC Bunny Playbook', 'Short-term BTC traders seeking structured intraday momentum setups.', 'CRYPTO PRO', 'Crypto', 'Day Trading', '~10 hours', AccessLevel::AlertsGuidedDiscord->value, '$180/mo', 'bunny'],
            ['SOL Bunny Playbook', 'Short-term SOL traders seeking structured intraday momentum setups.', 'CRYPTO PRO', 'Crypto', 'Day Trading', '~9 hours', AccessLevel::AlertsGuidedDiscord->value, 'Coming Soon', 'bunny'],
            ['XRP Bunny Playbook', 'Short-term XRP traders seeking structured intraday momentum setups.', 'CRYPTO PRO', 'Crypto', 'Day Trading', '~16 hours', AccessLevel::AlertsGuidedDiscord->value, '$180/mo', 'bunny'],
        ];

        foreach ($playbookRows as $index => [$title, $bestFor, $traderTypeList, $marketName, $tradingPace, $averageHold, $access, $price, $icon]) {
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
                'action_url' => null,
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

    /**
     * @return array{
     *     purpose: string,
     *     layer: string,
     *     key_output: string,
     *     trading_pace: string,
     *     short_name: string,
     *     price: string,
     *     module_overview: string,
     *     core_features: list<array{label: string, description: string, icon: string, tone: string}>,
     *     customization_options: list<string>,
     *     best_used_for: list<string>,
     *     summary: string
     * }
     */
    private function moduleDetails(string $title, string $description): array
    {
        $shortName = $this->shortModuleName($title);

        $defaults = [
            'purpose' => $this->modulePurpose($title),
            'layer' => 'Classification Layer',
            'key_output' => $this->moduleKeyOutput($title),
            'trading_pace' => 'ALL',
            'short_name' => $shortName,
            'price' => '$50/mo',
            'module_overview' => "Ticker-Tactix {$title} ({$shortName}) translates live market behavior into a structured visual layer that helps traders quickly understand context, pressure, and directional quality without losing focus on price action.",
            'core_features' => [
                ['label' => 'Signal Layer', 'description' => 'Highlights the module’s primary read so the current state is easy to identify at a glance.', 'icon' => 'trend-tracer', 'tone' => 'blue'],
                ['label' => 'Context Filter', 'description' => 'Adds structure around raw movement so stronger and weaker conditions are easier to separate.', 'icon' => 'direction-target', 'tone' => 'violet'],
                ['label' => 'Visual State', 'description' => 'Uses color and compact HUD cues to make shifts in behavior immediately readable.', 'icon' => 'pulse', 'tone' => 'green'],
                ['label' => 'Adaptive Background', 'description' => 'Optional shading reacts to the dominant state for faster trend and risk recognition.', 'icon' => 'market-data-bars', 'tone' => 'gold'],
            ],
            'customization_options' => [
                'Toggle visibility of supporting lines, markers, and background states.',
                'Works across supported symbols and timeframes.',
            ],
            'best_used_for' => [
                'Confirming when market conditions support the current trade idea.',
                'Reducing noisy decision-making with a consistent visual framework.',
                'Adding multi-timeframe context before execution.',
            ],
            'summary' => "Ticker-Tactix {$title} gives traders a focused way to read market structure, turning scattered price behavior into an organized module view for cleaner decision support.",
        ];

        if ($title !== 'Momentum Cycles') {
            return $defaults;
        }

        return [
            ...$defaults,
            'purpose' => 'Direction',
            'key_output' => 'Momentum Phase',
            'module_overview' => 'Ticker-Tactix Momentum Cycles (T-T:MC) translates raw market motion into an elegant visual language of acceleration, deceleration, and reversal. By blending short and medium-term velocity measurements, it forms a momentum map that highlights the balance between force and direction inside every trend. Each cycle is rendered through adaptive color transitions, cross markers, and optional background shifts that make changes in market energy unmistakable at a glance.',
            'core_features' => [
                ['label' => 'Signal Line', 'description' => 'The heart of the indicator, capturing real-time changes in price strength and directional bias.', 'icon' => 'trend-tracer', 'tone' => 'blue'],
                ['label' => 'Momentum Line', 'description' => 'A smoothed trail of recent momentum, providing structure and flow to the cycles.', 'icon' => 'momentum-cycles', 'tone' => 'violet'],
                ['label' => 'Histogram Display', 'description' => 'Visualizes bullish and bearish phases, color-coded to distinguish rising and fading energy in both bullish and bearish zones.', 'icon' => 'market-data-bars', 'tone' => 'green'],
                ['label' => 'Dynamic Background', 'description' => 'Optional shading reacts instantly to the prevailing momentum phase for immediate trend context.', 'icon' => 'data-pipeline', 'tone' => 'gold'],
            ],
            'customization_options' => [
                'Toggle visibility of lines, histogram, dots, and background for a clean or detailed look.',
                'Works across all symbols and timeframes.',
            ],
            'best_used_for' => [
                'Identifying early momentum shifts before trend confirmation.',
                'Visualizing cycle transitions to refine entry and exit timing.',
                'Enhancing multi-timeframe confluence and directional confidence.',
            ],
            'summary' => 'Ticker-Tactix Momentum Cycles gives traders a visual framework to sense the rhythm of price action, transforming market noise into a readable cycle of strength and release.',
        ];
    }

    private function shortModuleName(string $title): string
    {
        return match ($title) {
            'Momentum Cycles' => 'T-T:MC',
            'Sequence Pressure' => 'T-T:SP',
            'Trend Tracer' => 'T-T:TT',
            'Crypto Velocity Stats' => 'T-T:CVS',
            'Info Box' => 'T-T:IB',
            'Info Line' => 'T-T:IL',
            'Crypto Info Box' => 'T-T:CIB',
            'Crypto Info Line' => 'T-T:CIL',
            'Pulse' => 'T-T:PULSE',
            'Tide' => 'T-T:TIDE',
            'Range Rails' => 'T-T:RR',
            'AAVWAP' => 'T-T:AAVWAP',
            'Long WAP' => 'T-T:LWAP',
            'Candle Color' => 'T-T:CC',
            default => 'T-T:'.Str::upper(Str::of($title)->replaceMatches('/[^A-Za-z0-9]+/', '')->substr(0, 4)),
        };
    }

    private function modulePurpose(string $title): string
    {
        return match ($title) {
            'Momentum Cycles', 'Trend Tracer', 'Candle Color' => 'Direction',
            'Sequence Pressure' => 'Pressure',
            'Crypto Velocity Stats' => 'Velocity',
            'Info Box', 'Info Line', 'Crypto Info Box', 'Crypto Info Line' => 'Context',
            'Pulse', 'Tide' => 'Participation',
            'Range Rails' => 'Range Structure',
            'AAVWAP', 'Long WAP' => 'Value Reference',
            default => 'Decision Support',
        };
    }

    private function moduleKeyOutput(string $title): string
    {
        return match ($title) {
            'Momentum Cycles' => 'Momentum Phase',
            'Sequence Pressure' => 'Pressure State',
            'Trend Tracer' => 'Trend Posture',
            'Crypto Velocity Stats' => 'Velocity State',
            'Info Box', 'Info Line' => 'Market HUD',
            'Crypto Info Box', 'Crypto Info Line' => 'Crypto HUD',
            'Pulse' => 'Participation Quality',
            'Tide' => 'Market Current',
            'Range Rails' => 'Range Rails',
            'AAVWAP' => 'Anchored Value',
            'Long WAP' => 'Long-Term Value',
            'Candle Color' => 'Candle State',
            default => 'Module Signal',
        };
    }
}
