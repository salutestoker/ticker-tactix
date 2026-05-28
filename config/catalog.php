<?php

return [
    'spreadsheet_directory' => env('CATALOG_SPREADSHEET_DIRECTORY') ?: base_path('spreadsheets'),
    'schedule_spreadsheet_imports' => (bool) env(
        'CATALOG_SPREADSHEET_SCHEDULE_ENABLED',
        env('APP_ENV') === 'production',
    ),
];
