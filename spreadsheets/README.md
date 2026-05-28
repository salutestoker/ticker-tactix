# Catalog CSV Sync

This directory contains local, database-backed CSV exports for catalog editing:

- `modules.csv`
- `playbooks.csv`
- `trader_types.csv`

The CSV files are generated data and are intentionally ignored by git. They should not be committed. Locally, they live in this non-public directory. In production, set `CATALOG_SPREADSHEET_DISK` so the files live in a private Laravel Cloud object storage bucket instead of the ephemeral app filesystem.

Keep the `id` column unchanged when editing existing rows. To create a new module or playbook from CSV, leave `id` blank and provide a unique `slug`.

Relationship fields use slugs:

- `market_slug` accepts one market slug.
- `trader_type_slugs` accepts one or more trader type slugs separated by `|`, commas, or new lines.
- `related_module_slugs` accepts one or more module slugs separated by `|`, commas, or new lines.

Trader types are imported before modules and playbooks so relationship fields can resolve against the latest `trader_types.csv` changes.

Commands:

```bash
php artisan catalog:spreadsheets:export
php artisan catalog:spreadsheets:import
php artisan catalog:spreadsheets:import --if-changed
```

Admin changes to trader types, modules, and playbooks automatically refresh these CSV files. CSV edits are imported by the scheduled `catalog:spreadsheets:import --if-changed` command when the Laravel scheduler is running.

The scheduled import is guarded to run only when `APP_ENV=production`. Local imports and exports are manual only.

Production Laravel Cloud setup:

1. Create a private Laravel Object Storage bucket for the spreadsheets.
2. Use `catalog_spreadsheets` as the disk name, or set `CATALOG_SPREADSHEET_DISK` to the disk name you choose.
3. Set `CATALOG_SPREADSHEET_DIRECTORY=spreadsheets` unless you want a different folder prefix inside the bucket.
4. If Laravel Cloud does not inject credentials for that disk, copy the bucket credentials into the `CATALOG_SPREADSHEET_AWS_*` environment variables.
5. Run `php artisan catalog:spreadsheets:export` once after deployment to seed the bucket with `trader_types.csv`, `modules.csv`, and `playbooks.csv`.
