import { IconSelector } from '@/Components/Admin/IconSelector';
import { HudButton, HudPanel, TaxonomyBadge } from '@/Components/UI/Hud';
import AdminLayout from '@/Layouts/AdminLayout';
import type { SelectOption, TraderType } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import type { FormEvent, ReactNode } from 'react';

type TraderTypeForm = {
    name: string;
    slug: string;
    description: string;
    color: string;
    icon: string;
    sort_order: number;
    is_active: boolean;
};

export default function TraderTypeFormPage({
    traderType,
    colorOptions,
}: {
    traderType: TraderType | null;
    colorOptions: SelectOption[];
}) {
    const { data, setData, post, put, processing, errors } =
        useForm<TraderTypeForm>({
            name: traderType?.name || '',
            slug: traderType?.slug || '',
            description: traderType?.description || '',
            color: traderType?.color || colorOptions[0]?.value || '',
            icon: traderType?.icon || '',
            sort_order: traderType?.sort_order ?? 0,
            is_active: traderType?.is_active ?? true,
        });

    function submit(event: FormEvent) {
        event.preventDefault();
        traderType
            ? put(route('admin.trader-types.update', traderType.id))
            : post(route('admin.trader-types.store'));
    }

    return (
        <AdminLayout>
            <Head
                title={traderType ? 'Edit Trader Type' : 'Create Trader Type'}
            />
            <HudPanel className="p-6">
                <form className="grid gap-5 xl:grid-cols-2" onSubmit={submit}>
                    <Field label="Name" error={errors.name}>
                        <input
                            className={input}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
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
                    <Field label="Color" error={errors.color}>
                        <select
                            className={input}
                            value={data.color}
                            onChange={(e) => setData('color', e.target.value)}
                        >
                            {colorOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <div className="mt-3">
                            <TaxonomyBadge
                                label={
                                    colorOptions.find(
                                        (option) => option.value === data.color,
                                    )?.label || 'Selected color'
                                }
                                color={data.color}
                            />
                        </div>
                    </Field>
                    <Field label="Icon" error={errors.icon}>
                        <IconSelector
                            value={data.icon}
                            onChange={(value) => setData('icon', value)}
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
                    <label className="font-mono-display flex items-center gap-3 pt-8 text-xs tracking-[0.16em] text-white/80 uppercase">
                        <input
                            checked={data.is_active}
                            type="checkbox"
                            onChange={(e) =>
                                setData('is_active', e.target.checked)
                            }
                        />{' '}
                        Active
                    </label>
                    <Field label="Description" error={errors.description}>
                        <textarea
                            className={textarea}
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                        />
                    </Field>
                    <div className="xl:col-span-2">
                        <HudButton type="submit" disabled={processing}>
                            {traderType
                                ? 'Update Trader Type'
                                : 'Create Trader Type'}
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
