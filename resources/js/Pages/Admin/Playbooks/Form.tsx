import { HudButton, HudPanel } from '@/Components/UI/Hud';
import AdminLayout from '@/Layouts/AdminLayout';
import type { Playbook, PlaybookCategory } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import type { FormEvent, ReactNode } from 'react';

type PlaybookForm = {
    playbook_category_id: string;
    framework: string;
    slug: string;
    access: string;
    market: string;
    best_for: string;
    average_hold_time: string;
    price_cents: string;
    currency: string;
    payment_url: string;
    sort_order: number;
    is_featured: boolean;
    is_active: boolean;
    published_at: string;
    meta_title: string;
    meta_description: string;
};

export default function PlaybookFormPage({
    playbook,
    categories,
}: {
    playbook: Playbook | null;
    categories: PlaybookCategory[];
}) {
    const { data, setData, post, put, processing, errors } =
        useForm<PlaybookForm>({
            playbook_category_id: playbook?.playbook_category_id
                ? String(playbook.playbook_category_id)
                : String(categories[0]?.id ?? ''),
            framework: playbook?.framework || '',
            slug: playbook?.slug || '',
            access: playbook?.access || 'core_access',
            market: playbook?.market || '',
            best_for: playbook?.best_for || '',
            average_hold_time: playbook?.average_hold_time || '',
            price_cents: playbook?.price_cents
                ? String(playbook.price_cents)
                : '',
            currency: playbook?.currency || 'USD',
            payment_url: playbook?.payment_url || '',
            sort_order: playbook?.sort_order ?? 0,
            is_featured: playbook?.is_featured ?? false,
            is_active: playbook?.is_active ?? true,
            published_at: playbook?.published_at?.slice(0, 16) || '',
            meta_title: playbook?.meta_title || '',
            meta_description: playbook?.meta_description || '',
        });

    function submit(event: FormEvent) {
        event.preventDefault();
        playbook
            ? put(route('admin.playbooks.update', playbook.id))
            : post(route('admin.playbooks.store'));
    }

    return (
        <AdminLayout>
            <Head title={playbook ? 'Edit Playbook' : 'Create Playbook'} />
            <HudPanel className="p-6">
                <form className="grid gap-5 xl:grid-cols-2" onSubmit={submit}>
                    <Field label="Framework" error={errors.framework}>
                        <input
                            className={input}
                            value={data.framework}
                            onChange={(e) =>
                                setData('framework', e.target.value)
                            }
                        />
                    </Field>
                    <Field label="Slug" error={errors.slug}>
                        <input
                            className={input}
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                        />
                    </Field>
                    <Field label="Category" error={errors.playbook_category_id}>
                        <select
                            className={input}
                            value={data.playbook_category_id}
                            onChange={(e) =>
                                setData('playbook_category_id', e.target.value)
                            }
                        >
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Access" error={errors.access}>
                        <input
                            className={input}
                            value={data.access}
                            onChange={(e) => setData('access', e.target.value)}
                        />
                    </Field>
                    <Field label="Market" error={errors.market}>
                        <input
                            className={input}
                            value={data.market}
                            onChange={(e) => setData('market', e.target.value)}
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
                    <Field label="Price Cents" error={errors.price_cents}>
                        <input
                            className={input}
                            value={data.price_cents}
                            type="number"
                            min="0"
                            onChange={(e) =>
                                setData('price_cents', e.target.value)
                            }
                        />
                    </Field>
                    <Field label="Currency" error={errors.currency}>
                        <input
                            className={input}
                            value={data.currency}
                            maxLength={3}
                            onChange={(e) =>
                                setData(
                                    'currency',
                                    e.target.value.toUpperCase(),
                                )
                            }
                        />
                    </Field>
                    <Field label="Payment URL" error={errors.payment_url}>
                        <input
                            className={input}
                            value={data.payment_url}
                            onChange={(e) =>
                                setData('payment_url', e.target.value)
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
                    <Field label="Best For" error={errors.best_for}>
                        <textarea
                            className={textarea}
                            value={data.best_for}
                            onChange={(e) =>
                                setData('best_for', e.target.value)
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
                    <Field label="Meta Title" error={errors.meta_title}>
                        <input
                            className={input}
                            value={data.meta_title}
                            onChange={(e) =>
                                setData('meta_title', e.target.value)
                            }
                        />
                    </Field>
                    <div className="xl:col-span-2">
                        <HudButton type="submit" disabled={processing}>
                            {playbook ? 'Update Playbook' : 'Create Playbook'}
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
