<?php

use App\Services\CatalogSpreadsheetSyncService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Storage;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('catalog:spreadsheets:export', function (): int {
    $counts = app(CatalogSpreadsheetSyncService::class)->exportAll();

    $this->info("Exported {$counts['trader_types']} trader types, {$counts['modules']} modules, and {$counts['playbooks']} playbooks.");

    return 0;
})->purpose('Export trader types, modules, and playbooks to CSV spreadsheets');

Artisan::command('catalog:spreadsheets:import {--if-changed : Only import when the CSV files have changed since the last sync}', function (): int {
    $sync = app(CatalogSpreadsheetSyncService::class);
    $counts = $this->option('if-changed')
        ? $sync->importChanged()
        : ['imported' => true, ...$sync->importAll()];

    if (! $counts['imported']) {
        $this->info('No spreadsheet changes detected.');

        return 0;
    }

    $this->info("Imported {$counts['trader_types']} trader types, {$counts['modules']} modules, and {$counts['playbooks']} playbooks.");

    return 0;
})->purpose('Import trader type, module, and playbook updates from CSV spreadsheets');

if (app()->environment('production') && config('catalog.schedule_spreadsheet_imports')) {
    Schedule::command('catalog:spreadsheets:import --if-changed')
        ->everyMinute()
        ->withoutOverlapping(10)
        ->onOneServer();
}

Artisan::command('storage:probe {disk? : Filesystem disk to test}', function (?string $disk = null): int {
    $disk ??= (string) config('filesystems.catalog_media_disk', config('filesystems.default'));
    $path = 'storage-probes/'.now()->format('YmdHis').'-'.bin2hex(random_bytes(4)).'.txt';

    $this->line("Testing disk [{$disk}] with path [{$path}]...");

    Storage::disk($disk)->put($path, 'ok');

    if (! Storage::disk($disk)->exists($path)) {
        $this->error('Write completed, but the file could not be found.');

        return 1;
    }

    Storage::disk($disk)->delete($path);

    $this->info('Storage probe succeeded.');

    return 0;
})->purpose('Verify a filesystem disk can write, read, and delete a file');
