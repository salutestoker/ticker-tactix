<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Support\CatalogRichText;
use App\Support\SeoMetadata;
use Inertia\Inertia;
use Inertia\Response;

class ModuleController extends Controller
{
    public function index(): Response
    {
        $modules = Module::public()->with(['market', 'traderTypes'])->ordered()->get();
        CatalogRichText::renderModules($modules);

        return Inertia::render('Modules/Index', [
            'modules' => $modules,
        ])->withViewData(SeoMetadata::staticPage(
            title: 'Modules - Ticker-Tactix',
            description: 'Specialized components that power the Ticker-Tactix system by organizing market context, trend, participation, and structure.',
            imagePath: '/design/assets/images/bg-modules.jpg',
            imageAlt: 'Ticker-Tactix module matrix hero artwork.',
        )->toViewData());
    }

    public function show(Module $module): Response
    {
        abort_unless($module->is_active && $module->published_at, 404);

        $module->load(['market', 'traderTypes']);
        CatalogRichText::renderModule($module);

        return Inertia::render('Modules/Show', [
            'module' => $module,
            'relatedModules' => $module->relatedModules()
                ->public()
                ->with(['market', 'traderTypes'])
                ->ordered()
                ->get(),
        ])->withViewData(SeoMetadata::forModule($module)->toViewData());
    }
}
