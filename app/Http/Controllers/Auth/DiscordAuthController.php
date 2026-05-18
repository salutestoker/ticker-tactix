<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
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
        abort_if(blank(config('services.discord.client_id')), 503, 'Discord OAuth is not configured.');

        return Socialite::driver('discord')
            ->scopes(['identify', 'email', 'guilds.members.read'])
            ->redirect();
    }

    public function callback(): RedirectResponse
    {
        abort_if(blank(config('services.discord.guild_id')), 503, 'Discord guild authorization is not configured.');

        $discordUser = Socialite::driver('discord')->user();
        $roleIds = $this->memberRoleIds($discordUser->token);
        $allowedRoleIds = $this->configuredRoleIds('allowed_role_ids');

        if ($allowedRoleIds->isNotEmpty() && $roleIds->intersect($allowedRoleIds)->isEmpty()) {
            return redirect()->route('login')->with('error', 'Your Discord account does not have the required server role.');
        }

        $user = User::updateOrCreate(
            ['discord_id' => (string) $discordUser->getId()],
            [
                'name' => $discordUser->getName() ?: $discordUser->getNickname() ?: 'Discord User',
                'email' => $discordUser->getEmail(),
                'discord_username' => $discordUser->user['username'] ?? null,
                'discord_global_name' => $discordUser->user['global_name'] ?? null,
                'discord_avatar' => $discordUser->getAvatar(),
                'discord_role_ids' => $roleIds->values()->all(),
                'discord_roles_synced_at' => now(),
                'password' => null,
                'is_admin' => $this->isAdmin($roleIds),
            ],
        );

        Auth::login($user, remember: true);
        request()->session()->regenerate();

        return redirect()->intended($user->is_admin ? route('admin.dashboard') : route('dashboard'));
    }

    private function memberRoleIds(string $accessToken): Collection
    {
        $response = Http::withToken($accessToken)
            ->acceptJson()
            ->get(sprintf('https://discord.com/api/users/@me/guilds/%s/member', config('services.discord.guild_id')));

        if ($response->status() === 404 || $response->status() === 403) {
            return collect();
        }

        $response->throw();

        return collect($response->json('roles', []))->map(fn (mixed $roleId) => (string) $roleId);
    }

    private function isAdmin(Collection $roleIds): bool
    {
        $adminRoleId = config('services.discord.roles.admin');

        return filled($adminRoleId) && $roleIds->contains((string) $adminRoleId);
    }

    private function configuredRoleIds(string $key): Collection
    {
        return Str::of((string) config("services.discord.{$key}"))
            ->explode(',')
            ->map(fn (string $roleId) => trim($roleId))
            ->filter()
            ->values();
    }
}
