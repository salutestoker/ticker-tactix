# Catalog CSV Sync

This directory contains database-backed CSV exports for catalog editing:

- `modules.csv`
- `playbooks.csv`

Keep the `id` column unchanged when editing existing rows. To create a new module or playbook from CSV, leave `id` blank and provide a unique `slug`.

Relationship fields use slugs:

- `market_slug` accepts one market slug.
- `trader_type_slugs` accepts one or more trader type slugs separated by `|`, commas, or new lines.
- `related_module_slugs` accepts one or more module slugs separated by `|`, commas, or new lines.

Commands:

```bash
php artisan catalog:spreadsheets:export
php artisan catalog:spreadsheets:import
php artisan catalog:spreadsheets:import --if-changed
```

Admin changes to modules and playbooks automatically refresh these CSV files. CSV edits are imported by the scheduled `catalog:spreadsheets:import --if-changed` command when the Laravel scheduler is running.
