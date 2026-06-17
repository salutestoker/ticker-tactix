import { IconSelector } from '@/Components/Admin/IconSelector';
import { HudButton, HudPanel, TaxonomyBadge } from '@/Components/UI/Hud';
import AdminLayout from '@/Layouts/AdminLayout';
import type { Market, Playbook, SelectOption, TraderType } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import type { FormEvent, ReactNode } from 'react';

type PlaybookForm = {
    market_id: string;
    trader_type_ids: number[];
    icon: string;
    logo: File | null;
    remove_logo: boolean;
    banner_image: File | null;
    remove_banner_image: boolean;
    title: string;
    slug: string;
    access: string;
    best_for: string;
    long_description: string;
    trading_pace: string;
    average_hold_time: string;
    price: string;
    action_url: string;
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

export default function PlaybookFormPage({
    playbook,
    markets,
    traderTypes,
    accessOptions,
}: {
    playbook: Playbook | null;
    markets: Market[];
    traderTypes: TraderType[];
    accessOptions: SelectOption[];
}) {
    const attachedTraderTypes =
        playbook?.trader_types ?? playbook?.traderTypes ?? [];

    const { data, setData, post, processing, errors, transform } =
        useForm<PlaybookForm>({
            market_id: playbook?.market_id
                ? String(playbook.market_id)
                : String(markets[0]?.id ?? ''),
            trader_type_ids: attachedTraderTypes.map((type) => type.id),
            icon: playbook?.icon || '',
            logo: null,
            remove_logo: false,
            banner_image: null,
            remove_banner_image: false,
            title: playbook?.title || '',
            slug: playbook?.slug || '',
            access:
                playbook?.access ||
                accessOptions[0]?.value ||
                'Daily Newsletter + Discord',
            best_for: playbook?.best_for || '',
            long_description: playbook?.long_description || '',
            trading_pace: playbook?.trading_pace || '',
            average_hold_time: playbook?.average_hold_time || '',
            price: playbook?.price || '',
            action_url: playbook?.action_url || '',
            stripe_product_id: playbook?.stripe_product_id || '',
            stripe_price_id: playbook?.stripe_price_id || '',
            purchase_email_subject: playbook?.purchase_email_subject || '',
            purchase_email_body: playbook?.purchase_email_body || '',
            is_featured: playbook?.is_featured ?? false,
            is_active: playbook?.is_active ?? true,
            published_at: playbook?.published_at?.slice(0, 16) || '',
            meta_title: playbook?.meta_title || '',
            meta_description: playbook?.meta_description || '',
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

    function submit(event: FormEvent) {
        event.preventDefault();

        if (playbook) {
            transform((payload) => ({ ...payload, _method: 'put' }));
            post(route('admin.playbooks.update', playbook.id), {
                forceFormData: true,
            });

            return;
        }

        post(route('admin.playbooks.store'), {
            forceFormData: true,
        });
    }

    function sendPurchaseEmailTest(event: FormEvent) {
        event.preventDefault();

        if (! playbook) {
            return;
        }

        transformTestEmail((payload) => ({
            ...payload,
            purchase_email_subject: data.purchase_email_subject,
            purchase_email_body: data.purchase_email_body,
        }));
        postTestEmail(
            route('admin.playbooks.purchase-email.test', playbook.id),
            {
                preserveScroll: true,
                onSuccess: () => resetTestEmail(),
            },
        );
    }

    return (
        <AdminLayout
            publicViewHref={
                playbook ? route('playbooks.show', playbook.slug) : undefined
            }
        >
            <Head title={playbook ? 'Edit Playbook' : 'Create Playbook'} />
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
                                {playbook?.banner_image_url &&
                                !data.remove_banner_image &&
                                !data.banner_image ? (
                                    <div className="border-main-blue/30 bg-panel-deep/70 flex items-center gap-4 rounded-sm border p-3">
                                        <img
                                            className="h-16 w-28 rounded-sm border border-white/10 object-cover"
                                            src={playbook.banner_image_url}
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
                                {playbook?.banner_image_url &&
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
                                placeholder="$70/mo, Coming Soon, External / Token-Gated"
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
                            Reorder playbooks from the list page. The front end
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
                        <Field
                            label="Long Description"
                            error={errors.long_description}
                        >
                            <textarea
                                className={textarea}
                                value={data.long_description}
                                onChange={(e) =>
                                    setData('long_description', e.target.value)
                                }
                                placeholder="Use line breaks to create paragraphs."
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
                        <Field label="Logo Upload" error={errors.logo}>
                            <div className="mt-2 grid gap-3">
                                {playbook?.logo_url &&
                                !data.remove_logo &&
                                !data.logo ? (
                                    <div className="border-main-blue/30 bg-panel-deep/70 flex items-center gap-4 rounded-sm border p-3">
                                        <img
                                            className="size-14 rounded-sm border border-white/10 object-contain p-1"
                                            src={playbook.logo_url}
                                            alt=""
                                        />
                                        <span className="font-body text-sm tracking-normal text-white/70 normal-case">
                                            Current logo
                                        </span>
                                    </div>
                                ) : null}
                                <input
                                    className={fileInput}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={(e) => {
                                        const logo =
                                            e.target.files?.[0] ?? null;

                                        setData('logo', logo);

                                        if (logo) {
                                            setData('remove_logo', false);
                                        }
                                    }}
                                />
                                {data.logo ? (
                                    <span className="font-body text-sm tracking-normal text-white/70 normal-case">
                                        Selected: {data.logo.name}
                                    </span>
                                ) : null}
                                {playbook?.logo_url && !data.logo ? (
                                    <Check
                                        label="Remove current logo"
                                        checked={data.remove_logo}
                                        onChange={(checked) =>
                                            setData('remove_logo', checked)
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
                        <Field
                            label="Average Hold"
                            error={errors.average_hold_time}
                        >
                            <input
                                className={input}
                                value={data.average_hold_time}
                                onChange={(e) =>
                                    setData('average_hold_time', e.target.value)
                                }
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
                        <Field label="Best For" error={errors.best_for}>
                            <textarea
                                className={textarea}
                                value={data.best_for}
                                onChange={(e) =>
                                    setData('best_for', e.target.value)
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
                    <div className="xl:col-span-2">
                        <HudButton type="submit" disabled={processing}>
                            {playbook ? 'Update Playbook' : 'Create Playbook'}
                        </HudButton>
                    </div>
                </form>
            </HudPanel>

            {playbook ? (
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

function toggleId(selected: number[], id: number) {
    return selected.includes(id)
        ? selected.filter((selectedId) => selectedId !== id)
        : [...selected, id];
}
