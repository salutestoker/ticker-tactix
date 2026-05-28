<?php

namespace App\Services;

use App\Enums\AccessLevel;
use App\Models\Market;
use App\Models\Module;
use App\Models\Playbook;
use App\Models\TraderType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use RuntimeException;

class CatalogSpreadsheetSyncService
{
    private const TRADER_TYPES_FILE = 'trader_types.csv';

    private const MODULES_FILE = 'modules.csv';

    private const PLAYBOOKS_FILE = 'playbooks.csv';

    private const STATE_FILE = 'catalog-spreadsheet-sync.json';

    private const TRADER_TYPE_HEADERS = [
        'id',
        'name',
        'slug',
        'description',
        'color',
        'icon',
        'sort_order',
        'is_active',
    ];

    private const MODULE_HEADERS = [
        'id',
        'market_slug',
        'trader_type_slugs',
        'related_module_slugs',
        'icon',
        'title',
        'slug',
        'description',
        'purpose',
        'layer',
        'key_output',
        'trading_pace',
        'short_name',
        'price',
        'module_overview',
        'core_features',
        'customization_options',
        'best_used_for',
        'summary',
        'version',
        'access',
        'action_url',
        'sort_order',
        'is_featured',
        'is_active',
        'published_at',
        'meta_title',
        'meta_description',
    ];

    private const PLAYBOOK_HEADERS = [
        'id',
        'market_slug',
        'trader_type_slugs',
        'icon',
        'logo_path',
        'title',
        'slug',
        'access',
        'best_for',
        'trading_pace',
        'average_hold_time',
        'price',
        'action_url',
        'sort_order',
        'is_featured',
        'is_active',
        'published_at',
        'meta_title',
        'meta_description',
    ];

    /**
     * @return array{trader_types: int, modules: int, playbooks: int}
     */
    public function exportAll(): array
    {
        $counts = [
            'trader_types' => $this->exportTraderTypes(),
            'modules' => $this->exportModules(),
            'playbooks' => $this->exportPlaybooks(),
        ];

        $this->rememberCurrentHashes();

        return $counts;
    }

    /**
     * @return array{trader_types: int, modules: int, playbooks: int}
     */
    public function importAll(): array
    {
        $counts = DB::transaction(fn (): array => [
            'trader_types' => $this->importTraderTypes(),
            'modules' => $this->importModules(),
            'playbooks' => $this->importPlaybooks(),
        ]);

        $this->exportAll();

        return $counts;
    }

    /**
     * @return array{imported: bool, trader_types: int, modules: int, playbooks: int}
     */
    public function importChanged(): array
    {
        if (! $this->hasChangedSinceLastSync()) {
            return [
                'imported' => false,
                'trader_types' => 0,
                'modules' => 0,
                'playbooks' => 0,
            ];
        }

        $counts = $this->importAll();

        return [
            'imported' => true,
            ...$counts,
        ];
    }

    public function hasChangedSinceLastSync(): bool
    {
        return $this->currentHashes() !== $this->rememberedHashes();
    }

    private function exportTraderTypes(): int
    {
        $traderTypes = TraderType::ordered()->get();

        $this->writeCsv(self::TRADER_TYPES_FILE, self::TRADER_TYPE_HEADERS, $traderTypes->map(fn (TraderType $traderType): array => [
            'id' => $traderType->id,
            'name' => $traderType->name,
            'slug' => $traderType->slug,
            'description' => $traderType->description,
            'color' => $traderType->color,
            'icon' => $traderType->icon,
            'sort_order' => $traderType->sort_order,
            'is_active' => $this->formatBoolean($traderType->is_active),
        ])->all());

        return $traderTypes->count();
    }

    private function exportModules(): int
    {
        $modules = Module::with(['market', 'traderTypes', 'relatedModules'])->ordered()->get();

        $this->writeCsv(self::MODULES_FILE, self::MODULE_HEADERS, $modules->map(fn (Module $module): array => [
            'id' => $module->id,
            'market_slug' => $module->market?->slug,
            'trader_type_slugs' => $this->formatSlugs($module->traderTypes),
            'related_module_slugs' => $this->formatSlugs($module->relatedModules),
            'icon' => $module->icon,
            'title' => $module->title,
            'slug' => $module->slug,
            'description' => $module->description,
            'purpose' => $module->purpose,
            'layer' => $module->layer,
            'key_output' => $module->key_output,
            'trading_pace' => $module->trading_pace,
            'short_name' => $module->short_name,
            'price' => $module->price,
            'module_overview' => $module->module_overview,
            'core_features' => $this->formatCoreFeatures($module->core_features),
            'customization_options' => $this->formatLines($module->customization_options),
            'best_used_for' => $this->formatLines($module->best_used_for),
            'summary' => $module->summary,
            'version' => $module->version,
            'access' => $this->accessValue($module->access),
            'action_url' => $module->action_url,
            'sort_order' => $module->sort_order,
            'is_featured' => $this->formatBoolean($module->is_featured),
            'is_active' => $this->formatBoolean($module->is_active),
            'published_at' => $this->formatDate($module->published_at),
            'meta_title' => $module->meta_title,
            'meta_description' => $module->meta_description,
        ])->all());

        return $modules->count();
    }

    private function exportPlaybooks(): int
    {
        $playbooks = Playbook::with(['market', 'traderTypes'])->ordered()->get();

        $this->writeCsv(self::PLAYBOOKS_FILE, self::PLAYBOOK_HEADERS, $playbooks->map(fn (Playbook $playbook): array => [
            'id' => $playbook->id,
            'market_slug' => $playbook->market?->slug,
            'trader_type_slugs' => $this->formatSlugs($playbook->traderTypes),
            'icon' => $playbook->icon,
            'logo_path' => $playbook->logo_path,
            'title' => $playbook->title,
            'slug' => $playbook->slug,
            'access' => $this->accessValue($playbook->access),
            'best_for' => $playbook->best_for,
            'trading_pace' => $playbook->trading_pace,
            'average_hold_time' => $playbook->average_hold_time,
            'price' => $playbook->price,
            'action_url' => $playbook->action_url,
            'sort_order' => $playbook->sort_order,
            'is_featured' => $this->formatBoolean($playbook->is_featured),
            'is_active' => $this->formatBoolean($playbook->is_active),
            'published_at' => $this->formatDate($playbook->published_at),
            'meta_title' => $playbook->meta_title,
            'meta_description' => $playbook->meta_description,
        ])->all());

        return $playbooks->count();
    }

    private function importTraderTypes(): int
    {
        $rows = $this->readCsv(self::TRADER_TYPES_FILE, self::TRADER_TYPE_HEADERS);
        $saved = 0;

        foreach ($rows as $row) {
            $traderType = $this->findTraderType($row);

            $traderType->fill([
                'name' => $this->requiredString($row['name'], 'trader_types.name'),
                'slug' => $this->slug($row['slug'], $row['name']),
                'description' => $this->nullableString($row['description']),
                'color' => $this->nullableString($row['color']),
                'icon' => $this->nullableString($row['icon']),
                'sort_order' => $this->integer($row['sort_order']),
                'is_active' => $this->boolean($row['is_active']),
            ]);

            $traderType->save();
            $saved++;
        }

        return $saved;
    }

    private function importModules(): int
    {
        $rows = $this->readCsv(self::MODULES_FILE, self::MODULE_HEADERS);
        $saved = [];

        foreach ($rows as $row) {
            $module = $this->findModule($row);

            $module->fill([
                'market_id' => $this->marketId($row['market_slug']),
                'icon' => $this->nullableString($row['icon']),
                'title' => $this->requiredString($row['title'], 'modules.title'),
                'slug' => $this->slug($row['slug'], $row['title']),
                'description' => $this->nullableString($row['description']),
                'purpose' => $this->nullableString($row['purpose']),
                'layer' => $this->nullableString($row['layer']),
                'key_output' => $this->nullableString($row['key_output']),
                'trading_pace' => $this->nullableString($row['trading_pace']),
                'short_name' => $this->nullableString($row['short_name']),
                'price' => $this->nullableString($row['price']),
                'module_overview' => $this->nullableString($row['module_overview']),
                'core_features' => $this->parseCoreFeatures($row['core_features']),
                'customization_options' => $this->parseLines($row['customization_options']),
                'best_used_for' => $this->parseLines($row['best_used_for']),
                'summary' => $this->nullableString($row['summary']),
                'version' => $this->nullableFloat($row['version']),
                'access' => $this->validatedAccess($row['access']),
                'action_url' => $this->nullableString($row['action_url']),
                'sort_order' => $this->integer($row['sort_order']),
                'is_featured' => $this->boolean($row['is_featured']),
                'is_active' => $this->boolean($row['is_active']),
                'published_at' => $this->nullableDate($row['published_at']),
                'meta_title' => $this->nullableString($row['meta_title']),
                'meta_description' => $this->nullableString($row['meta_description']),
            ]);

            $module->save();
            $saved[] = [$module, $row];
        }

        foreach ($saved as [$module, $row]) {
            $module->traderTypes()->sync($this->traderTypeIds($row['trader_type_slugs']));
            $module->relatedModules()->sync(
                collect($this->moduleIds($row['related_module_slugs']))
                    ->reject(fn (int $id): bool => $id === $module->id)
                    ->values()
                    ->all(),
            );
        }

        return count($saved);
    }

    private function importPlaybooks(): int
    {
        $rows = $this->readCsv(self::PLAYBOOKS_FILE, self::PLAYBOOK_HEADERS);
        $saved = [];

        foreach ($rows as $row) {
            $playbook = $this->findPlaybook($row);

            $playbook->fill([
                'market_id' => $this->marketId($row['market_slug']),
                'icon' => $this->nullableString($row['icon']),
                'logo_path' => $this->nullableString($row['logo_path']),
                'title' => $this->requiredString($row['title'], 'playbooks.title'),
                'slug' => $this->slug($row['slug'], $row['title']),
                'access' => $this->validatedAccess($row['access']),
                'best_for' => $this->nullableString($row['best_for']),
                'trading_pace' => $this->nullableString($row['trading_pace']),
                'average_hold_time' => $this->nullableString($row['average_hold_time']),
                'price' => $this->nullableString($row['price']),
                'action_url' => $this->nullableString($row['action_url']),
                'sort_order' => $this->integer($row['sort_order']),
                'is_featured' => $this->boolean($row['is_featured']),
                'is_active' => $this->boolean($row['is_active']),
                'published_at' => $this->nullableDate($row['published_at']),
                'meta_title' => $this->nullableString($row['meta_title']),
                'meta_description' => $this->nullableString($row['meta_description']),
            ]);

            $playbook->save();
            $saved[] = [$playbook, $row];
        }

        foreach ($saved as [$playbook, $row]) {
            $playbook->traderTypes()->sync($this->traderTypeIds($row['trader_type_slugs']));
        }

        return count($saved);
    }

    /**
     * @param  array<int, array<string, mixed>>  $rows
     */
    private function writeCsv(string $filename, array $headers, array $rows): void
    {
        $this->ensureDirectory();

        $path = $this->path($filename);
        $handle = fopen($path, 'wb');

        if ($handle === false) {
            throw new RuntimeException("Unable to open {$filename} for writing.");
        }

        fputcsv($handle, $headers);

        foreach ($rows as $row) {
            fputcsv($handle, array_map(
                fn (string $header): string => $this->csvValue($row[$header] ?? null),
                $headers,
            ));
        }

        fclose($handle);
        @chmod($path, 0640);
    }

    /**
     * @return list<array<string, string>>
     */
    private function readCsv(string $filename, array $requiredHeaders): array
    {
        $path = $this->path($filename);

        if (! is_file($path)) {
            throw new RuntimeException("Missing spreadsheet file: {$path}");
        }

        $handle = fopen($path, 'rb');

        if ($handle === false) {
            throw new RuntimeException("Unable to open {$filename} for reading.");
        }

        $headers = fgetcsv($handle);

        if ($headers === false) {
            fclose($handle);

            return [];
        }

        $headers = array_map(fn (string $header): string => trim($header), $headers);
        $missingHeaders = array_diff($requiredHeaders, $headers);

        if ($missingHeaders !== []) {
            fclose($handle);

            throw new RuntimeException("Missing columns in {$filename}: ".implode(', ', $missingHeaders));
        }

        $rows = [];

        while (($values = fgetcsv($handle)) !== false) {
            if ($this->isBlankRow($values)) {
                continue;
            }

            $row = [];

            foreach ($headers as $index => $header) {
                $row[$header] = (string) ($values[$index] ?? '');
            }

            $rows[] = $row;
        }

        fclose($handle);

        return $rows;
    }

    /**
     * @param  iterable<int, Model>  $models
     */
    private function formatSlugs(iterable $models): string
    {
        return collect($models)
            ->sortBy('sort_order')
            ->pluck('slug')
            ->filter()
            ->implode('|');
    }

    private function formatCoreFeatures(mixed $features): string
    {
        if (! is_array($features)) {
            return '';
        }

        return collect($features)
            ->map(fn (array $feature): string => implode(' | ', [
                $feature['label'] ?? '',
                $feature['description'] ?? '',
                $feature['icon'] ?? '',
                $feature['tone'] ?? '',
            ]))
            ->implode("\n");
    }

    private function formatLines(mixed $lines): string
    {
        if (! is_array($lines)) {
            return '';
        }

        return collect($lines)->map(fn (mixed $line): string => (string) $line)->implode("\n");
    }

    private function formatBoolean(bool $value): string
    {
        return $value ? '1' : '0';
    }

    private function formatDate(mixed $value): string
    {
        return $value instanceof Carbon ? $value->format('Y-m-d H:i:s') : '';
    }

    private function accessValue(mixed $value): string
    {
        return $value instanceof AccessLevel ? $value->value : (string) $value;
    }

    private function findModule(array $row): Module
    {
        return $this->findByIdOrSlug(Module::class, $row, $this->slug($row['slug'], $row['title']));
    }

    private function findPlaybook(array $row): Playbook
    {
        return $this->findByIdOrSlug(Playbook::class, $row, $this->slug($row['slug'], $row['title']));
    }

    private function findTraderType(array $row): TraderType
    {
        return $this->findByIdOrSlug(TraderType::class, $row, $this->slug($row['slug'], $row['name']));
    }

    /**
     * @template TModel of Model
     *
     * @param  class-string<TModel>  $modelClass
     * @return TModel
     */
    private function findByIdOrSlug(string $modelClass, array $row, string $slug): Model
    {
        $id = $this->nullableInteger($row['id'] ?? '');
        $query = $modelClass::withTrashed();

        if ($id !== null) {
            $model = $query->find($id);

            if ($model instanceof $modelClass) {
                return tap($model, fn (Model $model): ?bool => $model->trashed() ? $model->restore() : null);
            }
        }

        $model = $query->where('slug', $slug)->first();

        if ($model instanceof $modelClass) {
            return tap($model, fn (Model $model): ?bool => $model->trashed() ? $model->restore() : null);
        }

        return new $modelClass;
    }

    private function marketId(string $slug): int
    {
        return Market::where('slug', $this->requiredString($slug, 'market_slug'))->value('id')
            ?? throw new RuntimeException("Unknown market slug: {$slug}");
    }

    /**
     * @return list<int>
     */
    private function traderTypeIds(string $value): array
    {
        return $this->idsForSlugs(TraderType::class, $value, 'trader type');
    }

    /**
     * @return list<int>
     */
    private function moduleIds(string $value): array
    {
        return $this->idsForSlugs(Module::class, $value, 'module');
    }

    /**
     * @param  class-string<Model>  $modelClass
     * @return list<int>
     */
    private function idsForSlugs(string $modelClass, string $value, string $label): array
    {
        return collect($this->splitValues($value))
            ->map(function (string $slug) use ($modelClass, $label): int {
                $id = $modelClass::where('slug', $slug)->value('id');

                if ($id === null) {
                    throw new RuntimeException("Unknown {$label} slug: {$slug}");
                }

                return (int) $id;
            })
            ->values()
            ->all();
    }

    /**
     * @return list<array{label: string, description: string, icon: string|null, tone: string|null}>
     */
    private function parseCoreFeatures(string $value): array
    {
        return collect(preg_split('/\r\n|\r|\n/', $value) ?: [])
            ->map(fn (string $line): string => trim($line))
            ->filter()
            ->map(function (string $line): array {
                $parts = array_map('trim', explode('|', $line));

                return [
                    'label' => $parts[0] ?? '',
                    'description' => $parts[1] ?? '',
                    'icon' => ($parts[2] ?? '') ?: null,
                    'tone' => ($parts[3] ?? '') ?: null,
                ];
            })
            ->filter(fn (array $feature): bool => $feature['label'] !== '')
            ->values()
            ->all();
    }

    /**
     * @return list<string>
     */
    private function parseLines(string $value): array
    {
        return collect(preg_split('/\r\n|\r|\n/', $value) ?: [])
            ->map(fn (string $line): string => trim($line))
            ->filter()
            ->values()
            ->all();
    }

    /**
     * @return list<string>
     */
    private function splitValues(string $value): array
    {
        return collect(preg_split('/[|,\r\n]+/', $value) ?: [])
            ->map(fn (string $value): string => trim($value))
            ->filter()
            ->unique()
            ->values()
            ->all();
    }

    private function validatedAccess(string $value): string
    {
        $value = $this->requiredString($value, 'access');

        if (! AccessLevel::tryFrom($value)) {
            throw new RuntimeException("Invalid access value: {$value}");
        }

        return $value;
    }

    private function slug(string $slug, string $title): string
    {
        return Str::slug($slug !== '' ? $slug : $this->requiredString($title, 'title'));
    }

    private function boolean(string $value): bool
    {
        return in_array(Str::lower(trim($value)), ['1', 'true', 'yes', 'y', 'on'], true);
    }

    private function integer(string $value): int
    {
        return (int) trim($value);
    }

    private function nullableInteger(string $value): ?int
    {
        $value = trim($value);

        return $value === '' ? null : (int) $value;
    }

    private function nullableFloat(string $value): ?float
    {
        $value = trim($value);

        return $value === '' ? null : (float) $value;
    }

    private function nullableDate(string $value): ?Carbon
    {
        $value = trim($value);

        return $value === '' ? null : Carbon::parse($value);
    }

    private function nullableString(string $value): ?string
    {
        $value = trim($value);

        return $value === '' ? null : $value;
    }

    private function requiredString(string $value, string $field): string
    {
        $value = trim($value);

        if ($value === '') {
            throw new RuntimeException("Missing required spreadsheet value: {$field}");
        }

        return $value;
    }

    private function csvValue(mixed $value): string
    {
        return $value === null ? '' : (string) $value;
    }

    /**
     * @param  list<string|null>  $values
     */
    private function isBlankRow(array $values): bool
    {
        return collect($values)
            ->every(fn (mixed $value): bool => trim((string) $value) === '');
    }

    private function ensureDirectory(): void
    {
        File::ensureDirectoryExists($this->directory(), 0750);
        @chmod($this->directory(), 0750);
    }

    private function directory(): string
    {
        $directory = (string) config('catalog.spreadsheet_directory', base_path('spreadsheets'));

        if (app()->environment('testing') && $directory === base_path('spreadsheets')) {
            return storage_path('framework/testing/spreadsheets');
        }

        return $directory;
    }

    private function path(string $filename): string
    {
        return $this->directory().DIRECTORY_SEPARATOR.$filename;
    }

    /**
     * @return array{trader_types: string|null, modules: string|null, playbooks: string|null}
     */
    private function currentHashes(): array
    {
        return [
            'trader_types' => is_file($this->path(self::TRADER_TYPES_FILE)) ? hash_file('sha256', $this->path(self::TRADER_TYPES_FILE)) : null,
            'modules' => is_file($this->path(self::MODULES_FILE)) ? hash_file('sha256', $this->path(self::MODULES_FILE)) : null,
            'playbooks' => is_file($this->path(self::PLAYBOOKS_FILE)) ? hash_file('sha256', $this->path(self::PLAYBOOKS_FILE)) : null,
        ];
    }

    /**
     * @return array{trader_types: string|null, modules: string|null, playbooks: string|null}
     */
    private function rememberedHashes(): array
    {
        $path = storage_path('app/'.self::STATE_FILE);

        if (! is_file($path)) {
            return [
                'trader_types' => null,
                'modules' => null,
                'playbooks' => null,
            ];
        }

        $state = json_decode((string) file_get_contents($path), true);

        return [
            'trader_types' => $state['hashes']['trader_types'] ?? null,
            'modules' => $state['hashes']['modules'] ?? null,
            'playbooks' => $state['hashes']['playbooks'] ?? null,
        ];
    }

    private function rememberCurrentHashes(): void
    {
        $path = storage_path('app/'.self::STATE_FILE);

        File::put($path, json_encode([
            'synced_at' => now()->toIso8601String(),
            'hashes' => $this->currentHashes(),
        ], JSON_PRETTY_PRINT));
        @chmod($path, 0640);
    }
}
