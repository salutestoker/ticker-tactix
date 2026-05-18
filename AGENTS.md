# AGENTS.md

Always-loaded instructions for Codex agents working in this repository. Keep this file concise; use `.codex/context/` and `.codex/skills/` for detailed guidance.

## Project Snapshot

- Project: Ticker Tactix, a website/web app for trading modules and playbooks.
- Stack: Laravel, official React/Inertia starter kit or Breeze React stack, TypeScript, Tailwind CSS v4, MySQL.
- Frontend baseline: latest compatible Inertia + React releases; Laravel 13's React starter kit uses Inertia 3, React 19, Tailwind 4, and shadcn/ui source components.
- Local development: Laravel Sail. Prefer `./vendor/bin/sail ...` for Composer, Artisan, NPM, tests, and build commands.
- Auth: Laravel starter-kit/Breeze session auth customized for Discord OAuth with private guild/role authorization.
- Hosting target: Laravel Cloud.
- Design direction: dark futuristic trading command system with neon green, blue, violet, and gold accents.

## Autonomy

- Assume permission to create, edit, scaffold, and wire app files needed to satisfy the user's request.
- Do not stop to ask for implementation permission when the next build step is clear; make the conservative project-aligned choice and continue.
- Ask only when a decision is destructive, requires secrets or paid external services, affects unrelated user work, or cannot be inferred from project context.
- If the app has not been scaffolded yet, build toward the stack above instead of asking which stack to use.

## Context Loading

- Start with this file, then load deeper context only when relevant.
- Architecture, routes, data models, admin/public pages: `.codex/context/architecture.md`.
- Visual system, assets, components, responsive behavior: `.codex/context/design-system.md`.
- Discord auth implementation: `.codex/context/authentication-discord-laravel.md`.
- QA and release checks: `.codex/checklists/`.
- Project skills live in `.codex/skills/`; use the matching skill for Laravel, Inertia React, Tailwind v4 design systems, or advanced TypeScript work.

## Core Domain

- Primary entities: Modules, Playbooks, and Playbook Categories.
- Modules use `/modules/{slug}` and may belong to a Playbook Category.
- Playbooks use `/playbooks/{slug}` and must belong to a Playbook Category.
- Public pages show only records where `is_active = true` and `published_at` is set.
- Admin pages manage draft, inactive, and published records.
- Store prices as integer cents. Store payment links as external URLs. Do not store card data.

## Implementation Defaults

- Prefer Laravel conventions: controllers, form requests, policies, resources where useful, Eloquent relationships/scopes, migrations, factories, and feature tests.
- Use Laravel Sail-first commands: `./vendor/bin/sail composer ...`, `./vendor/bin/sail artisan ...`, and `./vendor/bin/sail npm ...`.
- Prefer Inertia patterns: typed page props, `Head`, `Link` for internal navigation, `useForm` for forms, Ziggy `route()` for Laravel routes, shared props for auth/flash/config.
- Prefer reusable React components under `resources/js/Components` and pages under `resources/js/Pages`.
- Use Tailwind CSS v4 theme tokens/CSS variables for brand colors and reusable UI primitives.
- Use shadcn/ui selectively as accessible source primitives; wrap and restyle them into Ticker Tactix components instead of shipping default shadcn styling.
- Use assets from `design/` before recreating imagery or icons.
- Keep admin UI usable and dense while retaining the branded command-center style.

## Quality Bar

- Preserve user work; never revert unrelated changes.
- Keep changes scoped, typed, accessible, responsive, and consistent with the design references.
- Do not commit secrets or real `.env` values.
- For Discord auth, authorize by Discord IDs, guild ID, and role IDs; never by usernames or role names.
- Run the most relevant available verification for the change: tests, lint/typecheck, build, route checks, or browser checks. Report anything that could not be run.
