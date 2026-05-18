# Testing Notes

## Test Commands

Use Laravel Sail by default. Do not assume host PHP, Composer, Node, or MySQL are installed.

```bash
# start containers
./vendor/bin/sail up -d

# PHP tests
./vendor/bin/sail test
./vendor/bin/sail artisan test

# route inspection
./vendor/bin/sail artisan route:list

# frontend build
./vendor/bin/sail npm run build

# frontend dev server
./vendor/bin/sail npm run dev

# lint/typecheck, when configured
./vendor/bin/sail npm run lint
./vendor/bin/sail npm run typecheck
```

## Verification Expectations

- Browser viewports to check: mobile, tablet, desktop for public pages; desktop and tablet for admin pages.
- Critical user flows: homepage, module index/detail, playbook index/detail, Discord login redirect/callback, admin CRUD for Modules, Playbooks, and Playbook Categories.
- API/endpoints to verify: public routes, admin routes, auth routes, payment-url CTA rendering.
- Data fixtures or seed commands: use migrations/factories/seeders through Sail, for example `./vendor/bin/sail artisan migrate:fresh --seed`.
- For Inertia pages, verify server props, React rendering, validation errors, redirects, flash messages, and browser navigation behavior.
