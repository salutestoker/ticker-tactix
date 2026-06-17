<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AccessLevel;
use App\Http\Controllers\Controller;
use App\Models\Market;
use App\Models\Module;
use App\Models\TraderType;
use App\Rules\YouTubeVideoUrl;
use App\Services\CatalogSpreadsheetSyncService;
use App\Services\SubscriptionWelcomeEmailTestService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
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
        $image = $data['image'] ?? null;
        $bannerImage = $data['banner_image'] ?? null;

        unset($data['image'], $data['remove_image'], $data['banner_image'], $data['remove_banner_image']);

        if (! array_key_exists('sort_order', $data) || $data['sort_order'] === null) {
            $data['sort_order'] = $this->nextSortOrder();
        }

        if ($image instanceof UploadedFile) {
            $data['image_path'] = $this->storeImage($image);
        }

        if ($bannerImage instanceof UploadedFile) {
            $data['banner_image'] = $this->storeBannerImage($bannerImage);
        }

        $module = Module::create(Arr::except($data, [
            'trader_type_ids',
            'related_module_ids',
            'customization_options_text',
            'best_used_for_text',
        ]));

        $module->traderTypes()->sync($data['trader_type_ids']);
        $module->relatedModules()->sync($data['related_module_ids'] ?? []);
        $this->exportCatalogSpreadsheets();

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
        $image = $data['image'] ?? null;
        $removeImage = (bool) ($data['remove_image'] ?? false);
        $bannerImage = $data['banner_image'] ?? null;
        $removeBannerImage = (bool) ($data['remove_banner_image'] ?? false);

        unset($data['image'], $data['remove_image'], $data['banner_image'], $data['remove_banner_image']);

        if ($image instanceof UploadedFile) {
            $this->deleteImage($module);
            $data['image_path'] = $this->storeImage($image);
        } elseif ($removeImage) {
            $this->deleteImage($module);
            $data['image_path'] = null;
        }

        if ($bannerImage instanceof UploadedFile) {
            $this->deleteBannerImage($module);
            $data['banner_image'] = $this->storeBannerImage($bannerImage);
        } elseif ($removeBannerImage) {
            $this->deleteBannerImage($module);
            $data['banner_image'] = null;
        }

        $module->update(Arr::except($data, [
            'trader_type_ids',
            'related_module_ids',
            'customization_options_text',
            'best_used_for_text',
        ]));
        $module->traderTypes()->sync($data['trader_type_ids']);
        $module->relatedModules()->sync($data['related_module_ids'] ?? []);
        $this->exportCatalogSpreadsheets();

        return redirect()->route('admin.modules.index')->with('success', 'Module updated.');
    }

    public function destroy(Module $module): RedirectResponse
    {
        $module->delete();
        $this->exportCatalogSpreadsheets();

        return redirect()->route('admin.modules.index')->with('success', 'Module archived.');
    }

    public function sendPurchaseEmailTest(
        Request $request,
        Module $module,
        SubscriptionWelcomeEmailTestService $testEmails,
    ): RedirectResponse {
        $data = $request->validate([
            'test_email' => ['required', 'string', 'max:4000'],
            'purchase_email_subject' => ['nullable', 'string', 'max:255'],
            'purchase_email_body' => ['nullable', 'string'],
        ]);
        $emails = $testEmails->parseRecipients($data['test_email']);
        $purchaseEmailBody = trim((string) ($data['purchase_email_body'] ?? $module->purchase_email_body));

        if ($purchaseEmailBody === '') {
            return back()
                ->withErrors(['test_email' => 'Add a purchase email body before sending a test email.'])
                ->withInput();
        }

        $module->forceFill([
            'purchase_email_subject' => $data['purchase_email_subject'] ?? $module->purchase_email_subject,
            'purchase_email_body' => $purchaseEmailBody,
        ]);

        $sentCount = $testEmails->sendMany($module, $emails);

        return back()->with('success', $sentCount.' module test purchase '.Str::plural('email', $sentCount).' sent.');
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
            'image' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'remove_image' => ['nullable', 'boolean'],
            'banner_image' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp', 'max:8192'],
            'remove_banner_image' => ['nullable', 'boolean'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('modules', 'slug')->ignore($module)],
            'description' => ['nullable', 'string'],
            'purpose' => ['nullable', 'string', 'max:255'],
            'layer' => ['nullable', 'string', 'max:255'],
            'key_output' => ['nullable', 'string', 'max:255'],
            'trading_pace' => ['nullable', 'string', 'max:255'],
            'short_name' => ['nullable', 'string', 'max:255'],
            'price' => ['nullable', 'string', 'max:255'],
            'module_overview' => ['nullable', 'string'],
            'core_features' => ['nullable', 'array'],
            'core_features.*' => ['array'],
            'core_features.*.label' => ['nullable', 'string', 'max:255'],
            'core_features.*.icon' => ['nullable', 'string', 'max:255'],
            'core_features.*.tone' => ['nullable', 'string', Rule::in(['green', 'violet', 'blue', 'gold'])],
            'core_features.*.description' => ['nullable', 'string'],
            'customization_options_text' => ['nullable', 'string'],
            'best_used_for_text' => ['nullable', 'string'],
            'summary' => ['nullable', 'string'],
            'version' => ['nullable', 'numeric', 'min:0'],
            'access' => ['required', Rule::enum(AccessLevel::class)],
            'action_url' => ['nullable', 'url', 'max:2048'],
            'youtube_url' => ['nullable', 'url', 'max:2048', new YouTubeVideoUrl],
            'stripe_product_id' => ['nullable', 'string', 'max:255'],
            'stripe_price_id' => ['nullable', 'string', 'max:255'],
            'purchase_email_subject' => ['nullable', 'string', 'max:255'],
            'purchase_email_body' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_featured' => ['required', 'boolean'],
            'is_active' => ['required', 'boolean'],
            'published_at' => ['nullable', 'date'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
        ]);

        $data['slug'] = $data['slug'] ?: Str::slug($data['title']);
        $data['related_module_ids'] = array_values(array_unique($data['related_module_ids'] ?? []));
        $data['core_features'] = $this->normalizeCoreFeatures($data['core_features'] ?? []);
        $data['customization_options'] = $this->parseLines($data['customization_options_text'] ?? '');
        $data['best_used_for'] = $this->parseLines($data['best_used_for_text'] ?? '');

        return $data;
    }

    public function reorder(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'ordered_ids' => ['required', 'array', 'min:1'],
            'ordered_ids.*' => ['integer', 'distinct', 'exists:modules,id'],
        ]);

        $orderedIds = array_values(array_unique($data['ordered_ids']));
        $modules = Module::whereKey($orderedIds)->get()->keyBy('id');

        abort_if($modules->count() !== count($orderedIds), 422, 'Unable to reorder modules.');

        DB::transaction(function () use ($orderedIds, $modules): void {
            foreach ($orderedIds as $index => $id) {
                $modules[$id]->updateQuietly(['sort_order' => $index]);
            }
        });
        $this->exportCatalogSpreadsheets();

        return back()->with('success', 'Module order updated.');
    }

    /**
     * @return list<array{label: string, description: string, icon: string|null, tone: string|null}>
     */
    private function normalizeCoreFeatures(array $features): array
    {
        return collect($features)
            ->map(function (array $feature): array {
                return [
                    'label' => trim((string) ($feature['label'] ?? '')),
                    'description' => trim((string) ($feature['description'] ?? '')),
                    'icon' => trim((string) ($feature['icon'] ?? '')) ?: null,
                    'tone' => trim((string) ($feature['tone'] ?? '')) ?: null,
                ];
            })
            ->filter(fn (array $feature): bool => $feature['label'] !== '')
            ->values()
            ->all();
    }

    /**
     * @return list<string>
     */
    private function parseLines(string $value): array
    {
        return collect(preg_split('/\r\n|\r|\n/', $value) ?: [])
            ->map(fn (string $line): string => trim($line))
            ->filter()
            ->values()
            ->all();
    }

    private function exportCatalogSpreadsheets(): void
    {
        app(CatalogSpreadsheetSyncService::class)->exportAll();
    }

    private function storeImage(UploadedFile $image): string
    {
        $path = Storage::disk($this->imageDisk())->putFile(
            $this->imageDirectory(),
            $image,
        );

        abort_if($path === false, 500, 'Unable to store module image.');

        return $path;
    }

    private function deleteImage(Module $module): void
    {
        if (! $module->image_path) {
            return;
        }

        Storage::disk($this->imageDisk())->delete($module->image_path);
    }

    private function storeBannerImage(UploadedFile $image): string
    {
        $path = Storage::disk($this->imageDisk())->putFile(
            $this->bannerImageDirectory(),
            $image,
        );

        abort_if($path === false, 500, 'Unable to store module banner image.');

        return $path;
    }

    private function deleteBannerImage(Module $module): void
    {
        if (! $module->banner_image) {
            return;
        }

        Storage::disk($this->imageDisk())->delete($module->banner_image);
    }

    private function imageDisk(): string
    {
        return (string) config('filesystems.module_image_disk', 'public');
    }

    private function nextSortOrder(): int
    {
        return ((int) Module::max('sort_order')) + 1;
    }

    private function imageDirectory(): string
    {
        return trim((string) config('filesystems.module_image_directory', 'module-images'), '/');
    }

    private function bannerImageDirectory(): string
    {
        return trim((string) config('filesystems.module_banner_image_directory', 'module-banner-images'), '/');
    }
}
