import { IconSelector } from '@/Components/Admin/IconSelector';
import { HudButton, HudPanel, TaxonomyBadge } from '@/Components/UI/Hud';
import AdminLayout from '@/Layouts/AdminLayout';
import type { Market, Module, SelectOption, TraderType } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import type { FormEvent, ReactNode } from 'react';

type ModuleForm = {
    market_id: string;
    trader_type_ids: number[];
    related_module_ids: number[];
    icon: string;
    image: File | null;
    remove_image: boolean;
    banner_image: File | null;
    remove_banner_image: boolean;
    title: string;
    slug: string;
    description: string;
    purpose: string;
    layer: string;
    key_output: string;
    trading_pace: string;
    short_name: string;
    price: string;
    module_overview: string;
    core_features_text: string;
    customization_options_text: string;
    best_used_for_text: string;
    summary: string;
    version: string;
    access: string;
    action_url: string;
    is_featured: boolean;
    is_active: boolean;
    published_at: string;
    meta_title: string;
    meta_description: string;
};

export default function ModuleFormPage({
    module,
    markets,
    traderTypes,
    modules,
    accessOptions,
}: {
    module: Module | null;
    markets: Market[];
    traderTypes: TraderType[];
    modules: Pick<Module, 'id' | 'title' | 'slug'>[];
    accessOptions: SelectOption[];
}) {
    const isEdit = Boolean(module);
    const attachedTraderTypes =
        module?.trader_types ?? module?.traderTypes ?? [];
    const attachedRelatedModules =
        module?.related_modules ?? module?.relatedModules ?? [];

    const { data, setData, post, processing, errors, transform } =
        useForm<ModuleForm>({
            market_id: module?.market_id ? String(module.market_id) : '',
            trader_type_ids: attachedTraderTypes.map((type) => type.id),
            related_module_ids: attachedRelatedModules.map((item) => item.id),
            icon: module?.icon || '',
            image: null,
            remove_image: false,
            banner_image: null,
            remove_banner_image: false,
            title: module?.title || '',
            slug: module?.slug || '',
            description: module?.description || '',
            purpose: module?.purpose || '',
            layer: module?.layer || '',
            key_output: module?.key_output || '',
            trading_pace: module?.trading_pace || '',
            short_name: module?.short_name || '',
            price: module?.price || '',
            module_overview: module?.module_overview || '',
            core_features_text: coreFeaturesToText(module?.core_features),
            customization_options_text: linesToText(
                module?.customization_options,
            ),
            best_used_for_text: linesToText(module?.best_used_for),
            summary: module?.summary || '',
            version: module?.version ? String(module.version) : '',
            access:
                module?.access ||
                accessOptions[0]?.value ||
                'Invite-Only Indicator + Discord',
            action_url: module?.action_url || '',
            is_featured: module?.is_featured ?? false,
            is_active: module?.is_active ?? true,
            published_at: module?.published_at?.slice(0, 16) || '',
            meta_title: module?.meta_title || '',
            meta_description: module?.meta_description || '',
        });
    const formErrors = errors as Record<string, string | undefined>;

    function submit(event: FormEvent) {
        event.preventDefault();
        if (module) {
            transform((payload) => ({ ...payload, _method: 'put' }));
            post(route('admin.modules.update', module.id), {
                forceFormData: true,
            });

            return;
        }

        post(route('admin.modules.store'), {
            forceFormData: true,
        });
    }

    return (
        <AdminLayout>
            <Head title={isEdit ? 'Edit Module' : 'Create Module'} />
            <HudPanel className="p-6">
                <form className="grid gap-5 xl:grid-cols-2" onSubmit={submit}>
                    <Field label="Title" error={errors.title}>
                        <input
                            className={input}
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                        />
                    </Field>
                    <Field label="Slug" error={errors.slug}>
                        <input
                            className={input}
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                            placeholder="Auto-generated when empty"
                        />
                    </Field>
                    <Field label="Market" error={errors.market_id}>
                        <select
                            className={input}
                            value={data.market_id}
                            onChange={(e) =>
                                setData('market_id', e.target.value)
                            }
                        >
                            <option value="">Select market</option>
                            {markets.map((market) => (
                                <option key={market.id} value={market.id}>
                                    {market.name}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Image Upload" error={errors.image}>
                        <div className="mt-2 grid gap-3">
                            {module?.image_url &&
                            !data.remove_image &&
                            !data.image ? (
                                <div className="border-main-blue/30 bg-panel-deep/70 flex items-center gap-4 rounded-sm border p-3">
                                    <img
                                        className="size-14 rounded-sm border border-white/10 object-contain p-1"
                                        src={module.image_url}
                                        alt=""
                                    />
                                    <span className="font-body text-sm tracking-normal text-white/70 normal-case">
                                        Current image
                                    </span>
                                </div>
                            ) : null}
                            <input
                                className={fileInput}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => {
                                    const image = e.target.files?.[0] ?? null;

                                    setData('image', image);

                                    if (image) {
                                        setData('remove_image', false);
                                    }
                                }}
                            />
                            {data.image ? (
                                <span className="font-body text-sm tracking-normal text-white/70 normal-case">
                                    Selected: {data.image.name}
                                </span>
                            ) : null}
                            {module?.image_url && !data.image ? (
                                <Check
                                    label="Remove current image"
                                    checked={data.remove_image}
                                    onChange={(checked) =>
                                        setData('remove_image', checked)
                                    }
                                />
                            ) : null}
                        </div>
                    </Field>
                    <Field
                        label="Banner Image Upload"
                        error={errors.banner_image}
                    >
                        <div className="mt-2 grid gap-3">
                            {module?.banner_image_url &&
                            !data.remove_banner_image &&
                            !data.banner_image ? (
                                <div className="border-main-blue/30 bg-panel-deep/70 flex items-center gap-4 rounded-sm border p-3">
                                    <img
                                        className="h-16 w-28 rounded-sm border border-white/10 object-cover"
                                        src={module.banner_image_url}
                                        alt=""
                                    />
                                    <span className="font-body text-sm tracking-normal text-white/70 normal-case">
                                        Current banner image
                                    </span>
                                </div>
                            ) : null}
                            <input
                                className={fileInput}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => {
                                    const image = e.target.files?.[0] ?? null;

                                    setData('banner_image', image);

                                    if (image) {
                                        setData('remove_banner_image', false);
                                    }
                                }}
                            />
                            {data.banner_image ? (
                                <span className="font-body text-sm tracking-normal text-white/70 normal-case">
                                    Selected: {data.banner_image.name}
                                </span>
                            ) : null}
                            {module?.banner_image_url &&
                            !data.banner_image ? (
                                <Check
                                    label="Remove current banner image"
                                    checked={data.remove_banner_image}
                                    onChange={(checked) =>
                                        setData('remove_banner_image', checked)
                                    }
                                />
                            ) : null}
                        </div>
                    </Field>
                    <Field label="Icon" error={errors.icon}>
                        <IconSelector
                            value={data.icon}
                            onChange={(value) => setData('icon', value)}
                        />
                    </Field>
                    <Field label="Access" error={errors.access}>
                        <select
                            className={input}
                            value={data.access}
                            onChange={(e) => setData('access', e.target.value)}
                        >
                            {accessOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Version" error={errors.version}>
                        <input
                            className={input}
                            value={data.version}
                            type="number"
                            min="0"
                            step="0.001"
                            onChange={(e) => setData('version', e.target.value)}
                            placeholder="1.33"
                        />
                    </Field>
                    <Field label="Action URL" error={errors.action_url}>
                        <input
                            className={input}
                            value={data.action_url}
                            type="url"
                            onChange={(e) =>
                                setData('action_url', e.target.value)
                            }
                            placeholder="https://..."
                        />
                    </Field>
                    <Field label="Purpose" error={errors.purpose}>
                        <input
                            className={input}
                            value={data.purpose}
                            onChange={(e) => setData('purpose', e.target.value)}
                        />
                    </Field>
                    <Field label="Layer" error={errors.layer}>
                        <input
                            className={input}
                            value={data.layer}
                            onChange={(e) => setData('layer', e.target.value)}
                        />
                    </Field>
                    <Field label="Key Output" error={errors.key_output}>
                        <input
                            className={input}
                            value={data.key_output}
                            onChange={(e) =>
                                setData('key_output', e.target.value)
                            }
                        />
                    </Field>
                    <Field label="Trading Pace" error={errors.trading_pace}>
                        <input
                            className={input}
                            value={data.trading_pace}
                            onChange={(e) =>
                                setData('trading_pace', e.target.value)
                            }
                        />
                    </Field>
                    <Field label="Short Name" error={errors.short_name}>
                        <input
                            className={input}
                            value={data.short_name}
                            onChange={(e) =>
                                setData('short_name', e.target.value)
                            }
                        />
                    </Field>
                    <Field label="Price" error={errors.price}>
                        <input
                            className={input}
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                        />
                    </Field>
                    <Field label="Published At" error={errors.published_at}>
                        <input
                            className={input}
                            value={data.published_at}
                            type="datetime-local"
                            onChange={(e) =>
                                setData('published_at', e.target.value)
                            }
                        />
                    </Field>
                    <div className="flex items-center gap-6 pt-7">
                        <Check
                            label="Active"
                            checked={data.is_active}
                            onChange={(checked) =>
                                setData('is_active', checked)
                            }
                        />
                        <Check
                            label="Featured"
                            checked={data.is_featured}
                            onChange={(checked) =>
                                setData('is_featured', checked)
                            }
                        />
                    </div>
                    <div className="xl:col-span-2">
                        <p className="font-body text-sm tracking-normal text-white/55 normal-case">
                            Reorder modules from the list page. The front end
                            uses that order automatically.
                        </p>
                    </div>
                    <Field
                        label="Trader Types"
                        error={
                            formErrors.trader_type_ids ||
                            formErrors['trader_type_ids.0']
                        }
                    >
                        <PillMultiSelect
                            selected={data.trader_type_ids}
                            options={traderTypes}
                            onChange={(ids) => setData('trader_type_ids', ids)}
                        />
                    </Field>
                    <Field
                        label="Trader’s also bought"
                        error={
                            formErrors.related_module_ids ||
                            formErrors['related_module_ids.0']
                        }
                    >
                        <RelatedModuleSelect
                            selected={data.related_module_ids}
                            options={modules}
                            onChange={(ids) =>
                                setData('related_module_ids', ids)
                            }
                        />
                    </Field>
                    <Field label="Description" error={errors.description}>
                        <textarea
                            className={textarea}
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                        />
                    </Field>
                    <Field
                        label="Module Overview"
                        error={errors.module_overview}
                    >
                        <textarea
                            className={textarea}
                            value={data.module_overview}
                            onChange={(e) =>
                                setData('module_overview', e.target.value)
                            }
                        />
                    </Field>
                    <Field
                        label="Core Features"
                        error={formErrors.core_features_text}
                    >
                        <textarea
                            className={textarea}
                            value={data.core_features_text}
                            onChange={(e) =>
                                setData('core_features_text', e.target.value)
                            }
                            placeholder="Feature title | Feature description | icon-key | tone"
                        />
                    </Field>
                    <Field
                        label="Customization Options"
                        error={formErrors.customization_options_text}
                    >
                        <textarea
                            className={textarea}
                            value={data.customization_options_text}
                            onChange={(e) =>
                                setData(
                                    'customization_options_text',
                                    e.target.value,
                                )
                            }
                        />
                    </Field>
                    <Field
                        label="Best Used For"
                        error={formErrors.best_used_for_text}
                    >
                        <textarea
                            className={textarea}
                            value={data.best_used_for_text}
                            onChange={(e) =>
                                setData('best_used_for_text', e.target.value)
                            }
                        />
                    </Field>
                    <Field label="Summary" error={errors.summary}>
                        <textarea
                            className={textarea}
                            value={data.summary}
                            onChange={(e) => setData('summary', e.target.value)}
                        />
                    </Field>
                    <Field label="Meta Title" error={errors.meta_title}>
                        <input
                            className={input}
                            value={data.meta_title}
                            onChange={(e) =>
                                setData('meta_title', e.target.value)
                            }
                        />
                    </Field>
                    <Field
                        label="Meta Description"
                        error={errors.meta_description}
                    >
                        <textarea
                            className={textarea}
                            value={data.meta_description}
                            onChange={(e) =>
                                setData('meta_description', e.target.value)
                            }
                        />
                    </Field>
                    <div className="xl:col-span-2">
                        <HudButton type="submit" disabled={processing}>
                            {isEdit ? 'Update Module' : 'Create Module'}
                        </HudButton>
                    </div>
                </form>
            </HudPanel>
        </AdminLayout>
    );
}

const input =
    'mt-2 w-full rounded-sm border border-main-blue/35 bg-panel-deep px-4 py-3 text-white outline-none focus:border-seafoam-green';
const fileInput =
    'w-full rounded-sm border border-dashed border-main-blue/35 bg-panel-deep px-4 py-3 text-sm text-white file:mr-4 file:rounded-sm file:border-0 file:bg-main-blue/20 file:px-3 file:py-2 file:font-mono-display file:text-xs file:tracking-[0.12em] file:text-white file:uppercase hover:border-main-blue/60';
const textarea = `${input} min-h-32`;

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: ReactNode;
}) {
    return (
        <div className="font-mono-display block text-xs tracking-[0.16em] text-white/80 uppercase">
            <span>{label}</span>
            {children}
            {error ? (
                <span className="font-body text-violet-light mt-2 block text-sm tracking-normal normal-case">
                    {error}
                </span>
            ) : null}
        </div>
    );
}

function Check({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <label className="font-mono-display flex items-center gap-3 text-xs tracking-[0.16em] text-white/80 uppercase">
            <input
                checked={checked}
                type="checkbox"
                onChange={(e) => onChange(e.target.checked)}
            />{' '}
            {label}
        </label>
    );
}

function PillMultiSelect({
    selected,
    options,
    onChange,
}: {
    selected: number[];
    options: TraderType[];
    onChange: (ids: number[]) => void;
}) {
    return (
        <div className="mt-3 flex flex-wrap gap-2">
            {options.map((option) => {
                const isSelected = selected.includes(option.id);

                return (
                    <button
                        key={option.id}
                        type="button"
                        className={`rounded-sm border px-3 py-2 transition ${isSelected ? 'border-seafoam-green/60 bg-seafoam-green/10' : 'border-main-blue/30 bg-panel-deep hover:border-main-blue/60'}`}
                        onClick={() => onChange(toggleId(selected, option.id))}
                    >
                        <TaxonomyBadge
                            label={option.name}
                            color={option.color}
                        />
                    </button>
                );
            })}
        </div>
    );
}

function RelatedModuleSelect({
    selected,
    options,
    onChange,
}: {
    selected: number[];
    options: Pick<Module, 'id' | 'title' | 'slug'>[];
    onChange: (ids: number[]) => void;
}) {
    return (
        <div className="mt-3 grid max-h-64 gap-2 overflow-auto pr-1">
            {options.map((module) => (
                <label
                    key={module.id}
                    className="border-main-blue/30 bg-panel-deep flex items-center gap-3 rounded-sm border px-3 py-2 text-white/75"
                >
                    <input
                        checked={selected.includes(module.id)}
                        type="checkbox"
                        onChange={() => onChange(toggleId(selected, module.id))}
                    />
                    {module.title}
                </label>
            ))}
        </div>
    );
}

function toggleId(selected: number[], id: number) {
    return selected.includes(id)
        ? selected.filter((selectedId) => selectedId !== id)
        : [...selected, id];
}

function coreFeaturesToText(features?: Module['core_features']) {
    return (features ?? [])
        .map((feature) =>
            [
                feature.label,
                feature.description,
                feature.icon ?? '',
                feature.tone ?? '',
            ].join(' | '),
        )
        .join('\n');
}

function linesToText(lines?: string[] | null) {
    return (lines ?? []).join('\n');
}
