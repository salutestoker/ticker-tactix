<?php

namespace App\Http\Controllers;

use App\Mail\SupportContactRequestMail;
use App\Models\Faq;
use App\Models\Module;
use App\Models\Playbook;
use App\Models\TraderType;
use App\Support\CatalogRichText;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Symfony\Component\HttpFoundation\Response;

class PageController extends Controller
{
    public function home(): InertiaResponse
    {
        $modules = Module::public()->with(['market', 'traderTypes'])->ordered()->get();
        $playbooks = Playbook::public()->with(['market', 'traderTypes'])->ordered()->get();
        $featuredPlaybooks = Playbook::public()->with(['market', 'traderTypes'])->where('is_featured', true)->ordered()->get();

        CatalogRichText::renderModules($modules);
        CatalogRichText::renderPlaybooks($playbooks);
        CatalogRichText::renderPlaybooks($featuredPlaybooks);

        return Inertia::render('Home', [
            'modules' => $modules,
            'playbooks' => $playbooks,
            'featuredPlaybooks' => $featuredPlaybooks,
            'traderTypes' => $this->activeTraderTypes(),
        ]);
    }

    public function system(): InertiaResponse
    {
        return Inertia::render('System');
    }

    public function traderTypes(): InertiaResponse
    {
        return Inertia::render('TraderTypes', [
            'traderTypes' => $this->activeTraderTypes(),
        ]);
    }

    public function contact(): InertiaResponse
    {
        return Inertia::render('Contact');
    }

    public function faq(Request $request): Response
    {
        $response = Inertia::render('Faq', [
            'faqs' => Faq::ordered()->get(),
        ])
            ->withViewData('seoRobots', 'noindex, nofollow, noarchive')
            ->toResponse($request);

        $response->headers->set('X-Robots-Tag', 'noindex, nofollow, noarchive');

        return $response;
    }

    public function sendContact(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'checkout_name' => ['required', 'string', 'max:255'],
            'subscription_email' => ['required', 'string', 'email', 'max:255'],
            'tradingview_username' => ['required', 'string', 'max:255'],
            'subscription_date' => ['required', 'date'],
            'issue' => ['required', 'string', 'max:4000'],
        ]);

        Mail::to($this->supportRecipients())->send(new SupportContactRequestMail($data));

        return back()->with('success', 'Support request sent. We will review your onboarding details.');
    }

    public function welcome(): InertiaResponse
    {
        return Inertia::render('Welcome');
    }

    public function legal(string $page): InertiaResponse
    {
        $pages = [
            'terms-of-service' => 'Terms of Service',
            'membership-agreement' => 'Membership Agreement',
            'privacy-policy' => 'Privacy Policy',
            'financial-disclaimer' => 'Financial Disclaimer',
        ];

        abort_unless(isset($pages[$page]), 404);

        return Inertia::render('Legal/Show', [
            'title' => $pages[$page],
            'slug' => $page,
        ]);
    }

    private function activeTraderTypes()
    {
        $traderTypes = TraderType::active()
            ->with([
                'modules' => fn ($query) => $query
                    ->where('modules.is_active', true)
                    ->with('market')
                    ->ordered(),
                'playbooks' => fn ($query) => $query
                    ->where('playbooks.is_active', true)
                    ->with('market')
                    ->ordered(),
            ])
            ->ordered()
            ->get();

        CatalogRichText::renderTraderTypeCatalog($traderTypes);

        return $traderTypes;
    }

    /**
     * @return non-empty-list<array{email: string, name?: string}>
     */
    private function supportRecipients(): array
    {
        $addresses = collect(preg_split('/[\s,;]+/', (string) config('mail.support.address', '')) ?: [])
            ->map(fn (string $email): string => trim($email))
            ->filter(fn (string $email): bool => filter_var($email, FILTER_VALIDATE_EMAIL) !== false)
            ->unique(fn (string $email): string => strtolower($email))
            ->values();

        if ($addresses->isEmpty()) {
            $addresses = collect(['tickertactix@gmail.com']);
        }

        $supportName = trim((string) config('mail.support.name', 'Ticker-Tactix Support'));

        return $addresses
            ->map(fn (string $email, int $index): array => [
                'email' => $email,
                ...($index === 0 && $supportName !== '' ? ['name' => $supportName] : []),
            ])
            ->all();
    }
}
