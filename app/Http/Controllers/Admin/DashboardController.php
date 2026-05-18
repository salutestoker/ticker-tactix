<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Market;
use App\Models\Module;
use App\Models\Playbook;
use App\Models\TraderType;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'modules' => Module::count(),
                'playbooks' => Playbook::count(),
                'markets' => Market::count(),
                'traderTypes' => TraderType::count(),
                'drafts' => Module::whereNull('published_at')->count() + Playbook::whereNull('published_at')->count(),
            ],
            'recentModules' => Module::with(['market', 'traderTypes'])->latest()->take(5)->get(),
            'recentPlaybooks' => Playbook::with(['market', 'traderTypes'])->latest()->take(5)->get(),
        ]);
    }
}
