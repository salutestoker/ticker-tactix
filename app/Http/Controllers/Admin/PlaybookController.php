<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AccessLevel;
use App\Http\Controllers\Controller;
use App\Models\Market;
use App\Models\Playbook;
use App\Models\TraderType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
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
        $logo = $data['logo'] ?? null;

        unset($data['logo'], $data['remove_logo']);

        if (! array_key_exists('sort_order', $data) || $data['sort_order'] === null) {
            $data['sort_order'] = $this->nextSortOrder();
        }

        if ($logo instanceof UploadedFile) {
            $data['logo_path'] = $this->storeLogo($logo);
        }

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
        $logo = $data['logo'] ?? null;
        $removeLogo = (bool) ($data['remove_logo'] ?? false);

        unset($data['logo'], $data['remove_logo']);

        if ($logo instanceof UploadedFile) {
            $this->deleteLogo($playbook);
            $data['logo_path'] = $this->storeLogo($logo);
        } elseif ($removeLogo) {
            $this->deleteLogo($playbook);
            $data['logo_path'] = null;
        }

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
            'logo' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'remove_logo' => ['nullable', 'boolean'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('playbooks', 'slug')->ignore($playbook)],
            'access' => ['required', Rule::enum(AccessLevel::class)],
            'best_for' => ['nullable', 'string'],
            'long_description' => ['nullable', 'string'],
            'trading_pace' => ['nullable', 'string', 'max:255'],
            'average_hold_time' => ['nullable', 'string', 'max:255'],
            'price' => ['nullable', 'string', 'max:255'],
            'action_url' => ['nullable', 'url', 'max:2048'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_featured' => ['required', 'boolean'],
            'is_active' => ['required', 'boolean'],
            'published_at' => ['nullable', 'date'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
        ]);

        $data['slug'] = $data['slug'] ?: Str::slug($data['title']);

        return $data;
    }

    public function reorder(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'ordered_ids' => ['required', 'array', 'min:1'],
            'ordered_ids.*' => ['integer', 'distinct', 'exists:playbooks,id'],
        ]);

        $orderedIds = array_values(array_unique($data['ordered_ids']));
        $playbooks = Playbook::whereKey($orderedIds)->get()->keyBy('id');

        abort_if($playbooks->count() !== count($orderedIds), 422, 'Unable to reorder playbooks.');

        DB::transaction(function () use ($orderedIds, $playbooks): void {
            foreach ($orderedIds as $index => $id) {
                $playbooks[$id]->updateQuietly(['sort_order' => $index]);
            }
        });

        return back()->with('success', 'Playbook order updated.');
    }

    private function storeLogo(UploadedFile $logo): string
    {
        $path = Storage::disk($this->logoDisk())->putFile(
            $this->logoDirectory(),
            $logo,
        );

        abort_if($path === false, 500, 'Unable to store playbook logo.');

        return $path;
    }

    private function deleteLogo(Playbook $playbook): void
    {
        if (! $playbook->logo_path) {
            return;
        }

        Storage::disk($this->logoDisk())->delete($playbook->logo_path);
    }

    private function logoDisk(): string
    {
        return (string) config('filesystems.catalog_media_disk', 'public');
    }

    private function logoDirectory(): string
    {
        return trim((string) config('filesystems.playbook_logo_directory', 'playbook-logos'), '/');
    }

    private function nextSortOrder(): int
    {
        return ((int) Playbook::max('sort_order')) + 1;
    }
}
