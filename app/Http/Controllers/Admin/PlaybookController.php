<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Playbook;
use App\Models\PlaybookCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PlaybookController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Playbooks/Index', [
            'playbooks' => Playbook::with('category')->ordered()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Playbooks/Form', [
            'playbook' => null,
            'categories' => PlaybookCategory::ordered()->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Playbook::create($this->validated($request));

        return redirect()->route('admin.playbooks.index')->with('success', 'Playbook created.');
    }

    public function edit(Playbook $playbook): Response
    {
        return Inertia::render('Admin/Playbooks/Form', [
            'playbook' => $playbook->load('category'),
            'categories' => PlaybookCategory::ordered()->get(),
        ]);
    }

    public function update(Request $request, Playbook $playbook): RedirectResponse
    {
        $playbook->update($this->validated($request, $playbook));

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
            'playbook_category_id' => ['required', 'exists:playbook_categories,id'],
            'framework' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('playbooks', 'slug')->ignore($playbook)],
            'access' => ['required', 'string', 'max:255'],
            'market' => ['nullable', 'string', 'max:255'],
            'best_for' => ['nullable', 'string'],
            'average_hold_time' => ['nullable', 'string', 'max:255'],
            'price_cents' => ['nullable', 'integer', 'min:0'],
            'currency' => ['required', 'string', 'size:3'],
            'payment_url' => ['nullable', 'url', 'max:255'],
            'sort_order' => ['required', 'integer', 'min:0'],
            'is_featured' => ['required', 'boolean'],
            'is_active' => ['required', 'boolean'],
            'published_at' => ['nullable', 'date'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
        ]);

        $data['slug'] = $data['slug'] ?: Str::slug($data['framework']);

        return $data;
    }
}
