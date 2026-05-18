<?php

namespace Database\Seeders;

use App\Models\Module;
use App\Models\Playbook;
use App\Models\PlaybookCategory;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

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

        $categories = collect([
            [
                'name' => 'Market Data',
                'slug' => 'market-data',
                'description' => 'Price, volume, breadth, and volatility inputs.',
                'icon' => 'market-data-bars',
                'color' => 'main-blue',
                'sort_order' => 10,
            ],
            [
                'name' => 'Direction',
                'slug' => 'direction',
                'description' => 'Bias, cycle, pressure, and trend direction tools.',
                'icon' => 'direction-target',
                'color' => 'violet-light',
                'sort_order' => 20,
            ],
            [
                'name' => 'Participation',
                'slug' => 'participation',
                'description' => 'Breadth, pulse, and crowd participation signals.',
                'icon' => 'participation-network',
                'color' => 'seafoam-green',
                'sort_order' => 30,
            ],
            [
                'name' => 'Volatility & Structure',
                'slug' => 'volatility-structure',
                'description' => 'Targets, anchored levels, trend alignment, and confirmation.',
                'icon' => 'volatility-pulse',
                'color' => 'gold',
                'sort_order' => 40,
            ],
            [
                'name' => 'Playbooks',
                'slug' => 'playbooks',
                'description' => 'Deployable trading frameworks connected to the module system.',
                'icon' => 'playbooks-book-open',
                'color' => 'seafoam-green',
                'sort_order' => 50,
            ],
            [
                'name' => 'Joint Community Deployments',
                'slug' => 'joint-community-deployments',
                'description' => 'Partner and licensed access deployments.',
                'icon' => 'participation-network',
                'color' => 'gold',
                'sort_order' => 60,
            ],
        ])->mapWithKeys(fn (array $category) => [
            $category['slug'] => PlaybookCategory::updateOrCreate(
                ['slug' => $category['slug']],
                [...$category, 'is_active' => true],
            ),
        ]);

        $modules = [
            ['market-data', 'momentum-cycles', 'Momentum Cycles', 'Identify momentum phase and trend strength.', 'Measures trend direction, strength, and trending vs. mean-reverting conditions.', 'Momentum Phase', 'v4.2', 'core', 10],
            ['market-data', 'volatility-regime', 'Volatility Regime', 'Detect volatility state and regime transitions.', 'Identifies compression, expansion, and volatility regime shifts.', 'Volatility State', 'v3.1', 'core', 20],
            ['market-data', 'structure-mapping', 'Structure Mapping', 'Map key levels and market structure.', 'Detects support, resistance, breaks, and retests.', 'Structure Levels', 'v5.0', 'core', 30],
            ['participation', 'participation-metrics', 'Participation Metrics', 'Measure market participation and breadth.', 'Evaluates volume, breadth, and market participation quality.', 'Participation Score', 'v2.3', 'core', 40],
            ['direction', 'sentiment-scanner', 'Sentiment Scanner', 'Track market sentiment and crowd behavior.', 'Aggregates sentiment data to gauge optimism or fear.', 'Sentiment Score', 'v3.0', 'core', 50],
            ['direction', 'liquidity-scanner', 'Liquidity Scanner', 'Find liquidity pools and high-probability trade targets.', 'Maps high-interest liquidity zones and tactical target areas.', 'Liquidity Map', 'v2.8', 'core', 60],
            ['direction', 'execution-optimizer', 'Execution Optimizer', 'Refine entries, exits, and trade management.', 'Transforms framework context into cleaner execution decisions.', 'Execution Plan', 'v2.1', 'pro', 70],
            ['direction', 'backtest-validator', 'Backtest Validator', 'Validate strategies with historical data and performance metrics.', 'Checks signal history, win rate, expectancy, and drawdown behavior.', 'Performance Report', 'v2.0', 'pro', 80],
            ['participation', 'pulse', 'Pulse', 'Read real-time participation momentum.', 'Measures real-time participation momentum and confirmation.', 'Pulse State', 'v2.6', 'core', 90],
            ['participation', 'breadth-cue', 'Breadth Cue', 'Confirm signal quality with market breadth.', 'Measures market breadth and participation confirmation.', 'Breadth Signal', 'v2.3', 'core', 100],
            ['participation', 'info-box-info-line', 'Info Box / Info Line', 'Surface contextual insights and participation signals.', 'Displays concise contextual signal summaries.', 'Context Feed', 'v1.8', 'core', 110],
            ['volatility-structure', 'goal-posts', 'Goal Posts', 'Define dynamic target levels based on structure and volatility.', 'Projects decision zones from market structure and volatility.', 'Target Zones', 'v3.4', 'core', 120],
            ['volatility-structure', 'avwap', 'AVWAP', 'Anchor volume-weighted average price for precision.', 'Maps anchored volume-weighted average price for precision.', 'Anchored VWAP', 'v4.1', 'core', 130],
            ['volatility-structure', 'long-vwap', 'Long VWAP', 'Track higher-timeframe VWAP for trend alignment.', 'Highlights longer horizon VWAP alignment for trend context.', 'Trend Alignment', 'v3.9', 'core', 140],
            ['volatility-structure', 'candle-color', 'Candle Color', 'Confirm candle state and strength visually.', 'Transforms candle state into fast visual confirmation.', 'Candle State', 'v1.7', 'core', 150],
            ['market-data', 'data-pipeline', 'Data Pipeline', 'Ingest, clean, and normalize data.', 'Handles real-time and historical data processing.', 'Clean Data Feed', 'v1.8', 'pro', 160],
            ['market-data', 'composite-engine', 'Composite Engine', 'Combine multiple modules into one unified market view.', 'Aggregates module outputs into a structured command feed.', 'Composite Score', 'v1.5', 'pro', 170],
        ];

        foreach ($modules as [$categorySlug, $slug, $title, $purpose, $whatItDoes, $keyOutput, $version, $access, $sortOrder]) {
            Module::updateOrCreate(
                ['slug' => $slug],
                [
                    'playbook_category_id' => $categories[$categorySlug]->id,
                    'icon' => $slug,
                    'title' => $title,
                    'purpose' => $purpose,
                    'description' => $purpose,
                    'what_it_does' => $whatItDoes,
                    'key_output' => $keyOutput,
                    'version' => $version,
                    'access' => $access,
                    'sort_order' => $sortOrder,
                    'is_featured' => $sortOrder <= 30,
                    'is_active' => true,
                    'published_at' => now(),
                ],
            );
        }

        $playbooks = [
            ['playbooks', 'market-environment', 'Market Environment', 'base_access', 'Broad Market', 'Traders who want market context, sentiment, and volatility guidance before execution.', null, 7000, null, 10],
            ['playbooks', 'crypto-environment', 'Crypto Environment', 'base_access', 'Crypto', 'Crypto traders who want sentiment and volatility context before taking positions.', null, 7000, null, 20],
            ['playbooks', 'nyse-sector-rotation-playbook', 'NYSE Sector Rotation Playbook', 'core_access', 'Equities / Sectors', 'Investors targeting multi-week sector rotation opportunities.', '~60 days', 10000, 'https://example.com/payments/nyse-sector-rotation', 30],
            ['playbooks', 'xrp-turtle-playbook', 'XRP Turtle Playbook', 'core_access', 'XRP', 'Patient XRP traders looking for slower-developing momentum swings.', '~16 days', 9000, 'https://example.com/payments/xrp-turtle', 40],
            ['playbooks', 'btc-bunny-playbook', 'BTC Bunny Playbook', 'pro_access', 'BTC', 'Short-term BTC traders seeking structured intraday momentum setups.', '~10 hours', 14000, 'https://example.com/payments/btc-bunny', 50],
            ['playbooks', 'sol-bunny-playbook', 'SOL Bunny Playbook', 'pro_access', 'SOL', 'Short-term SOL traders seeking structured intraday momentum setups.', '~9 hours', null, null, 60],
            ['playbooks', 'xrp-bunny-playbook', 'XRP Bunny Playbook', 'pro_access', 'XRP', 'Short-term XRP traders seeking structured intraday momentum setups.', '~16 hours', 18000, 'https://example.com/payments/xrp-bunny', 70],
            ['joint-community-deployments', 'sigma-pro-engine', 'Sigma Pro Engine', 'licensed_sigma', 'Crypto', 'Crypto traders who want optimized trend-flip alerts through a partner community.', null, null, 'https://example.com/payments/sigma', 80],
        ];

        foreach ($playbooks as [$categorySlug, $slug, $framework, $access, $market, $bestFor, $averageHoldTime, $priceCents, $paymentUrl, $sortOrder]) {
            Playbook::updateOrCreate(
                ['slug' => $slug],
                [
                    'playbook_category_id' => $categories[$categorySlug]->id,
                    'framework' => $framework,
                    'access' => $access,
                    'market' => $market,
                    'best_for' => $bestFor,
                    'average_hold_time' => $averageHoldTime,
                    'price_cents' => $priceCents,
                    'currency' => 'USD',
                    'payment_url' => $paymentUrl,
                    'sort_order' => $sortOrder,
                    'is_featured' => in_array($slug, ['xrp-turtle-playbook', 'btc-bunny-playbook'], true),
                    'is_active' => true,
                    'published_at' => now(),
                ],
            );
        }
    }
}
