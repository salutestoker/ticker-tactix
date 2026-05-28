<?php

return [
    'spreadsheet_disk' => env('CATALOG_SPREADSHEET_DISK'),
    'spreadsheet_directory' => env('CATALOG_SPREADSHEET_DIRECTORY')
        ?: (env('CATALOG_SPREADSHEET_DISK') ? 'spreadsheets' : base_path('spreadsheets')),
    'schedule_spreadsheet_imports' => (bool) env(
        'CATALOG_SPREADSHEET_SCHEDULE_ENABLED',
        env('APP_ENV') === 'production',
    ),
];
