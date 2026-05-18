<?php

namespace App\Http\Controllers;

use App\Models\Module;
use Inertia\Inertia;
use Inertia\Response;

class ModuleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Modules/Index', [
            'modules' => Module::public()->with(['market', 'traderTypes'])->ordered()->get(),
        ]);
    }

    public function show(Module $module): Response
    {
        abort_unless($module->is_active && $module->published_at, 404);

        return Inertia::render('Modules/Show', [
            'module' => $module->load(['market', 'traderTypes']),
            'relatedModules' => $module->relatedModules()
                ->public()
                ->with(['market', 'traderTypes'])
                ->ordered()
                ->get(),
        ]);
    }
}
