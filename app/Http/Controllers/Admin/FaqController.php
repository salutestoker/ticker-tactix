<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class FaqController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Faqs/Index', [
            'faqs' => Faq::ordered()->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data['sort_order'] = $this->nextSortOrder();

        Faq::create($data);

        return redirect()->route('admin.faqs.index')->with('success', 'FAQ created.');
    }

    public function update(Request $request, Faq $faq): RedirectResponse
    {
        $faq->update($this->validated($request));

        return back()->with('success', 'FAQ updated.');
    }

    public function destroy(Faq $faq): RedirectResponse
    {
        $faq->delete();

        return back()->with('success', 'FAQ deleted.');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'ordered_ids' => ['required', 'array', 'min:1'],
            'ordered_ids.*' => ['integer', 'distinct', 'exists:faqs,id'],
        ]);

        $orderedIds = array_values(array_unique($data['ordered_ids']));
        $faqs = Faq::whereKey($orderedIds)->get()->keyBy('id');

        abort_if($faqs->count() !== count($orderedIds), 422, 'Unable to reorder FAQs.');

        DB::transaction(function () use ($orderedIds, $faqs): void {
            foreach ($orderedIds as $index => $id) {
                $faqs[$id]->updateQuietly(['sort_order' => $index]);
            }
        });

        return back()->with('success', 'FAQ order updated.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'question' => ['required', 'string', 'max:255'],
            'answer' => ['required', 'string'],
        ]);
    }

    private function nextSortOrder(): int
    {
        return ((int) Faq::max('sort_order')) + 1;
    }
}
