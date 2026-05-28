# Catalog CSV Sync

This directory contains production-only, database-backed CSV exports for catalog editing:

- `modules.csv`
- `playbooks.csv`
- `trader_types.csv`

The CSV files are generated data and are intentionally ignored by git. They should live on the server only and should not be committed. This directory is outside Laravel's `public` web root, so the files are not browser-accessible; editing should require server/SFTP access or an authenticated shell session.

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

Admin changes to modules and playbooks automatically refresh these CSV files. CSV edits are imported by the scheduled `catalog:spreadsheets:import --if-changed` command when the Laravel scheduler is running.

The scheduled import is guarded to run only when `APP_ENV=production`. Local imports and exports are manual only.
