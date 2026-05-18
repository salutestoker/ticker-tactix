# Architecture Notes

## Stack

- Framework: Laravel latest stable with the official React/Inertia starter kit or Laravel Breeze React/Inertia when using Breeze directly.
- Runtime: Laravel Sail first. Prefer `./vendor/bin/sail` for Composer, Artisan, npm, tests, and build commands.
- Frontend: Inertia + React + TypeScript, Tailwind CSS v4, selective shadcn/ui source primitives wrapped in Ticker Tactix styling.
- Database: MySQL locally through Sail and on Laravel Cloud.
- Auth: Laravel session auth customized for Discord OAuth and admin authorization.
- Hosting target: Laravel Cloud.

## Source Map

- Routes: `routes/web.php`
- Public controllers: `app/Http/Controllers`
- Admin controllers: `app/Http/Controllers/Admin`
- Models: `app/Models`
- Access enum: `app/Enums/AccessLevel.php`
- Migrations: `database/migrations`
- Seed data: `database/seeders/DatabaseSeeder.php`
- React pages: `resources/js/Pages`
- Shared React components: `resources/js/Components`
- Shared UI components: `resources/js/Components/UI`
- Shared icon registry: `resources/js/lib/icons.ts`
- Shared frontend types: `resources/js/types/index.d.ts`

## Public Routes

- `/` homepage
- `/about`
- `/modules`
- `/modules/{module:slug}`
- `/playbooks`
- `/playbooks/{playbook:slug}`
- `/contact`
- Legal pages: `/terms-of-service`, `/membership-agreement`, `/privacy-policy`, `/financial-disclaimer`

Public catalog records are visible only when `is_active = true` and `published_at` is set.

## Admin Routes

Admin routes are protected by auth plus the admin middleware.

- `/admin`
- `/admin/modules`
- `/admin/modules/create`
- `/admin/modules/{module}/edit`
- `/admin/playbooks`
- `/admin/playbooks/create`
- `/admin/playbooks/{playbook}/edit`
- `/admin/markets`
- `/admin/markets/create`
- `/admin/markets/{market}/edit`
- `/admin/trader-types`
- `/admin/trader-types/create`
- `/admin/trader-types/{trader_type}/edit`

Playbook Categories have been removed completely. Do not recreate category pages, fields, relationships, or seed data.

## Core Domain

Primary entities:

1. Modules
2. Playbooks
3. Trader Types
4. Markets

Modules represent individual Ticker Tactix system components. Playbooks represent deployable trading playbooks. Trader Types and Markets are reusable taxonomies shared by both.

Seed Modules and Playbooks from:

- `prompts/references/modules-matrix.md`
- `prompts/references/playbooks-matrix.md`

Before seeding the matrix data, clear existing Module and Playbook rows plus their pivot rows.

## Access Enum

Access is code-managed through `App\Enums\AccessLevel` and mirrored in TypeScript.

Current values:

- `Invite-Only Indicator + Discord`
- `Daily Newsletter + Discord`
- `Partner Community Access`
- `Alerts + Guided Discord`

Use the enum values exactly as written for validation, seeding, admin selects, and frontend display.

## Module Model

Model: `App\Models\Module`

Table: `modules`

Important fields:

- `market_id`
- `icon`
- `title`
- `slug`
- `description`
- `version` as numeric decimal without the `v` prefix
- `access`
- `action_label`
- `sort_order`
- `is_featured`
- `is_active`
- `published_at`
- `meta_title`
- `meta_description`
- timestamps and soft deletes

Relationships:

- `market()` belongs to `Market`
- `traderTypes()` many-to-many through `module_trader_type`
- `relatedModules()` self many-to-many through `module_related_modules`

Modules can have multiple Trader Types. The admin form label for self-related modules is `Trader’s also bought`, and a Module must not be related to itself.

The matrix mapping is:

- `Module` -> `title`
- `What It Does` -> `description`
- `Trader Type` -> many-to-many `traderTypes`, split on semicolons
- `Market` -> `market`
- `Access` -> `AccessLevel`
- `Version` -> numeric `version` with leading `v` stripped
- `Action` -> `action_label`

Render versions on the frontend with the `v` prefix.

## Playbook Model

Model: `App\Models\Playbook`

Table: `playbooks`

Important fields:

- `market_id`
- `icon`
- `title`
- `slug`
- `access`
- `best_for`
- `trading_pace`
- `average_hold_time`
- `price`
- `action_label`
- `sort_order`
- `is_featured`
- `is_active`
- `published_at`
- `meta_title`
- `meta_description`
- timestamps and soft deletes

Relationships:

- `market()` belongs to `Market`
- `traderTypes()` many-to-many through `playbook_trader_type`

Playbook price is freeform text. Preserve values such as `$70/mo`, `Coming Soon`, `External / Token-Gated`, and `—` exactly. Do not normalize Playbook prices into cents or currency fields.

The matrix mapping is:

- `Playbook` -> `title`
- `Best For` -> `best_for`
- `Trader Type` -> `traderTypes`
- `Market` -> `market`
- `Trading Pace` -> `trading_pace`
- `Avg Hold` -> `average_hold_time`
- `Access` -> `AccessLevel`
- `Price` -> `price`
- `Action` -> `action_label`

## Trader Type Model

Model: `App\Models\TraderType`

Table: `trader_types`

Fields:

- `name`
- `slug`
- `description`
- `color`
- `icon`
- `sort_order`
- `is_active`
- timestamps and soft deletes

Relationships:

- `modules()` many-to-many
- `playbooks()` many-to-many

Seeded Trader Types:

- NYSE BASE: Brand Violet, no icon
- CRYPTO BASE: Brand Violet, no icon
- NYSE CORE: Brand Seafoam Green, `turtle`
- CRYPTO CORE: Brand Seafoam Green, `turtle`
- NYSE PRO: Brand Gold, `bunny`
- CRYPTO PRO: Brand Gold, `bunny`

## Market Model

Model: `App\Models\Market`

Table: `markets`

Fields:

- `name`
- `slug`
- `description`
- `color`
- `sort_order`
- `is_active`
- timestamps and soft deletes

Relationships:

- `modules()` has many
- `playbooks()` has many

Seeded Markets:

- Crypto: Brand Violet
- NYSE: Brand Seafoam Green
- All: Brand Gold

## Icons

Store icon keys in the database, not raw SVG.

Use:

- Admin selector: `resources/js/Components/Admin/IconSelector.tsx`
- Shared registry: `resources/js/lib/icons.ts`
- Public/admin rendering: `resources/js/Components/Icons/IconRenderer.tsx`

The registry must include `turtle`, `bunny`, and all existing Ticker Tactix icons. Frontend displays should render icons through `IconRenderer`.

## Admin UI

Module forms should include:

- title, slug, description
- Trader Type multi-select
- Market select
- Access enum select
- numeric version input
- action label
- icon selector
- `Trader’s also bought` module multi-select
- draft/active/featured/published/meta fields

Playbook forms should include:

- title, slug, best for
- Trader Type selector
- Market select
- trading pace
- average hold
- Access enum select
- freeform price
- action label
- icon selector
- draft/active/featured/published/meta fields

Trader Type forms include name, slug, description, color picker, icon selector, sort order, and active state.

Market forms include name, slug, description, color picker, sort order, and active state.

## Frontend Display

- Trader Type chips use taxonomy colors.
- Market chips use taxonomy colors.
- Access badges display the enum value.
- Module versions display as `v{version}`.
- Playbook price displays as raw text.
- Removed fields must not be displayed.

## Implementation Defaults

- Prefer Laravel conventions and existing project patterns.
- Prefer Inertia typed props and `useForm` for admin forms.
- Keep frontend utilities in `resources/js/lib`.
- Keep reusable UI in `resources/js/Components`.
- Add focused feature tests when changing routes, model contracts, validation, seed behavior, or public/admin page props.
