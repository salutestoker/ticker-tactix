<?php

use App\Services\CatalogSpreadsheetSyncService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

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
