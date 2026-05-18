# Architecture Notes

## Stack

- Framework: Laravel latest stable, scaffolded with the official React/Inertia starter kit or Laravel Breeze React stack when using Breeze directly.
- Language: PHP, TypeScript, Inertia + React
- Frontend baseline: latest compatible Inertia + React packages. Current npm latest checked 2026-05-17: `@inertiajs/react` 3.1.1, `@inertiajs/core` 3.1.1, `react` 19.2.6, `react-dom` 19.2.6, `vite` 8.0.13, `@vitejs/plugin-react` 6.0.2, `laravel-vite-plugin` 3.1.0.
- Styling: Tailwind CSS >= v4
- Database: MySQL
- Auth: Laravel starter-kit/Breeze session auth customized for Discord OAuth
- Local dev: Laravel Sail
- Hosting: Laravel Cloud

## Scaffold And Runtime Policy

- Prefer Laravel's current official React starter kit when creating a fresh app; it provides the modern Laravel/Inertia/React baseline.
- If using Laravel Breeze directly, install Breeze's React/Inertia stack rather than Blade, Vue, Livewire, or API-only scaffolding.
- Use TypeScript for the React/Inertia frontend.
- Use Sail as the default local runtime and command runner. Do not assume PHP, Composer, Node, MySQL, or Redis are installed on the host.
- Prefer `./vendor/bin/sail` in docs, scripts, and final instructions. A local `sail` shell alias is optional and should not be assumed.
- If an exact package version matters, verify it at implementation time instead of relying on this file's dated package snapshot.
- When scaffolding in this existing repository, preserve `.codex/`, `design/`, and existing user files.

Suggested first-run commands after the Laravel app exists:

```bash
./vendor/bin/sail up -d
./vendor/bin/sail composer install
./vendor/bin/sail npm install
./vendor/bin/sail artisan migrate
./vendor/bin/sail npm run build
```

Suggested Breeze React install path when Breeze is used directly:

```bash
./vendor/bin/sail composer require laravel/breeze --dev
./vendor/bin/sail artisan breeze:install react --typescript
./vendor/bin/sail npm install
./vendor/bin/sail artisan migrate
```

After starter-kit or Breeze installation, update/check frontend packages against the latest compatible releases before building substantial UI work.

## Source Map

- App entry: resources/js/app.tsx
- Laravel routes: routes/web.php
- API routes: routes/api.php
- React pages: resources/js/Pages
- React components: resources/js/Components
- shadcn/Radix primitives, if installed: resources/js/Components/Primitives
- Branded UI wrappers: resources/js/Components/UI
- Shared types: resources/js/types
- Shared frontend utilities: resources/js/lib
- Eloquent models: app/Models
- Controllers: app/Http/Controllers
- Admin controllers: app/Http/Controllers/Admin
- Requests / validation: app/Http/Requests
- Policies / authorization: app/Policies
- Database migrations: database/migrations
- Seeders: database/seeders
- Tests: tests/Feature, tests/Unit

## Public Pages

The main public-facing pages are:

- / — Homepage
- /about — About
- /modules — Modules index
- /modules/{module:slug} — Individual module detail page
- /playbooks — Playbooks index
- /playbooks/{playbook:slug} — Individual playbook detail page
- /contact — Contact
- /terms-of-service — Terms of Service
- /membership-agreement — Membership Agreement
- /privacy-policy — Privacy Policy
- /financial-disclaimer — Financial Disclaimer
- /login — Login
- Other auth-related routes that ship with Laravel's React starter kit or Breeze React stack

## Admin Pages

Authenticated admin users should be able to manage Modules, Playbooks, and Playbook Categories.

Suggested admin routes:

- /admin — Admin dashboard
- /admin/modules — Manage modules
- /admin/modules/create — Create module
- /admin/modules/{module}/edit — Edit module
- /admin/playbooks — Manage playbooks
- /admin/playbooks/create — Create playbook
- /admin/playbooks/{playbook}/edit — Edit playbook
- /admin/playbook-categories — Manage playbook categories
- /admin/playbook-categories/create — Create playbook category
- /admin/playbook-categories/{category}/edit — Edit playbook category

Admin access should be protected by authentication and an admin authorization check.

## Content Architecture

The site has two primary product/content entities:

1. Modules
2. Playbooks

Modules represent individual system components in the Ticker Tactix framework.

Playbooks represent actionable trading frameworks or execution systems.

Modules and Playbooks should each have their own index pages and individual detail pages.

Modules live at:

- /modules/{slug}

Playbooks live at:

- /playbooks/{slug}

Slugs should be generated from the main display name and must be unique.

## Database Models

## Module

Eloquent model:

- App\Models\Module

Database table:

- modules

Modules should use playbook_category_id instead of playbook_type.

This keeps the relationship flexible and allows Modules to be grouped by the same category system used by Playbooks.

Suggested columns:

| Column | Type | Notes |
|---|---|---|
| id | bigint unsigned | Primary key |
| playbook_category_id | foreignId nullable | References playbook_categories.id |
| icon | string nullable | Icon key/name or media reference |
| title | string | Display title |
| slug | string unique | URL slug |
| purpose | string nullable | Short purpose statement |
| description | text nullable | Longer module description |
| key_output | string nullable | Main result/output from the module |
| version | string nullable | Example: v4.1 |
| payment_url | string nullable | External checkout/payment URL |
| sort_order | unsigned integer default 0 | Controls display order |
| is_featured | boolean default false | Used for homepage/highlight sections |
| is_active | boolean default true | Controls public visibility |
| published_at | timestamp nullable | Allows draft/published states |
| meta_title | string nullable | SEO title |
| meta_description | text nullable | SEO description |
| created_at | timestamp | Laravel default |
| updated_at | timestamp | Laravel default |
| deleted_at | timestamp nullable | Soft deletes |

Relationships:

- Module belongs to PlaybookCategory

Validation notes:

- title is required.
- slug is required and unique.
- payment_url should be nullable and validated as a URL.
- playbook_category_id should be nullable but must reference an existing playbook category when present.
- published_at controls whether a module is visible publicly.
- is_active can be used to quickly hide a module without deleting it.

Public visibility rule:

- A module is public when is_active = true and published_at is not null.

Suggested migration fields:

- foreignId playbook_category_id nullable constrained nullOnDelete
- string icon nullable
- string title
- string slug unique
- string purpose nullable
- text description nullable
- string key_output nullable
- string version nullable
- string payment_url nullable
- unsignedInteger sort_order default 0
- boolean is_featured default false
- boolean is_active default true
- timestamp published_at nullable
- string meta_title nullable
- text meta_description nullable
- softDeletes

## Playbook

Eloquent model:

- App\Models\Playbook

Database table:

- playbooks

Suggested columns:

| Column | Type | Notes |
|---|---|---|
| id | bigint unsigned | Primary key |
| playbook_category_id | foreignId | References playbook_categories.id |
| framework | string | Example: Market Environment, Crypto Environment, XRP Turtle Playbook |
| slug | string unique | URL slug |
| access | string | Example: base_access, core_access, pro_access, licensed_sigma |
| market | string nullable | Example: Broad Market, Crypto, XRP, BTC, XAU |
| best_for | text nullable | Short explanation of ideal use case |
| average_hold_time | string nullable | Example: +40 days, +16 days, +10 hours |
| price_cents | unsigned integer nullable | Store price in cents |
| currency | string default USD | Currency code |
| payment_url | string nullable | External checkout/payment URL |
| sort_order | unsigned integer default 0 | Controls display order |
| is_featured | boolean default false | Used for homepage/highlight sections |
| is_active | boolean default true | Controls public visibility |
| published_at | timestamp nullable | Allows draft/published states |
| meta_title | string nullable | SEO title |
| meta_description | text nullable | SEO description |
| created_at | timestamp | Laravel default |
| updated_at | timestamp | Laravel default |
| deleted_at | timestamp nullable | Soft deletes |

Relationships:

- Playbook belongs to PlaybookCategory

Validation notes:

- playbook_category_id is required.
- framework is required.
- slug is required and unique.
- access is required and should use one of the allowed access values.
- payment_url should be nullable and validated as a URL.
- price_cents should be nullable and stored as an integer, not decimal.
- currency should default to USD.
- published_at controls whether a playbook is visible publicly.
- is_active can be used to quickly hide a playbook without deleting it.

Public visibility rule:

- A playbook is public when is_active = true and published_at is not null.

Suggested migration fields:

- foreignId playbook_category_id constrained cascadeOnDelete
- string framework
- string slug unique
- string access
- string market nullable
- text best_for nullable
- string average_hold_time nullable
- unsignedInteger price_cents nullable
- string currency length 3 default USD
- string payment_url nullable
- unsignedInteger sort_order default 0
- boolean is_featured default false
- boolean is_active default true
- timestamp published_at nullable
- string meta_title nullable
- text meta_description nullable
- softDeletes

## Playbook Category

Playbook categories are shared by Modules and Playbooks.

Eloquent model:

- App\Models\PlaybookCategory

Database table:

- playbook_categories

Suggested columns:

| Column | Type | Notes |
|---|---|---|
| id | bigint unsigned | Primary key |
| name | string | Example: Market Environment, Core Playbooks, Pro Playbooks |
| slug | string unique | URL/category slug |
| description | text nullable | Category description |
| icon | string nullable | Icon key/name or media reference |
| color | string nullable | Optional UI color token or hex value |
| sort_order | unsigned integer default 0 | Controls category display order |
| is_active | boolean default true | Controls visibility |
| created_at | timestamp | Laravel default |
| updated_at | timestamp | Laravel default |
| deleted_at | timestamp nullable | Soft deletes |

Relationships:

- PlaybookCategory has many Modules
- PlaybookCategory has many Playbooks

Validation notes:

- name is required.
- slug is required and unique.
- icon should be nullable.
- color should be nullable.
- sort_order should default to 0.
- is_active should default to true.

Suggested migration fields:

- string name
- string slug unique
- text description nullable
- string icon nullable
- string color nullable
- unsignedInteger sort_order default 0
- boolean is_active default true
- softDeletes

## Suggested Access Values

Playbook access should be stored as a controlled string value.

Suggested values:

| Value | Display Label |
|---|---|
| base_access | Base Access |
| core_access | Core Access |
| pro_access | Pro Access |
| licensed_sigma | Licensed to SIGMA |

This gives the database stable values while allowing the UI to display nicer labels.

## Suggested Category Examples

Initial Playbook Category records could include:

| Name | Suggested Slug |
|---|---|
| Market Environment | market-environment |
| Core Playbooks | core-playbooks |
| Pro Playbooks | pro-playbooks |
| Joint Community Deployments | joint-community-deployments |
| Crypto Environment | crypto-environment |
| Sector Rotation | sector-rotation |
| XRP Playbooks | xrp-playbooks |

These can be adjusted later through the admin UI.

## Suggested Model Scopes

Modules and Playbooks should include reusable Eloquent scopes:

- public
- active
- published
- featured
- ordered

Expected behavior:

- public means active and published.
- active means is_active = true.
- published means published_at is not null.
- featured means is_featured = true.
- ordered means sort by sort_order ascending, then title/framework ascending.

For Modules:

- ordered sorts by sort_order ascending, then title ascending.

For Playbooks:

- ordered sorts by sort_order ascending, then framework ascending.

## Suggested Slug Behavior

Modules should generate slugs from title.

Playbooks should generate slugs from framework.

Playbook Categories should generate slugs from name.

Examples:

- Momentum Cycle becomes /modules/momentum-cycle
- XRP Turtle Playbook becomes /playbooks/xrp-turtle-playbook
- Core Playbooks becomes core-playbooks

Slugs should be editable in the admin UI, but unique.

## Admin UI Requirements

The admin UI should allow admin users to:

- Create Modules
- Edit Modules
- Publish and unpublish Modules
- Delete Modules
- Create Playbooks
- Edit Playbooks
- Publish and unpublish Playbooks
- Delete Playbooks
- Create Playbook Categories
- Edit Playbook Categories
- Delete Playbook Categories
- Upload or assign icons
- Set sort order
- Mark records as featured
- Add external payment URLs
- Preview public-facing pages before publishing

For the first version, icons can be stored as string keys that map to React/Lucide/custom SVG icons.

Example icon keys:

- momentum
- volatility
- structure
- participation
- market-environment
- crypto
- xrp
- sigma
- database
- signal
- bell
- chart
- shield
- layers

Avoid storing raw SVG markup in the database unless there is a specific need.

## Authorization

The app should support normal authenticated users and admin users.

Suggested approach:

- Add an is_admin boolean column to the users table.
- Default is_admin to false.
- Protect all /admin/* routes with auth middleware and an admin authorization check.
- Use policies where possible for Modules, Playbooks, and Playbook Categories.

Suggested users table addition:

- boolean is_admin default false

Suggested middleware behavior:

- Only authenticated users with is_admin = true may access admin routes.

## Controllers

Suggested public controllers:

- App\Http\Controllers\HomeController
- App\Http\Controllers\AboutController
- App\Http\Controllers\ModuleController
- App\Http\Controllers\PlaybookController
- App\Http\Controllers\ContactController
- App\Http\Controllers\LegalPageController

Suggested admin controllers:

- App\Http\Controllers\Admin\DashboardController
- App\Http\Controllers\Admin\ModuleController
- App\Http\Controllers\Admin\PlaybookController
- App\Http\Controllers\Admin\PlaybookCategoryController

Public controllers should only show public records.

Admin controllers should be able to show draft, inactive, and published records.

## Request Validation

Suggested form request classes:

- App\Http\Requests\Admin\StoreModuleRequest
- App\Http\Requests\Admin\UpdateModuleRequest
- App\Http\Requests\Admin\StorePlaybookRequest
- App\Http\Requests\Admin\UpdatePlaybookRequest
- App\Http\Requests\Admin\StorePlaybookCategoryRequest
- App\Http\Requests\Admin\UpdatePlaybookCategoryRequest

## Frontend Structure

Suggested React page files:

- resources/js/Pages/Home.tsx
- resources/js/Pages/About.tsx
- resources/js/Pages/Modules/Index.tsx
- resources/js/Pages/Modules/Show.tsx
- resources/js/Pages/Playbooks/Index.tsx
- resources/js/Pages/Playbooks/Show.tsx
- resources/js/Pages/Contact.tsx
- resources/js/Pages/Legal/TermsOfService.tsx
- resources/js/Pages/Legal/MembershipAgreement.tsx
- resources/js/Pages/Legal/PrivacyPolicy.tsx
- resources/js/Pages/Legal/FinancialDisclaimer.tsx
- resources/js/Pages/Admin/Dashboard.tsx
- resources/js/Pages/Admin/Modules/Index.tsx
- resources/js/Pages/Admin/Modules/Create.tsx
- resources/js/Pages/Admin/Modules/Edit.tsx
- resources/js/Pages/Admin/Playbooks/Index.tsx
- resources/js/Pages/Admin/Playbooks/Create.tsx
- resources/js/Pages/Admin/Playbooks/Edit.tsx
- resources/js/Pages/Admin/PlaybookCategories/Index.tsx
- resources/js/Pages/Admin/PlaybookCategories/Create.tsx
- resources/js/Pages/Admin/PlaybookCategories/Edit.tsx

Suggested shared components:

- resources/js/Components/Layout/PublicLayout.tsx
- resources/js/Components/Layout/AdminLayout.tsx
- resources/js/Components/Modules/ModuleCard.tsx
- resources/js/Components/Modules/ModuleTable.tsx
- resources/js/Components/Playbooks/PlaybookCard.tsx
- resources/js/Components/Playbooks/PlaybookTable.tsx
- resources/js/Components/PlaybookCategories/CategoryBadge.tsx
- resources/js/Components/Icons/IconRenderer.tsx
- resources/js/Components/SEO/SeoHead.tsx
- resources/js/Components/UI/Button.tsx
- resources/js/Components/UI/Card.tsx
- resources/js/Components/UI/Badge.tsx
- resources/js/Components/UI/Input.tsx
- resources/js/Components/UI/Textarea.tsx
- resources/js/Components/UI/Select.tsx
- resources/js/Components/UI/Table.tsx

Suggested shadcn primitive source files, if shadcn is added:

- resources/js/Components/Primitives/dialog.tsx
- resources/js/Components/Primitives/dropdown-menu.tsx
- resources/js/Components/Primitives/popover.tsx
- resources/js/Components/Primitives/sheet.tsx
- resources/js/Components/Primitives/tabs.tsx
- resources/js/Components/Primitives/tooltip.tsx
- resources/js/Components/Primitives/select.tsx
- resources/js/Components/Primitives/checkbox.tsx
- resources/js/Components/Primitives/switch.tsx
- resources/js/Components/Primitives/sonner.tsx

Configure `components.json` aliases so shadcn writes primitives under `resources/js/Components/Primitives` and utilities under `resources/js/lib`. Keep generated primitives visually neutral, then expose project-facing controls through `resources/js/Components/UI`.

## Frontend Data Shape

Suggested Module type:

- id: number
- playbook_category_id: number or null
- icon: string or null
- title: string
- slug: string
- purpose: string or null
- description: string or null
- key_output: string or null
- version: string or null
- payment_url: string or null
- sort_order: number
- is_featured: boolean
- is_active: boolean
- published_at: string or null
- meta_title: string or null
- meta_description: string or null
- category: PlaybookCategory or null

Suggested Playbook type:

- id: number
- playbook_category_id: number
- framework: string
- slug: string
- access: base_access, core_access, pro_access, or licensed_sigma
- market: string or null
- best_for: string or null
- average_hold_time: string or null
- price_cents: number or null
- currency: string
- payment_url: string or null
- sort_order: number
- is_featured: boolean
- is_active: boolean
- published_at: string or null
- meta_title: string or null
- meta_description: string or null
- category: PlaybookCategory

Suggested PlaybookCategory type:

- id: number
- name: string
- slug: string
- description: string or null
- icon: string or null
- color: string or null
- sort_order: number
- is_active: boolean

## Design Notes

The design direction is a dark sci-fi trading system interface.

Use:

- Dark navy/black backgrounds
- Neon green, cyan, purple, and blue accents
- Thin outlined cards
- Data-table inspired layouts
- System/status labels
- Compact uppercase section headings
- Glowing borders and subtle gradients where appropriate
- Responsive layouts for mobile and desktop

Modules should visually feel like system components.

Playbooks should visually feel like deployable frameworks or trading protocols.

## SEO Notes

Each Module, Playbook, and major public page should support:

- Meta title
- Meta description
- Clean canonical URL
- Open Graph title
- Open Graph description
- Open Graph image where applicable

For the first version, meta_title and meta_description can live directly on Modules and Playbooks.

## Payment Notes

Payment processing is handled externally through payment_url.

The app should not store credit card data.

Payment buttons should only render when payment_url is present.

Suggested button behavior:

- Modules with payment URLs show a CTA such as Get Module, Unlock Module, or Access Module.
- Playbooks with payment URLs show a CTA such as Get Playbook, Join, Unlock, or Coming Soon depending on the payment URL and status.

## Decisions

Use this section for durable decisions Codex should respect later.

- Modules and Playbooks are separate first-class entities.
- Modules use /modules/{slug} routes.
- Playbooks use /playbooks/{slug} routes.
- Modules use playbook_category_id, not playbook_type.
- Modules can optionally belong to a Playbook Category.
- Playbooks must belong to a Playbook Category.
- Playbook Categories are shared between Modules and Playbooks.
- Prices should be stored as integer cents using price_cents.
- Payment links should be stored as external URLs.
- Use published_at and is_active to control public visibility.
- Use sort_order to control display order.
- Use soft deletes for Modules, Playbooks, and Playbook Categories.
- Store icon references as string keys, not raw SVG markup.
- Use admin-only routes for creating and editing Modules, Playbooks, and Playbook Categories.
- Admin access should be controlled with an is_admin flag or equivalent authorization policy.
- Public pages should only display active and published records.
- Admin pages should display draft, inactive, and published records.
