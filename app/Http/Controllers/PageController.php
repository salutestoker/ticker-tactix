<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Models\Playbook;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function home(): Response
    {
        return Inertia::render('Home', [
            'modules' => Module::public()->with(['market', 'traderTypes'])->ordered()->get(),
            'featuredModules' => Module::public()->with(['market', 'traderTypes'])->where('is_featured', true)->ordered()->take(3)->get(),
            'playbooks' => Playbook::public()->with(['market', 'traderTypes'])->ordered()->get(),
            'featuredPlaybooks' => Playbook::public()->with(['market', 'traderTypes'])->where('is_featured', true)->ordered()->get(),
        ]);
    }

    public function about(): Response
    {
        return Inertia::render('About');
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
            'financial-disclaimer' => 'Financial Disclaimer',
        ];

        abort_unless(isset($pages[$page]), 404);

        return Inertia::render('Legal/Show', [
            'title' => $pages[$page],
            'slug' => $page,
        ]);
    }
}
