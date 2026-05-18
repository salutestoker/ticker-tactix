<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AccessLevel;
use App\Http\Controllers\Controller;
use App\Models\Market;
use App\Models\Module;
use App\Models\TraderType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ModuleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Modules/Index', [
            'modules' => Module::with(['market', 'traderTypes'])->ordered()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Modules/Form', [
            'module' => null,
            'markets' => Market::active()->ordered()->get(),
            'traderTypes' => TraderType::active()->ordered()->get(),
            'modules' => Module::ordered()->get(['id', 'title', 'slug']),
            'accessOptions' => AccessLevel::options(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $module = Module::create(Arr::except($data, ['trader_type_ids', 'related_module_ids']));

        $module->traderTypes()->sync($data['trader_type_ids']);
        $module->relatedModules()->sync($data['related_module_ids'] ?? []);

        return redirect()->route('admin.modules.index')->with('success', 'Module created.');
    }

    public function edit(Module $module): Response
    {
        return Inertia::render('Admin/Modules/Form', [
            'module' => $module->load(['market', 'traderTypes', 'relatedModules']),
            'markets' => Market::active()->ordered()->get(),
            'traderTypes' => TraderType::active()->ordered()->get(),
            'modules' => Module::whereKeyNot($module->id)->ordered()->get(['id', 'title', 'slug']),
            'accessOptions' => AccessLevel::options(),
        ]);
    }

    public function update(Request $request, Module $module): RedirectResponse
    {
        $data = $this->validated($request, $module);

        $module->update(Arr::except($data, ['trader_type_ids', 'related_module_ids']));
        $module->traderTypes()->sync($data['trader_type_ids']);
        $module->relatedModules()->sync($data['related_module_ids'] ?? []);

        return redirect()->route('admin.modules.index')->with('success', 'Module updated.');
    }

    public function destroy(Module $module): RedirectResponse
    {
        $module->delete();

        return redirect()->route('admin.modules.index')->with('success', 'Module archived.');
    }

    private function validated(Request $request, ?Module $module = null): array
    {
        $data = $request->validate([
            'market_id' => ['required', 'exists:markets,id'],
            'trader_type_ids' => ['required', 'array', 'min:1'],
            'trader_type_ids.*' => ['integer', 'exists:trader_types,id'],
            'related_module_ids' => ['nullable', 'array'],
            'related_module_ids.*' => [
                'integer',
                'exists:modules,id',
                $module ? Rule::notIn([$module->id]) : 'integer',
            ],
            'icon' => ['nullable', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('modules', 'slug')->ignore($module)],
            'description' => ['nullable', 'string'],
            'version' => ['nullable', 'numeric', 'min:0'],
            'access' => ['required', Rule::enum(AccessLevel::class)],
            'action_label' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['required', 'integer', 'min:0'],
            'is_featured' => ['required', 'boolean'],
            'is_active' => ['required', 'boolean'],
            'published_at' => ['nullable', 'date'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
        ]);

        $data['slug'] = $data['slug'] ?: Str::slug($data['title']);
        $data['related_module_ids'] = array_values(array_unique($data['related_module_ids'] ?? []));

        return $data;
    }
}
