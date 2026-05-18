<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Market;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class MarketController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Markets/Index', [
            'markets' => Market::withCount(['modules', 'playbooks'])->ordered()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Markets/Form', [
            'market' => null,
            'colorOptions' => $this->colorOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Market::create($this->validated($request));

        return redirect()->route('admin.markets.index')->with('success', 'Market created.');
    }

    public function edit(Market $market): Response
    {
        return Inertia::render('Admin/Markets/Form', [
            'market' => $market,
            'colorOptions' => $this->colorOptions(),
        ]);
    }

    public function update(Request $request, Market $market): RedirectResponse
    {
        $market->update($this->validated($request, $market));

        return redirect()->route('admin.markets.index')->with('success', 'Market updated.');
    }

    public function destroy(Market $market): RedirectResponse
    {
        $market->delete();

        return redirect()->route('admin.markets.index')->with('success', 'Market archived.');
    }

    private function validated(Request $request, ?Market $market = null): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('markets', 'slug')->ignore($market)],
            'description' => ['nullable', 'string'],
            'color' => ['nullable', 'string', Rule::in(array_column($this->colorOptions(), 'value'))],
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
}
