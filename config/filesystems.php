<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Filesystem Disk
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default filesystem disk that should be used
    | by the framework. The "local" disk, as well as a variety of cloud
    | based disks are available to your application for file storage.
    |
    */

    'default' => env('FILESYSTEM_DISK', 'local'),

    'catalog_media_disk' => env('CATALOG_MEDIA_DISK')
        ?: (env('FILESYSTEM_DISK') === 'local' ? 'public' : (env('FILESYSTEM_DISK') ?: 'public')),

    'playbook_logo_disk' => env('PLAYBOOK_LOGO_DISK')
        ?: env('CATALOG_MEDIA_DISK')
        ?: (env('FILESYSTEM_DISK') === 'local' ? 'public' : (env('FILESYSTEM_DISK') ?: 'public')),

    'playbook_logo_directory' => env('PLAYBOOK_LOGO_DIRECTORY', 'playbook-logos'),

    'module_image_disk' => env('MODULE_IMAGE_DISK')
        ?: env('CATALOG_MEDIA_DISK')
        ?: (env('FILESYSTEM_DISK') === 'local' ? 'public' : (env('FILESYSTEM_DISK') ?: 'public')),

    'module_image_directory' => env('MODULE_IMAGE_DIRECTORY', 'module-images'),

    /*
    |--------------------------------------------------------------------------
    | Filesystem Disks
    |--------------------------------------------------------------------------
    |
    | Below you may configure as many filesystem disks as necessary, and you
    | may even configure multiple disks for the same driver. Examples for
    | most supported storage drivers are configured here for reference.
    |
    | Supported drivers: "local", "ftp", "sftp", "s3"
    |
    */

    'disks' => [

        'local' => [
            'driver' => 'local',
            'root' => storage_path('app/private'),
            'serve' => true,
            'throw' => false,
            'report' => false,
        ],

        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'url' => env('PUBLIC_STORAGE_URL', '/storage'),
            'visibility' => 'public',
            'throw' => false,
            'report' => false,
        ],

        's3' => [
            'driver' => 's3',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION') ?: env('AWS_REGION') ?: 'auto',
            'bucket' => env('AWS_BUCKET'),
            'url' => env('AWS_URL'),
            'endpoint' => env('AWS_ENDPOINT'),
            'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
            'throw' => false,
            'report' => false,
        ],

        'ticker_tactix_public' => [
            'driver' => 's3',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('TICKER_TACTIX_PUBLIC_REGION') ?: env('AWS_DEFAULT_REGION') ?: env('AWS_REGION') ?: 'auto',
            'bucket' => env('TICKER_TACTIX_PUBLIC_BUCKET') ?: env('AWS_BUCKET') ?: 'ticker_tactix_public',
            'url' => env('AWS_URL'),
            'endpoint' => env('AWS_ENDPOINT'),
            'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
            'throw' => false,
            'report' => false,
        ],

        'catalog_spreadsheets' => [
            'driver' => 's3',
            'key' => env('CATALOG_SPREADSHEET_AWS_ACCESS_KEY_ID') ?: env('AWS_ACCESS_KEY_ID'),
            'secret' => env('CATALOG_SPREADSHEET_AWS_SECRET_ACCESS_KEY') ?: env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('CATALOG_SPREADSHEET_AWS_DEFAULT_REGION') ?: env('CATALOG_SPREADSHEET_AWS_REGION') ?: env('AWS_DEFAULT_REGION') ?: env('AWS_REGION') ?: 'auto',
            'bucket' => env('CATALOG_SPREADSHEET_AWS_BUCKET') ?: env('AWS_BUCKET'),
            'url' => env('CATALOG_SPREADSHEET_AWS_URL') ?: env('AWS_URL'),
            'endpoint' => env('CATALOG_SPREADSHEET_AWS_ENDPOINT') ?: env('AWS_ENDPOINT'),
            'use_path_style_endpoint' => env('CATALOG_SPREADSHEET_AWS_USE_PATH_STYLE_ENDPOINT', env('AWS_USE_PATH_STYLE_ENDPOINT', false)),
            'visibility' => 'private',
            'throw' => true,
            'report' => false,
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Symbolic Links
    |--------------------------------------------------------------------------
    |
    | Here you may configure the symbolic links that will be created when the
    | `storage:link` Artisan command is executed. The array keys should be
    | the locations of the links and the values should be their targets.
    |
    */

    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],

];
