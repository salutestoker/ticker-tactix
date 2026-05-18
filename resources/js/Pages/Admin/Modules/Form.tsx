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
    title: string;
    slug: string;
    description: string;
    version: string;
    access: string;
    action_label: string;
    sort_order: number;
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

    const { data, setData, post, put, processing, errors } =
        useForm<ModuleForm>({
            market_id: module?.market_id ? String(module.market_id) : '',
            trader_type_ids: attachedTraderTypes.map((type) => type.id),
            related_module_ids: attachedRelatedModules.map((item) => item.id),
            icon: module?.icon || '',
            title: module?.title || '',
            slug: module?.slug || '',
            description: module?.description || '',
            version: module?.version ? String(module.version) : '',
            access:
                module?.access ||
                accessOptions[0]?.value ||
                'Invite-Only Indicator + Discord',
            action_label: module?.action_label || 'Explore Module',
            sort_order: module?.sort_order ?? 0,
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
            put(route('admin.modules.update', module.id));
            return;
        }
        post(route('admin.modules.store'));
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
                    <Field label="Action Label" error={errors.action_label}>
                        <input
                            className={input}
                            value={data.action_label}
                            onChange={(e) =>
                                setData('action_label', e.target.value)
                            }
                        />
                    </Field>
                    <Field label="Sort Order" error={errors.sort_order}>
                        <input
                            className={input}
                            value={data.sort_order}
                            type="number"
                            min="0"
                            onChange={(e) =>
                                setData('sort_order', Number(e.target.value))
                            }
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
        <label className="font-mono-display block text-xs tracking-[0.16em] text-white/80 uppercase">
            {label}
            {children}
            {error ? (
                <span className="font-body text-violet-light mt-2 block text-sm tracking-normal normal-case">
                    {error}
                </span>
            ) : null}
        </label>
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
