<?php

namespace Database\Seeders;

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

        $catalog = require database_path('seeders/data/ticker_tactix_catalog.php');
        $moduleRows = $catalog['modules'];

        $seededModules = collect();

        foreach ($moduleRows as $index => $row) {
            $isActive = $row['is_active'];

            $module = Module::create([
                'market_id' => $markets[$row['market']]->id,
                'icon' => $row['icon'],
                'title' => $row['title'],
                'slug' => Str::slug($row['title']),
                'description' => $row['description'],
                ...$this->moduleDetails($row),
                'version' => $this->normalizeVersion($row['version']),
                'access' => $row['access'],
                'action_url' => $row['action_url'],
                'sort_order' => ($index + 1) * 10,
                'is_featured' => $index < 3,
                'is_active' => $isActive,
                'published_at' => $isActive ? now() : null,
            ]);

            $module->traderTypes()->sync($this->traderTypeIds($traderTypes, $row['trader_types']));
            $seededModules[$row['title']] = $module;
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

        $playbookRows = $catalog['playbooks'];

        foreach ($playbookRows as $index => $row) {
            $isActive = $row['is_active'];

            $playbook = Playbook::create([
                'market_id' => $markets[$row['market']]->id,
                'icon' => $row['icon'],
                'title' => $row['title'],
                'slug' => Str::slug($row['title']),
                'access' => $row['access'],
                'best_for' => $row['best_for'],
                'trading_pace' => $row['trading_pace'],
                'average_hold_time' => $row['average_hold_time'],
                'price' => $row['price'],
                'action_url' => $row['action_url'],
                'sort_order' => ($index + 1) * 10,
                'is_featured' => in_array($row['title'], ['XRP Turtle Playbook', 'BTC Bunny Playbook'], true),
                'is_active' => $isActive,
                'published_at' => $isActive ? now() : null,
            ]);

            $playbook->traderTypes()->sync($this->traderTypeIds($traderTypes, $row['trader_types']));
        }
    }

    /**
     * @param  Collection<string, TraderType>  $traderTypes
     * @return list<int>
     */
    private function traderTypeIds($traderTypes, string $traderTypeList): array
    {
        return collect(preg_split('/[;,]/', $traderTypeList) ?: [])
            ->map(fn (string $name): string => trim($name))
            ->filter()
            ->map(fn (string $name): int => $traderTypes[$name]->id)
            ->values()
            ->all();
    }

    private function normalizeVersion(?string $version): ?string
    {
        if (! $version) {
            return null;
        }

        return ltrim($version, 'vV');
    }

    /**
     * @return array{
     *     purpose: string,
     *     layer: string,
     *     key_output: string,
     *     trading_pace: string,
     *     short_name: string,
     *     price: string|null,
     *     module_overview: string,
     *     core_features: list<array{label: string, description: string, icon: string, tone: string}>,
     *     customization_options: list<string>,
     *     best_used_for: list<string>,
     *     summary: string,
     *     meta_title: string|null,
     *     meta_description: string
     * }
     */
    private function moduleDetails(array $row): array
    {
        $title = $row['title'];
        $description = $row['description'];
        $shortName = $row['short_name'] ?: $this->shortModuleName($title);

        return [
            'purpose' => $row['purpose'] ?: $this->modulePurpose($title),
            'layer' => $row['layer'] ?: 'Classification Layer',
            'key_output' => $row['key_output'] ?: $this->moduleKeyOutput($title),
            'trading_pace' => $row['trading_pace'] ?: 'ALL',
            'short_name' => $shortName,
            'price' => $this->monthlyPrice($row['price']),
            'module_overview' => $row['long_description'] ?: "Ticker-Tactix {$title} ({$shortName}) translates live market behavior into a structured visual layer that helps traders quickly understand context, pressure, and directional quality without losing focus on price action.",
            'core_features' => $this->moduleCoreFeatures($row['core_features'], $title),
            'customization_options' => $this->textList($row['customization_options']) ?: [
                'Toggle visibility of supporting lines, markers, and background states.',
                'Works across supported symbols and timeframes.',
            ],
            'best_used_for' => $this->textList($row['best_used_for']) ?: [
                'Confirming when market conditions support the current trade idea.',
                'Reducing noisy decision-making with a consistent visual framework.',
                'Adding multi-timeframe context before execution.',
            ],
            'summary' => $row['summary'] ?: "Ticker-Tactix {$title} gives traders a focused way to read market structure, turning scattered price behavior into an organized module view for cleaner decision support.",
            'meta_title' => $row['long_name'],
            'meta_description' => $row['short_description'] ?: $description,
        ];
    }

    private function monthlyPrice(?string $price): ?string
    {
        if (! $price) {
            return null;
        }

        if (str_starts_with($price, '$') || ! is_numeric($price)) {
            return $price;
        }

        return '$'.rtrim(rtrim(number_format((float) $price, 2, '.', ''), '0'), '.').'/mo';
    }

    /**
     * @return list<array{label: string, description: string, icon: string, tone: string}>
     */
    private function moduleCoreFeatures(?string $text, string $title): array
    {
        $items = $this->textList($text);

        if ($items === []) {
            return [
                ['label' => 'Signal Layer', 'description' => 'Highlights the module’s primary read so the current state is easy to identify at a glance.', 'icon' => 'trend-tracer', 'tone' => 'blue'],
                ['label' => 'Context Filter', 'description' => 'Adds structure around raw movement so stronger and weaker conditions are easier to separate.', 'icon' => 'direction-target', 'tone' => 'violet'],
                ['label' => 'Visual State', 'description' => 'Uses color and compact HUD cues to make shifts in behavior immediately readable.', 'icon' => 'pulse', 'tone' => 'green'],
                ['label' => 'Adaptive Background', 'description' => 'Optional shading reacts to the dominant state for faster trend and risk recognition.', 'icon' => 'market-data-bars', 'tone' => 'gold'],
            ];
        }

        return collect($items)
            ->map(function (string $item, int $index) use ($title): array {
                [$label, $description] = $this->splitFeature($item);

                return [
                    'label' => $label,
                    'description' => $description,
                    'icon' => $this->featureIcon($title, $index),
                    'tone' => ['blue', 'violet', 'green', 'gold'][$index % 4],
                ];
            })
            ->values()
            ->all();
    }

    /**
     * @return list<string>
     */
    private function textList(?string $text): array
    {
        if (! $text) {
            return [];
        }

        $items = [];
        $current = null;

        foreach (preg_split('/\R/', trim($text)) ?: [] as $line) {
            $line = trim($line);

            if ($line === '') {
                continue;
            }

            $isBullet = preg_match('/^[•\-]\s*/u', $line) === 1;
            $line = preg_replace('/^[•\-]\s*/u', '', $line) ?: $line;

            if ($isBullet || $current === null) {
                if ($current !== null) {
                    $items[] = $current;
                }

                $current = $line;

                continue;
            }

            $current .= ' '.$line;
        }

        if ($current !== null) {
            $items[] = $current;
        }

        return $items;
    }

    /**
     * @return array{string, string}
     */
    private function splitFeature(string $item): array
    {
        $parts = preg_split('/\s+[–-]\s+/u', $item, 2);

        if (count($parts) === 2) {
            return [trim($parts[0]), trim($parts[1])];
        }

        return [Str::limit($item, 34, ''), $item];
    }

    private function featureIcon(string $title, int $index): string
    {
        return match ($title) {
            'Momentum Cycles' => ['trend-tracer', 'momentum-cycles', 'market-data-bars', 'data-pipeline'][$index % 4],
            'Sequence Pressure' => ['sequence-pressure', 'direction-target', 'goal-posts', 'market-data-bars'][$index % 4],
            'Trend Tracer' => ['trend-tracer', 'market-data-bars', 'pulse', 'avwap-doc'][$index % 4],
            'Range Rails' => ['range-rails', 'goal-posts', 'direction-target', 'market-data-bars'][$index % 4],
            default => ['trend-tracer', 'direction-target', 'pulse', 'market-data-bars'][$index % 4],
        };
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
