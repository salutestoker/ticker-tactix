<?php

use App\Jobs\DispatchNewsletterDeliveryJob;
use App\Models\NewsletterDelivery;
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

Artisan::command('newsletter:dispatch-due', function (): int {
    $deliveries = NewsletterDelivery::query()
        ->where('status', NewsletterDelivery::STATUS_SCHEDULED)
        ->whereNotNull('scheduled_for')
        ->where('scheduled_for', '<=', now())
        ->orderBy('scheduled_for')
        ->orderBy('id')
        ->get();

    $deliveries->each(fn (NewsletterDelivery $delivery) => DispatchNewsletterDeliveryJob::dispatch($delivery));

    $this->info("Dispatched {$deliveries->count()} due newsletter deliveries.");

    return 0;
})->purpose('Dispatch due scheduled newsletter deliveries');

Artisan::command('mailgun:diagnose', function (): int {
    $mailDefault = trim((string) config('mail.default'));
    $mailgunDomain = trim((string) config('services.mailgun.domain'));
    $mailgunEndpoint = trim((string) config('services.mailgun.endpoint'));
    $mailgunSecret = config('services.mailgun.secret');
    $fromAddress = trim((string) config('mail.from.address'));
    $secretPresent = is_string($mailgunSecret) && trim($mailgunSecret) !== '';

    $this->table(['Config key', 'Effective value'], [
        ['mail.default', $mailDefault !== '' ? $mailDefault : '(empty)'],
        ['services.mailgun.domain', $mailgunDomain !== '' ? $mailgunDomain : '(empty)'],
        ['services.mailgun.endpoint', $mailgunEndpoint !== '' ? $mailgunEndpoint : '(empty)'],
        ['services.mailgun.secret', $secretPresent ? 'present' : 'missing'],
        ['mail.from.address', $fromAddress !== '' ? $fromAddress : '(empty)'],
    ]);

    $errors = [];

    if ($mailDefault !== 'mailgun') {
        $errors[] = 'MAIL_MAILER should be set to mailgun before production sends.';
    }

    if ($mailgunDomain === '') {
        $errors[] = 'MAILGUN_DOMAIN is missing.';
    }

    if (! $secretPresent) {
        $errors[] = 'MAILGUN_SECRET is missing.';
    }

    if ($mailgunEndpoint === '') {
        $errors[] = 'MAILGUN_ENDPOINT is missing.';
    } elseif (str_contains($mailgunEndpoint, '://') || str_contains($mailgunEndpoint, '/')) {
        $errors[] = 'MAILGUN_ENDPOINT should be a host only, such as api.mailgun.net or api.eu.mailgun.net.';
    }

    if ($fromAddress === '' || filter_var($fromAddress, FILTER_VALIDATE_EMAIL) === false) {
        $errors[] = 'MAIL_FROM_ADDRESS must be a valid email address.';
    } elseif ($mailgunDomain !== '') {
        $fromDomain = strtolower(substr(strrchr($fromAddress, '@') ?: '', 1));

        if ($fromDomain !== strtolower($mailgunDomain)) {
            $errors[] = 'MAIL_FROM_ADDRESS should use the MAILGUN_DOMAIN host unless another sending domain is verified in Mailgun.';
        }
    }

    if ($errors !== []) {
        foreach ($errors as $error) {
            $this->error($error);
        }

        return 1;
    }

    $this->info('Mailgun configuration looks ready for a production send.');

    return 0;
})->purpose('Display masked Mailgun mail configuration for production diagnostics');

if (app()->environment('production') && config('catalog.schedule_spreadsheet_imports')) {
    Schedule::command('catalog:spreadsheets:import --if-changed')
        ->everyMinute()
        ->withoutOverlapping(10)
        ->onOneServer();
}

Schedule::command('newsletter:dispatch-due')
    ->everyMinute()
    ->withoutOverlapping(10)
    ->onOneServer();

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
