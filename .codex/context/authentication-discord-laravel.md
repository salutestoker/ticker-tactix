---
name: laravel-discord-authentication
description: Use this when implementing, reviewing, or modifying Discord OAuth authentication for a Laravel application where users must authenticate through Discord and belong to a specific private Discord server/guild.
---

# Laravel Discord Authentication

## Purpose

This document defines the preferred implementation pattern for using Discord as the primary authentication and authorization method in a Laravel application.

Build this on top of Laravel's official React/Inertia starter kit or Laravel Breeze React stack. Keep Laravel session authentication, CSRF protection, redirects, middleware, password reset/email verification decisions, and starter-kit conventions unless a task explicitly removes them.

The app should authenticate users through Discord OAuth, then verify that the authenticated Discord user belongs to the configured private Discord server/guild. Access to the Laravel app should be granted or denied based on the user's Discord server membership and configured Discord role IDs.

Use Laravel Socialite for the OAuth flow and `socialiteproviders/discord` for Discord-specific provider support. Do not build raw Discord OAuth handling unless there is a specific reason to avoid Socialite.

Discord Nitro is not required. A normal Discord account is enough for users to authenticate. A normal Discord account with access to the Discord Developer Portal is enough to create the OAuth application.

## Core Rule

Discord authentication answers:

```txt
Who is this Discord user?
```

Discord guild and role checks answer:

```txt
Is this Discord user allowed into this Laravel app?
What app-level role or permissions should this user have?
```

A user should only be allowed into the Laravel app when:

1. They successfully authenticate with Discord.
2. Their Discord account belongs to the configured private Discord server/guild.
3. They have one of the configured allowed Discord role IDs, if role-based access is required.

Use Discord IDs, guild IDs, and role IDs as the source of truth.

Do not rely on Discord usernames, display names, or role names for authorization.

## Preferred Auth Flow

1. User clicks **Continue with Discord**.
2. Laravel redirects the user to Discord OAuth.
3. User authorizes the Discord application.
4. Discord redirects back to Laravel at `/auth/discord/callback`.
5. Laravel receives the Discord user profile through Socialite.
6. Laravel checks whether the Discord user belongs to the configured private Discord guild.
7. Laravel checks whether the user has one of the configured allowed Discord role IDs.
8. If the user is not a member of the guild, deny login.
9. If the user does not have an allowed role, deny login.
10. If the user is authorized, create or update a local `users` record using `discord_id` as the stable identity key.
11. Laravel maps the Discord role IDs to local Laravel roles/permissions if needed.
12. Laravel logs the user in with normal session authentication using `Auth::login()`.

## Recommended File Location

Place this file here:

```txt
.codex/context/authentication-discord-laravel.md
```

If the project later has multiple authentication strategies, this may be moved into a nested folder:

```txt
.codex/context/authentication/discord-laravel.md
```

If using the current flat `.codex/context` structure, prefer the first option.

## Packages

Install these packages:

```bash
./vendor/bin/sail composer require laravel/socialite
./vendor/bin/sail composer require socialiteproviders/discord
```

## Discord Developer Portal Setup

Create an application in the Discord Developer Portal.

Configure the OAuth2 redirect URI to exactly match the Laravel callback URL.

Local example:

```txt
http://localhost/auth/discord/callback
```

Production example:

```txt
https://example.com/auth/discord/callback
```

Required OAuth scopes for normal authentication and current-user guild role checking:

```txt
identify email guilds.members.read
```

Use `identify` to retrieve the user’s Discord identity.

Use `email` only if the app needs the user’s email address. Do not assume email will always be available.

Use `guilds.members.read` so the app can retrieve the authenticated user’s member object for the configured guild, including their role IDs.

Do not request unnecessary scopes.

## Discord Server Requirements

The app is tied to one private Discord server/guild.

The following IDs must be collected from Discord:

```txt
Discord application client ID
Discord application client secret
Discord guild/server ID
Allowed Discord role IDs
Optional admin/moderator/member role IDs for local app role mapping
```

Enable Discord Developer Mode to copy IDs from Discord.

Recommended Discord values to track:

```txt
Guild ID
Admin role ID
Moderator role ID
Member role ID
Any paid/private-access role IDs
```

Role IDs should be stored and checked as IDs, not names. Role names can change.

## Environment Variables

Add these values to `.env`:

```env
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_REDIRECT_URI="${APP_URL}/auth/discord/callback"

DISCORD_GUILD_ID=
DISCORD_ALLOWED_ROLE_IDS=
DISCORD_ADMIN_ROLE_ID=
DISCORD_MODERATOR_ROLE_ID=
DISCORD_MEMBER_ROLE_ID=
```

`DISCORD_ALLOWED_ROLE_IDS` should be a comma-separated list:

```env
DISCORD_ALLOWED_ROLE_IDS=123456789012345678,987654321098765432
```

Make sure `APP_URL` matches the environment.

Local example:

```env
APP_URL=http://localhost
```

Local custom port example:

```env
APP_URL=http://localhost:8080
```

Production example:

```env
APP_URL=https://example.com
```

## Services Config

File: `config/services.php`

```php
'discord' => [
    'client_id' => env('DISCORD_CLIENT_ID'),
    'client_secret' => env('DISCORD_CLIENT_SECRET'),
    'redirect' => env('DISCORD_REDIRECT_URI'),

    'guild_id' => env('DISCORD_GUILD_ID'),
    'allowed_role_ids' => env('DISCORD_ALLOWED_ROLE_IDS'),

    'roles' => [
        'admin' => env('DISCORD_ADMIN_ROLE_ID'),
        'moderator' => env('DISCORD_MODERATOR_ROLE_ID'),
        'member' => env('DISCORD_MEMBER_ROLE_ID'),
    ],
],
```

## Provider Registration

File: `app/Providers/AppServiceProvider.php`

For Laravel 11+ projects, register the Discord Socialite provider in `AppServiceProvider`.

```php
<?php

namespace App\Providers;

use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use SocialiteProviders\Discord\DiscordExtendSocialite;
use SocialiteProviders\Manager\SocialiteWasCalled;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Event::listen(function (SocialiteWasCalled $event) {
            $event->extendSocialite('discord', DiscordExtendSocialite::class);
        });
    }
}
```

If the app already has an `AppServiceProvider`, merge only the imports and the `Event::listen()` call. Do not overwrite unrelated boot logic.

## Database Fields

Use `discord_id` as the primary external identity key.

Recommended user columns:

```php
$table->string('discord_id')->nullable()->unique();
$table->string('discord_username')->nullable();
$table->string('discord_global_name')->nullable();
$table->string('discord_avatar')->nullable();
$table->json('discord_role_ids')->nullable();
$table->timestamp('discord_roles_synced_at')->nullable();
```

If Discord is the only authentication method, consider whether `email` and `password` should be nullable.

Do not rely on Discord username as the unique identity. Discord usernames and display names can change.

Do not rely on role names. Store role IDs.

## Example Migration

File: `database/migrations/YYYY_MM_DD_HHMMSS_add_discord_fields_to_users_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('discord_id')->nullable()->unique()->after('id');
            $table->string('discord_username')->nullable()->after('discord_id');
            $table->string('discord_global_name')->nullable()->after('discord_username');
            $table->string('discord_avatar')->nullable()->after('discord_global_name');
            $table->json('discord_role_ids')->nullable()->after('discord_avatar');
            $table->timestamp('discord_roles_synced_at')->nullable()->after('discord_role_ids');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'discord_id',
                'discord_username',
                'discord_global_name',
                'discord_avatar',
                'discord_role_ids',
                'discord_roles_synced_at',
            ]);
        });
    }
};
```

Run:

```bash
./vendor/bin/sail artisan migrate
```

## User Model

File: `app/Models/User.php`

Add Discord fields to `$fillable` if the project uses mass assignment:

```php
protected $fillable = [
    'name',
    'email',
    'password',
    'discord_id',
    'discord_username',
    'discord_global_name',
    'discord_avatar',
    'discord_role_ids',
    'discord_roles_synced_at',
];
```

Add casts:

```php
protected function casts(): array
{
    return [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'discord_role_ids' => 'array',
        'discord_roles_synced_at' => 'datetime',
    ];
}
```

## Routes

File: `routes/web.php`

```php
use App\Http\Controllers\Auth\DiscordAuthController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('/auth/discord/redirect', [DiscordAuthController::class, 'redirect'])
        ->name('discord.redirect');

    Route::get('/auth/discord/callback', [DiscordAuthController::class, 'callback'])
        ->name('discord.callback');
});
```

## Discord Member Lookup

After OAuth succeeds, call Discord's current-user guild member endpoint for the configured guild:

```txt
GET /users/@me/guilds/{guild.id}/member
```

This requires the authenticated user's OAuth access token and the `guilds.members.read` scope.

The response includes a member object with a `roles` array containing Discord role IDs.

Use that `roles` array to decide whether the user may access the Laravel app.

## Controller

File: `app/Http/Controllers/Auth/DiscordAuthController.php`

```php
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class DiscordAuthController extends Controller
{
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('discord')
            ->scopes(['identify', 'email', 'guilds.members.read'])
            ->redirect();
    }

    public function callback(): RedirectResponse
    {
        $discordUser = Socialite::driver('discord')->user();

        try {
            $member = $this->fetchGuildMember($discordUser->token);
        } catch (RequestException $exception) {
            return redirect()
                ->route('login')
                ->withErrors([
                    'discord' => 'Your Discord account is not a member of the required server.',
                ]);
        }

        $discordRoleIds = collect($member['roles'] ?? [])
            ->map(fn (string $roleId) => trim($roleId))
            ->filter()
            ->values();

        if (! $this->hasAllowedRole($discordRoleIds)) {
            return redirect()
                ->route('login')
                ->withErrors([
                    'discord' => 'Your Discord account does not have the required server role.',
                ]);
        }

        $user = User::updateOrCreate(
            [
                'discord_id' => $discordUser->getId(),
            ],
            [
                'name' => $this->resolveName($discordUser),
                'email' => $discordUser->getEmail(),
                'discord_username' => $discordUser->getNickname(),
                'discord_global_name' => data_get($discordUser->user, 'global_name'),
                'discord_avatar' => $discordUser->getAvatar(),
                'discord_role_ids' => $discordRoleIds->all(),
                'discord_roles_synced_at' => now(),
                'password' => bcrypt(Str::random(32)),
            ]
        );

        $this->syncLocalRoleFromDiscord($user, $discordRoleIds);

        Auth::login($user, remember: true);

        request()->session()->regenerate();

        return redirect()->intended(route('dashboard'));
    }

    private function fetchGuildMember(string $accessToken): array
    {
        $guildId = config('services.discord.guild_id');

        return Http::withToken($accessToken)
            ->acceptJson()
            ->get("https://discord.com/api/users/@me/guilds/{$guildId}/member")
            ->throw()
            ->json();
    }

    private function hasAllowedRole(Collection $discordRoleIds): bool
    {
        $allowedRoleIds = collect(explode(',', (string) config('services.discord.allowed_role_ids')))
            ->map(fn (string $roleId) => trim($roleId))
            ->filter();

        return $discordRoleIds->intersect($allowedRoleIds)->isNotEmpty();
    }

    private function syncLocalRoleFromDiscord(User $user, Collection $discordRoleIds): void
    {
        $roleMap = collect(config('services.discord.roles'))
            ->filter();

        $localRole = match (true) {
            $discordRoleIds->contains($roleMap->get('admin')) => 'admin',
            $discordRoleIds->contains($roleMap->get('moderator')) => 'moderator',
            $discordRoleIds->contains($roleMap->get('member')) => 'member',
            default => 'user',
        };

        if ($user->isFillable('role')) {
            $user->forceFill([
                'role' => $localRole,
            ])->save();
        }
    }

    private function resolveName(mixed $discordUser): string
    {
        return data_get($discordUser->user, 'global_name')
            ?: $discordUser->getName()
            ?: $discordUser->getNickname()
            ?: 'Discord User';
    }
}
```

## Role Mapping

Discord roles should be mapped by ID.

Example:

```txt
Discord Admin role ID -> Laravel admin
Discord Moderator role ID -> Laravel moderator
Discord Member role ID -> Laravel member
```

The app should not check for role names like:

```txt
Admin
Moderator
Premium Member
```

Role names can change. Role IDs are stable.

If the Laravel app uses a permissions package such as Spatie Laravel Permission, map Discord role IDs to the package's local roles after the Discord role check succeeds.

Example concept:

```php
if ($discordRoleIds->contains(config('services.discord.roles.admin'))) {
    $user->syncRoles(['admin']);
} elseif ($discordRoleIds->contains(config('services.discord.roles.moderator'))) {
    $user->syncRoles(['moderator']);
} else {
    $user->syncRoles(['member']);
}
```

Only add package-specific code if that package is already installed or is part of the implementation task.

## Email Handling

Discord email may be unavailable even when the `email` scope is requested.

Preferred approach for Discord-primary apps:

1. Make `users.email` nullable.
2. Use `discord_id` as the required unique identifier.
3. Ask the user to add an email later only if the app needs email notifications.

Avoid fake placeholder emails unless the existing app architecture requires `email` to be non-null.

If using placeholder emails temporarily, mark them clearly and avoid sending mail to them.

Example placeholder pattern:

```php
'email' => $discordUser->getEmail() ?: 'discord_'.$discordUser->getId().'@example.local',
```

## Frontend Login Button

For Laravel Breeze with React/Inertia, add a direct link to the redirect route.

Example:

```tsx
<a
    href={route('discord.redirect')}
    className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
>
    Continue with Discord
</a>
```

## Optional: Bot-Backed Role Checks

OAuth with `guilds.members.read` is enough when the app only needs to check the currently logging-in user.

Use a Discord bot if the app needs to:

1. Re-check a user's roles without requiring them to log in again.
2. Sync all server members.
3. Read other users' roles.
4. Assign or remove Discord roles.
5. Build admin tools around Discord membership.
6. Keep Laravel permissions in sync when Discord roles change.

For the initial implementation, prefer OAuth-based current-user role checks unless the feature requires background syncing or role management.

## Authorization Failures

If the user is not in the configured Discord server:

```txt
Your Discord account is not a member of the required server.
```

If the user is in the server but lacks an allowed role:

```txt
Your Discord account does not have the required server role.
```

Do not create a local user account unless the user passes membership and role checks.

## Testing Notes

When adding tests, prefer Pest.

Test the following:

1. Guest can be redirected to Discord.
2. Callback fetches the authenticated user's guild member record.
3. Callback denies login when the user is not in the configured guild.
4. Callback denies login when the user does not have an allowed Discord role.
5. Callback creates a user when the Discord user is in the guild and has an allowed role.
6. Callback updates an existing user when `discord_id` already exists.
7. User is authenticated after successful callback.
8. Callback handles a missing Discord email without failing.
9. Discord role IDs are stored on the user.
10. Local Laravel role mapping works from Discord role IDs.
11. Existing Laravel auth flows are not broken unless the project intentionally removes password login.

Use Socialite and HTTP fakes or mocks rather than making live Discord API calls in automated tests.

## Example Pest Test Scenarios

Use these as implementation guidance, not necessarily exact copy/paste code.

```php
it('denies login when discord user is not in the required guild', function () {
    // Mock Socialite to return a Discord user.
    // Fake Discord member lookup to return 404 or 403.
    // Assert the user is redirected to login with an error.
    // Assert no local user was created.
});

it('denies login when discord user lacks an allowed role', function () {
    // Mock Socialite to return a Discord user.
    // Fake Discord member lookup with roles that do not intersect allowed role IDs.
    // Assert the user is redirected to login with an error.
    // Assert no local user was created.
});

it('creates and authenticates user when discord user has an allowed role', function () {
    // Mock Socialite to return a Discord user.
    // Fake Discord member lookup with at least one allowed role ID.
    // Assert user exists with discord_id.
    // Assert user is authenticated.
});
```

## Security Rules

- Do not store the Discord client secret in source control.
- Do not expose Discord access tokens to the frontend.
- Do not store Discord access tokens unless the app needs to call Discord APIs later on the user’s behalf.
- Use HTTPS in production.
- Use `discord_id` as the stable identity key.
- Use Discord guild/server ID to verify membership.
- Use Discord role IDs to authorize access.
- Do not rely on Discord usernames, display names, or role names for authorization.
- Regenerate the session after login.
- Keep requested scopes minimal.
- Do not request privileged or unrelated Discord scopes unless the feature explicitly requires them.
- Do not require Discord Nitro. Nitro is unrelated to OAuth login.
- Deny login before creating a local user if guild membership or role checks fail.

## Completion Criteria

A Discord authentication implementation is complete when:

1. The Discord OAuth app exists and has the correct callback URL.
2. `.env` contains `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, and `DISCORD_REDIRECT_URI`.
3. `.env` contains `DISCORD_GUILD_ID`.
4. `.env` contains `DISCORD_ALLOWED_ROLE_IDS` if role-based access is required.
5. `config/services.php` contains the Discord provider config and guild/role config.
6. `AppServiceProvider` registers the Discord Socialite provider.
7. The users table stores `discord_id`.
8. The users table can store Discord role IDs.
9. Login routes exist for redirect and callback.
10. The callback requests `identify`, `email`, and `guilds.members.read`.
11. The callback fetches the authenticated user's guild member record.
12. The callback denies login when the user is not in the configured guild.
13. The callback denies login when the user lacks an allowed role.
14. The callback creates or updates the user by `discord_id` after authorization passes.
15. The app maps Discord role IDs to local Laravel permissions if needed.
16. The user is logged in using Laravel session authentication.
17. Missing Discord email is handled safely.
18. Tests cover user creation, existing user login, missing email, missing guild membership, and missing role access.

## Project Brief Pointer

Add a short pointer to `.codex/context/project-brief.md` or `.codex/README.md`:

```md
## Authentication

This project uses Discord as the primary authentication provider.

When implementing auth, read:

- `.codex/context/authentication-discord-laravel.md`

Users must authenticate through Discord and belong to the configured private Discord server/guild. App access is authorized by Discord role IDs from that server.
```
