<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Models\Playbook;
use App\Models\TraderType;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function home(): Response
    {
        return Inertia::render('Home', [
            'modules' => Module::public()->with(['market', 'traderTypes'])->ordered()->get(),
            'playbooks' => Playbook::public()->with(['market', 'traderTypes'])->ordered()->get(),
            'featuredPlaybooks' => Playbook::public()->with(['market', 'traderTypes'])->where('is_featured', true)->ordered()->get(),
        ]);
    }

    public function about(): Response
    {
        return Inertia::render('About');
    }

    public function traderTypes(): Response
    {
        return Inertia::render('TraderTypes', [
            'traderTypes' => TraderType::active()
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
                ->get(),
        ]);
    }

    public function testimonials(): Response
    {
        return Inertia::render('Testimonials');
    }

    public function contact(): Response
    {
        return Inertia::render('Contact');
    }

    public function legal(string $page): Response
    {
        $pages = [
            'terms-of-service' => 'Terms of Service',
            'membership-agreement' => 'Membership Agreement',
            'privacy-policy' => 'Privacy Policy',
            'risk-disclaimer' => 'Risk Disclaimer',
        ];

        abort_unless(isset($pages[$page]), 404);

        return Inertia::render('Legal/Show', [
            'title' => $pages[$page],
            'slug' => $page,
        ]);
    }
}
