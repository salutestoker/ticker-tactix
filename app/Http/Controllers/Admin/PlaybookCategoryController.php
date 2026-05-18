<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PlaybookCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PlaybookCategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/PlaybookCategories/Index', [
            'categories' => PlaybookCategory::withCount(['modules', 'playbooks'])->ordered()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/PlaybookCategories/Form', [
            'category' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        PlaybookCategory::create($this->validated($request));

        return redirect()->route('admin.playbook-categories.index')->with('success', 'Category created.');
    }

    public function edit(PlaybookCategory $playbookCategory): Response
    {
        return Inertia::render('Admin/PlaybookCategories/Form', [
            'category' => $playbookCategory,
        ]);
    }

    public function update(Request $request, PlaybookCategory $playbookCategory): RedirectResponse
    {
        $playbookCategory->update($this->validated($request, $playbookCategory));

        return redirect()->route('admin.playbook-categories.index')->with('success', 'Category updated.');
    }

    public function destroy(PlaybookCategory $playbookCategory): RedirectResponse
    {
        $playbookCategory->delete();

        return redirect()->route('admin.playbook-categories.index')->with('success', 'Category archived.');
    }

    private function validated(Request $request, ?PlaybookCategory $category = null): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('playbook_categories', 'slug')->ignore($category)],
            'description' => ['nullable', 'string'],
            'icon' => ['nullable', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['required', 'integer', 'min:0'],
            'is_active' => ['required', 'boolean'],
        ]);

        $data['slug'] = $data['slug'] ?: Str::slug($data['name']);

        return $data;
    }
}
