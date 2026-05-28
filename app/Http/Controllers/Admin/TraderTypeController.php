<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TraderType;
use App\Services\CatalogSpreadsheetSyncService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TraderTypeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/TraderTypes/Index', [
            'traderTypes' => TraderType::withCount(['modules', 'playbooks'])->ordered()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/TraderTypes/Form', [
            'traderType' => null,
            'colorOptions' => $this->colorOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        TraderType::create($this->validated($request));
        $this->exportCatalogSpreadsheets();

        return redirect()->route('admin.trader-types.index')->with('success', 'Trader type created.');
    }

    public function edit(TraderType $traderType): Response
    {
        return Inertia::render('Admin/TraderTypes/Form', [
            'traderType' => $traderType,
            'colorOptions' => $this->colorOptions(),
        ]);
    }

    public function update(Request $request, TraderType $traderType): RedirectResponse
    {
        $traderType->update($this->validated($request, $traderType));
        $this->exportCatalogSpreadsheets();

        return redirect()->route('admin.trader-types.index')->with('success', 'Trader type updated.');
    }

    public function destroy(TraderType $traderType): RedirectResponse
    {
        $traderType->delete();
        $this->exportCatalogSpreadsheets();

        return redirect()->route('admin.trader-types.index')->with('success', 'Trader type archived.');
    }

    private function validated(Request $request, ?TraderType $traderType = null): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('trader_types', 'slug')->ignore($traderType)],
            'description' => ['nullable', 'string'],
            'color' => ['nullable', 'string', Rule::in(array_column($this->colorOptions(), 'value'))],
            'icon' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['required', 'integer', 'min:0'],
            'is_active' => ['required', 'boolean'],
        ]);

        $data['slug'] = $data['slug'] ?: Str::slug($data['name']);

        return $data;
    }

    /**
     * @return list<array{label: string, value: string}>
     */
    private function colorOptions(): array
    {
        return [
            ['label' => 'Brand Violet', 'value' => 'violet-light'],
            ['label' => 'Brand Seafoam Green', 'value' => 'seafoam-green'],
            ['label' => 'Brand Gold', 'value' => 'gold'],
            ['label' => 'Brand Blue', 'value' => 'main-blue'],
        ];
    }

    private function exportCatalogSpreadsheets(): void
    {
        app(CatalogSpreadsheetSyncService::class)->exportAll();
    }
}
