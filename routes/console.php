<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('storage:probe {disk? : Filesystem disk to test}', function (?string $disk = null): int {
    $disk ??= (string) config('filesystems.playbook_logo_disk', config('filesystems.default'));
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
