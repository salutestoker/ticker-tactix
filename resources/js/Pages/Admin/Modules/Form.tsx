import { IconSelector } from '@/Components/Admin/IconSelector';
import { HudButton, HudPanel, TaxonomyBadge } from '@/Components/UI/Hud';
import AdminLayout from '@/Layouts/AdminLayout';
import type {
    Market,
    Module,
    ModuleFeature,
    SelectOption,
    TraderType,
} from '@/types';
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
    core_features: ModuleFeatureForm[];
    customization_options_text: string;
    best_used_for_text: string;
    summary: string;
    version: string;
    access: string;
    action_url: string;
    youtube_url: string;
    stripe_product_id: string;
    stripe_price_id: string;
    purchase_email_subject: string;
    purchase_email_body: string;
    is_featured: boolean;
    is_active: boolean;
    published_at: string;
    meta_title: string;
    meta_description: string;
};

type ModuleFeatureForm = {
    label: string;
    icon: string;
    tone: string;
    description: string;
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
            core_features: normalizeCoreFeatures(module?.core_features),
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
            youtube_url: module?.youtube_url || '',
            stripe_product_id: module?.stripe_product_id || '',
            stripe_price_id: module?.stripe_price_id || '',
            purchase_email_subject: module?.purchase_email_subject || '',
            purchase_email_body: module?.purchase_email_body || '',
            is_featured: module?.is_featured ?? false,
            is_active: module?.is_active ?? true,
            published_at: module?.published_at?.slice(0, 16) || '',
            meta_title: module?.meta_title || '',
            meta_description: module?.meta_description || '',
        });
    const {
        data: testEmailData,
        setData: setTestEmailData,
        post: postTestEmail,
        processing: testEmailProcessing,
        errors: testEmailErrors,
        reset: resetTestEmail,
        transform: transformTestEmail,
    } = useForm<{ test_email: string }>({
        test_email: '',
    });
    const formErrors = errors as Record<string, string | undefined>;

    function updateCoreFeature(
        index: number,
        updates: Partial<ModuleFeatureForm>,
    ) {
        setData(
            'core_features',
            data.core_features.map((feature, featureIndex) =>
                featureIndex === index ? { ...feature, ...updates } : feature,
            ),
        );
    }

    function addCoreFeature() {
        setData('core_features', [...data.core_features, createCoreFeature()]);
    }

    function removeCoreFeature(index: number) {
        setData(
            'core_features',
            data.core_features.filter(
                (_feature, featureIndex) => featureIndex !== index,
            ),
        );
    }

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

    function sendPurchaseEmailTest(event: FormEvent) {
        event.preventDefault();

        if (! module) {
            return;
        }

        transformTestEmail((payload) => ({
            ...payload,
            purchase_email_subject: data.purchase_email_subject,
            purchase_email_body: data.purchase_email_body,
        }));
        postTestEmail(route('admin.modules.purchase-email.test', module.id), {
            preserveScroll: true,
            onSuccess: () => resetTestEmail(),
        });
    }

    return (
        <AdminLayout
            publicViewHref={
                module ? route('modules.show', module.slug) : undefined
            }
        >
            <Head title={isEdit ? 'Edit Module' : 'Create Module'} />
            <HudPanel className="p-6">
                <form className={formGrid} onSubmit={submit}>
                    <div className={formColumn}>
                        <Field label="Title" error={errors.title}>
                            <input
                                className={input}
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
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
                                        const image =
                                            e.target.files?.[0] ?? null;

                                        setData('banner_image', image);

                                        if (image) {
                                            setData(
                                                'remove_banner_image',
                                                false,
                                            );
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
                                            setData(
                                                'remove_banner_image',
                                                checked,
                                            )
                                        }
                                    />
                                ) : null}
                            </div>
                        </Field>
                        <Field label="Access" error={errors.access}>
                            <select
                                className={input}
                                value={data.access}
                                onChange={(e) =>
                                    setData('access', e.target.value)
                                }
                            >
                                {accessOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
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
                        <Field
                            label="YouTube Video URL"
                            error={errors.youtube_url}
                        >
                            <input
                                className={input}
                                value={data.youtube_url}
                                type="url"
                                onChange={(e) =>
                                    setData('youtube_url', e.target.value)
                                }
                                placeholder="https://www.youtube.com/watch?v=..."
                            />
                        </Field>
                        <Field
                            label="Stripe Product ID"
                            error={errors.stripe_product_id}
                        >
                            <input
                                className={input}
                                value={data.stripe_product_id}
                                onChange={(e) =>
                                    setData(
                                        'stripe_product_id',
                                        e.target.value,
                                    )
                                }
                                placeholder="prod_..."
                            />
                        </Field>
                        <Field
                            label="Stripe Price ID"
                            error={errors.stripe_price_id}
                        >
                            <input
                                className={input}
                                value={data.stripe_price_id}
                                onChange={(e) =>
                                    setData('stripe_price_id', e.target.value)
                                }
                                placeholder="price_..."
                            />
                        </Field>
                        <Field label="Layer" error={errors.layer}>
                            <input
                                className={input}
                                value={data.layer}
                                onChange={(e) =>
                                    setData('layer', e.target.value)
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
                        <Field label="Price" error={errors.price}>
                            <input
                                className={input}
                                value={data.price}
                                onChange={(e) =>
                                    setData('price', e.target.value)
                                }
                            />
                        </Field>
                        <Field
                            label="Purchase Email Subject"
                            error={errors.purchase_email_subject}
                        >
                            <input
                                className={input}
                                value={data.purchase_email_subject}
                                onChange={(e) =>
                                    setData(
                                        'purchase_email_subject',
                                        e.target.value,
                                    )
                                }
                                placeholder="Welcome to Ticker Tactix"
                            />
                        </Field>
                        <div className="flex items-center gap-6">
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
                        <p className="font-body text-sm tracking-normal text-white/55 normal-case">
                            Reorder modules from the list page. The front end
                            uses that order automatically.
                        </p>
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
                                onChange={(ids) =>
                                    setData('trader_type_ids', ids)
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
                            label="Core Features"
                            error={formErrors.core_features}
                        >
                            <CoreFeaturesEditor
                                features={data.core_features}
                                errors={formErrors}
                                onAdd={addCoreFeature}
                                onRemove={removeCoreFeature}
                                onUpdate={updateCoreFeature}
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
                                    setData(
                                        'best_used_for_text',
                                        e.target.value,
                                    )
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
                    </div>
                    <div className={formColumn}>
                        <Field label="Slug" error={errors.slug}>
                            <input
                                className={input}
                                value={data.slug}
                                onChange={(e) =>
                                    setData('slug', e.target.value)
                                }
                                placeholder="Auto-generated when empty"
                            />
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
                                        const image =
                                            e.target.files?.[0] ?? null;

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
                        <Field label="Icon" error={errors.icon}>
                            <IconSelector
                                value={data.icon}
                                onChange={(value) => setData('icon', value)}
                            />
                        </Field>
                        <Field label="Version" error={errors.version}>
                            <input
                                className={input}
                                value={data.version}
                                type="number"
                                min="0"
                                step="0.001"
                                onChange={(e) =>
                                    setData('version', e.target.value)
                                }
                                placeholder="1.33"
                            />
                        </Field>
                        <Field label="Purpose" error={errors.purpose}>
                            <input
                                className={input}
                                value={data.purpose}
                                onChange={(e) =>
                                    setData('purpose', e.target.value)
                                }
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
                        <Field label="Short Name" error={errors.short_name}>
                            <input
                                className={input}
                                value={data.short_name}
                                onChange={(e) =>
                                    setData('short_name', e.target.value)
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
                        <Field label="Summary" error={errors.summary}>
                            <textarea
                                className={textarea}
                                value={data.summary}
                                onChange={(e) =>
                                    setData('summary', e.target.value)
                                }
                            />
                        </Field>
                        <Field
                            label="Purchase Email Body"
                            error={errors.purchase_email_body}
                        >
                            <textarea
                                className={textarea}
                                value={data.purchase_email_body}
                                onChange={(e) =>
                                    setData(
                                        'purchase_email_body',
                                        e.target.value,
                                    )
                                }
                                placeholder="Add access steps, Discord instructions, TradingView notes, or onboarding links."
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
                    </div>
                    <div className="xl:col-span-2">
                        <HudButton type="submit" disabled={processing}>
                            {isEdit ? 'Update Module' : 'Create Module'}
                        </HudButton>
                    </div>
                </form>
            </HudPanel>

            {module ? (
                <HudPanel className="mt-5 p-6">
                    <form
                        className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
                        onSubmit={sendPurchaseEmailTest}
                    >
                        <Field
                            label="Test Purchase Emails"
                            error={testEmailErrors.test_email}
                        >
                            <textarea
                                className={textarea}
                                value={testEmailData.test_email}
                                onChange={(e) =>
                                    setTestEmailData(
                                        'test_email',
                                        e.target.value,
                                    )
                                }
                                placeholder="admin@example.com, teammate@example.com"
                            />
                        </Field>
                        <HudButton
                            type="submit"
                            disabled={testEmailProcessing}
                        >
                            Send Tests
                        </HudButton>
                    </form>
                </HudPanel>
            ) : null}
        </AdminLayout>
    );
}

const input =
    'mt-2 w-full rounded-sm border border-main-blue/35 bg-panel-deep px-4 py-3 text-white outline-none focus:border-seafoam-green';
const fileInput =
    'w-full rounded-sm border border-dashed border-main-blue/35 bg-panel-deep px-4 py-3 text-sm text-white file:mr-4 file:rounded-sm file:border-0 file:bg-main-blue/20 file:px-3 file:py-2 file:font-mono-display file:text-xs file:tracking-[0.12em] file:text-white file:uppercase hover:border-main-blue/60';
const textarea = `${input} min-h-32`;
const formGrid = 'grid gap-5 xl:grid-cols-2 xl:items-start';
const formColumn = 'grid gap-5';

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

function CoreFeaturesEditor({
    features,
    errors,
    onAdd,
    onRemove,
    onUpdate,
}: {
    features: ModuleFeatureForm[];
    errors: Record<string, string | undefined>;
    onAdd: () => void;
    onRemove: (index: number) => void;
    onUpdate: (index: number, updates: Partial<ModuleFeatureForm>) => void;
}) {
    return (
        <div className="mt-3 grid gap-3">
            {features.map((feature, index) => (
                <div
                    key={index}
                    className="border-main-blue/30 bg-panel-deep/70 grid gap-4 rounded-sm border p-4"
                >
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-white/65">
                            Feature {index + 1}
                        </span>
                        <button
                            className="border-violet-light/35 text-violet-light hover:border-violet-light rounded-sm border px-3 py-2"
                            type="button"
                            onClick={() => onRemove(index)}
                        >
                            Remove
                        </button>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-2">
                        <NestedField
                            label="Title"
                            error={errors[`core_features.${index}.label`]}
                        >
                            <input
                                className={input}
                                value={feature.label}
                                onChange={(event) =>
                                    onUpdate(index, {
                                        label: event.target.value,
                                    })
                                }
                            />
                        </NestedField>
                        <NestedField
                            label="Icon"
                            error={errors[`core_features.${index}.icon`]}
                        >
                            <IconSelector
                                value={feature.icon}
                                onChange={(icon) => onUpdate(index, { icon })}
                            />
                        </NestedField>
                        <NestedField
                            label="Color"
                            error={errors[`core_features.${index}.tone`]}
                        >
                            <TonePicker
                                value={feature.tone}
                                onChange={(tone) => onUpdate(index, { tone })}
                            />
                        </NestedField>
                        <NestedField
                            label="Description"
                            error={errors[`core_features.${index}.description`]}
                        >
                            <textarea
                                className={textarea}
                                value={feature.description}
                                onChange={(event) =>
                                    onUpdate(index, {
                                        description: event.target.value,
                                    })
                                }
                            />
                        </NestedField>
                    </div>
                </div>
            ))}
            <button
                className="border-seafoam-green/45 text-seafoam-green hover:border-seafoam-green w-fit rounded-sm border px-4 py-3 transition"
                type="button"
                onClick={onAdd}
            >
                + Add Core Feature
            </button>
        </div>
    );
}

function NestedField({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: ReactNode;
}) {
    return (
        <div className="block text-[11px] tracking-[0.14em] text-white/65 uppercase">
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

function TonePicker({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className="mt-2 flex flex-wrap gap-2">
            {featureToneOptions.map((option) => {
                const isSelected = value === option.value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        className={`flex items-center gap-2 rounded-sm border px-3 py-2 transition ${
                            isSelected
                                ? 'border-white/70 bg-white/10 text-white'
                                : 'border-main-blue/30 bg-panel hover:border-main-blue/60 text-white/65'
                        }`}
                        onClick={() => onChange(option.value)}
                    >
                        <span
                            className={`h-3 w-3 rounded-full ${option.swatch}`}
                        />
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}

function toggleId(selected: number[], id: number) {
    return selected.includes(id)
        ? selected.filter((selectedId) => selectedId !== id)
        : [...selected, id];
}

function normalizeCoreFeatures(
    features?: Module['core_features'],
): ModuleFeatureForm[] {
    return (features ?? [])
        .filter((feature): feature is ModuleFeature => Boolean(feature?.label))
        .map((feature) => ({
            label: feature.label,
            icon: feature.icon ?? '',
            tone: feature.tone ?? 'green',
            description: feature.description ?? '',
        }));
}

function createCoreFeature(): ModuleFeatureForm {
    return {
        label: '',
        icon: '',
        tone: 'green',
        description: '',
    };
}

function linesToText(lines?: string[] | null) {
    return (lines ?? []).join('\n');
}

const featureToneOptions = [
    {
        value: 'green',
        label: 'Green',
        swatch: 'bg-seafoam-green',
    },
    {
        value: 'violet',
        label: 'Violet',
        swatch: 'bg-violet-light',
    },
    {
        value: 'blue',
        label: 'Blue',
        swatch: 'bg-main-blue',
    },
    {
        value: 'gold',
        label: 'Gold',
        swatch: 'bg-gold',
    },
];
