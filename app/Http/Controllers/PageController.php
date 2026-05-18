<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Models\Playbook;
use App\Models\PlaybookCategory;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function home(): Response
    {
        return Inertia::render('Home', [
            'categories' => PlaybookCategory::active()->ordered()->get(),
            'modules' => Module::public()->with('category')->ordered()->get(),
            'featuredModules' => Module::public()->with('category')->where('is_featured', true)->ordered()->take(3)->get(),
            'playbooks' => Playbook::public()->with('category')->ordered()->get(),
            'featuredPlaybooks' => Playbook::public()->with('category')->where('is_featured', true)->ordered()->get(),
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
