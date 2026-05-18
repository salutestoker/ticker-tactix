<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AccessLevel;
use App\Http\Controllers\Controller;
use App\Models\Market;
use App\Models\Playbook;
use App\Models\TraderType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PlaybookController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Playbooks/Index', [
            'playbooks' => Playbook::with(['market', 'traderTypes'])->ordered()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Playbooks/Form', [
            'playbook' => null,
            'markets' => Market::active()->ordered()->get(),
            'traderTypes' => TraderType::active()->ordered()->get(),
            'accessOptions' => AccessLevel::options(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $playbook = Playbook::create(Arr::except($data, ['trader_type_ids']));

        $playbook->traderTypes()->sync($data['trader_type_ids']);

        return redirect()->route('admin.playbooks.index')->with('success', 'Playbook created.');
    }

    public function edit(Playbook $playbook): Response
    {
        return Inertia::render('Admin/Playbooks/Form', [
            'playbook' => $playbook->load(['market', 'traderTypes']),
            'markets' => Market::active()->ordered()->get(),
            'traderTypes' => TraderType::active()->ordered()->get(),
            'accessOptions' => AccessLevel::options(),
        ]);
    }

    public function update(Request $request, Playbook $playbook): RedirectResponse
    {
        $data = $this->validated($request, $playbook);

        $playbook->update(Arr::except($data, ['trader_type_ids']));
        $playbook->traderTypes()->sync($data['trader_type_ids']);

        return redirect()->route('admin.playbooks.index')->with('success', 'Playbook updated.');
    }

    public function destroy(Playbook $playbook): RedirectResponse
    {
        $playbook->delete();

        return redirect()->route('admin.playbooks.index')->with('success', 'Playbook archived.');
    }

    private function validated(Request $request, ?Playbook $playbook = null): array
    {
        $data = $request->validate([
            'market_id' => ['required', 'exists:markets,id'],
            'trader_type_ids' => ['required', 'array', 'min:1'],
            'trader_type_ids.*' => ['integer', 'exists:trader_types,id'],
            'icon' => ['nullable', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('playbooks', 'slug')->ignore($playbook)],
            'access' => ['required', Rule::enum(AccessLevel::class)],
            'best_for' => ['nullable', 'string'],
            'trading_pace' => ['nullable', 'string', 'max:255'],
            'average_hold_time' => ['nullable', 'string', 'max:255'],
            'price' => ['nullable', 'string', 'max:255'],
            'action_label' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['required', 'integer', 'min:0'],
            'is_featured' => ['required', 'boolean'],
            'is_active' => ['required', 'boolean'],
            'published_at' => ['nullable', 'date'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
        ]);

        $data['slug'] = $data['slug'] ?: Str::slug($data['title']);

        return $data;
    }
}
