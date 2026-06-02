import { HudButton, HudPanel } from '@/Components/UI/Hud';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import type { FormEvent, ReactNode } from 'react';

type UserForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    is_admin: boolean;
};

export default function UserFormPage() {
    const { data, setData, post, processing, errors, reset } =
        useForm<UserForm>({
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            is_admin: false,
        });

    function submit(event: FormEvent) {
        event.preventDefault();

        post(route('admin.users.store'), {
            onSuccess: () => reset('password', 'password_confirmation'),
        });
    }

    return (
        <AdminLayout>
            <Head title="Create User" />
            <HudPanel className="p-6">
                <form className={formGrid} onSubmit={submit}>
                    <div className={formColumn}>
                        <Field label="Name" error={errors.name}>
                            <input
                                className={input}
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                autoComplete="name"
                            />
                        </Field>
                        <Field label="Email" error={errors.email}>
                            <input
                                className={input}
                                value={data.email}
                                type="email"
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                autoComplete="email"
                            />
                        </Field>
                        <label className="font-mono-display flex items-center gap-3 text-xs tracking-[0.16em] text-white/80 uppercase">
                            <input
                                checked={data.is_admin}
                                type="checkbox"
                                onChange={(e) =>
                                    setData('is_admin', e.target.checked)
                                }
                            />{' '}
                            Admin
                        </label>
                    </div>
                    <div className={formColumn}>
                        <Field label="Password" error={errors.password}>
                            <input
                                className={input}
                                value={data.password}
                                type="password"
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                autoComplete="new-password"
                            />
                        </Field>
                        <Field
                            label="Confirm Password"
                            error={errors.password_confirmation}
                        >
                            <input
                                className={input}
                                value={data.password_confirmation}
                                type="password"
                                onChange={(e) =>
                                    setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                                autoComplete="new-password"
                            />
                        </Field>
                    </div>
                    <div className="xl:col-span-2">
                        <HudButton type="submit" disabled={processing}>
                            Create User
                        </HudButton>
                    </div>
                </form>
            </HudPanel>
        </AdminLayout>
    );
}

const input =
    'mt-2 w-full rounded-sm border border-main-blue/35 bg-panel-deep px-4 py-3 text-white outline-none focus:border-seafoam-green';
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
