<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureWelcomePageAccess
{
    private const SESSION_KEY = 'stripe_welcome_access_expires_at';

    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()?->is_admin || $this->hasActiveSessionAccess($request)) {
            return $next($request);
        }

        if ($this->hasStripeReferrer($request)) {
            $request->session()->put(
                self::SESSION_KEY,
                now()->addDay()->timestamp,
            );

            return $next($request);
        }

        abort(404);
    }

    private function hasActiveSessionAccess(Request $request): bool
    {
        $expiresAt = $request->session()->get(self::SESSION_KEY);

        return is_numeric($expiresAt) && (int) $expiresAt >= now()->timestamp;
    }

    private function hasStripeReferrer(Request $request): bool
    {
        $referrer = $request->headers->get('referer');

        if (! is_string($referrer) || $referrer === '') {
            return false;
        }

        $host = parse_url($referrer, PHP_URL_HOST);

        if (! is_string($host)) {
            return false;
        }

        $host = strtolower($host);

        return $host === 'stripe.com' || str_ends_with($host, '.stripe.com');
    }
}
