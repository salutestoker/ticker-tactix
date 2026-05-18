import { HudButton, HudPanel } from '@/Components/UI/Hud';
import AdminLayout from '@/Layouts/AdminLayout';
import type { Module, PlaybookCategory } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import type { FormEvent, ReactNode } from 'react';

type ModuleForm = {
    playbook_category_id: string;
    icon: string;
    title: string;
    slug: string;
    purpose: string;
    description: string;
    what_it_does: string;
    key_output: string;
    version: string;
    access: string;
    payment_url: string;
    sort_order: number;
    is_featured: boolean;
    is_active: boolean;
    published_at: string;
    meta_title: string;
    meta_description: string;
};

export default function ModuleFormPage({
    module,
    categories,
}: {
    module: Module | null;
    categories: PlaybookCategory[];
}) {
    const isEdit = Boolean(module);
    const { data, setData, post, put, processing, errors } =
        useForm<ModuleForm>({
            playbook_category_id: module?.playbook_category_id
                ? String(module.playbook_category_id)
                : '',
            icon: module?.icon || '',
            title: module?.title || '',
            slug: module?.slug || '',
            purpose: module?.purpose || '',
            description: module?.description || '',
            what_it_does: module?.what_it_does || '',
            key_output: module?.key_output || '',
            version: module?.version || '',
            access: module?.access || 'core',
            payment_url: module?.payment_url || '',
            sort_order: module?.sort_order ?? 0,
            is_featured: module?.is_featured ?? false,
            is_active: module?.is_active ?? true,
            published_at: module?.published_at?.slice(0, 16) || '',
            meta_title: module?.meta_title || '',
            meta_description: module?.meta_description || '',
        });

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
                    <Field label="Category" error={errors.playbook_category_id}>
                        <select
                            className={input}
                            value={data.playbook_category_id}
                            onChange={(e) =>
                                setData('playbook_category_id', e.target.value)
                            }
                        >
                            <option value="">No category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Icon Key" error={errors.icon}>
                        <input
                            className={input}
                            value={data.icon}
                            onChange={(e) => setData('icon', e.target.value)}
                        />
                    </Field>
                    <Field label="Purpose" error={errors.purpose}>
                        <input
                            className={input}
                            value={data.purpose}
                            onChange={(e) => setData('purpose', e.target.value)}
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
                    <Field label="Version" error={errors.version}>
                        <input
                            className={input}
                            value={data.version}
                            onChange={(e) => setData('version', e.target.value)}
                        />
                    </Field>
                    <Field label="Access" error={errors.access}>
                        <input
                            className={input}
                            value={data.access}
                            onChange={(e) => setData('access', e.target.value)}
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
                    <Field label="Description" error={errors.description}>
                        <textarea
                            className={textarea}
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                        />
                    </Field>
                    <Field label="What It Does" error={errors.what_it_does}>
                        <textarea
                            className={textarea}
                            value={data.what_it_does}
                            onChange={(e) =>
                                setData('what_it_does', e.target.value)
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
