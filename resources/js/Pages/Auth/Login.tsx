import {
    Eyebrow,
    GradientHeading,
    HudButton,
    HudPanel,
} from '@/Components/UI/Hud';
import { PublicHeroFrame } from '@/Components/UI/PublicHero';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEventHandler, ReactNode } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <PublicLayout>
            <Head title="Login" />
            <PublicHeroFrame>
                <div className="mx-auto max-w-xl">
                    <Eyebrow>Access</Eyebrow>
                    <GradientHeading className="text-center">
                        Member Login
                    </GradientHeading>
                    <HudPanel className="mt-10 p-8">
                        {status ? (
                            <p className="text-seafoam-green mb-5 text-sm">
                                {status}
                            </p>
                        ) : null}
                        <HudButton
                            href={route('auth.discord.redirect')}
                            tone="violet"
                            variant="solid"
                            className="w-full"
                        >
                            Continue With Discord
                        </HudButton>
                        <div className="my-8 flex items-center gap-4 text-xs tracking-[0.2em] text-white/40 uppercase">
                            <span className="bg-main-blue/30 h-px flex-1" />
                            Session fallback
                            <span className="bg-main-blue/30 h-px flex-1" />
                        </div>
                        <form className="space-y-5" onSubmit={submit}>
                            <Field label="Email" error={errors.email}>
                                <input
                                    className="border-main-blue/35 bg-panel-deep focus:border-seafoam-green w-full rounded-sm border px-4 py-3 text-white transition outline-none"
                                    value={data.email}
                                    type="email"
                                    autoComplete="username"
                                    onChange={(event) =>
                                        setData('email', event.target.value)
                                    }
                                />
                            </Field>
                            <Field label="Password" error={errors.password}>
                                <input
                                    className="border-main-blue/35 bg-panel-deep focus:border-seafoam-green w-full rounded-sm border px-4 py-3 text-white transition outline-none"
                                    value={data.password}
                                    type="password"
                                    autoComplete="current-password"
                                    onChange={(event) =>
                                        setData('password', event.target.value)
                                    }
                                />
                            </Field>
                            <label className="flex items-center gap-3 text-sm text-white/65">
                                <input
                                    checked={data.remember}
                                    type="checkbox"
                                    className="border-main-blue/50 bg-panel h-4 w-4 rounded-sm"
                                    onChange={(event) =>
                                        setData(
                                            'remember',
                                            event.target.checked,
                                        )
                                    }
                                />
                                Remember this session
                            </label>
                            <div className="flex items-center justify-between gap-4">
                                {canResetPassword ? (
                                    <Link
                                        className="hover:text-seafoam-green text-sm text-white/55 underline-offset-4 hover:underline"
                                        href={route('password.request')}
                                    >
                                        Forgot password?
                                    </Link>
                                ) : (
                                    <span />
                                )}
                                <HudButton type="submit" disabled={processing}>
                                    Log In
                                </HudButton>
                            </div>
                        </form>
                    </HudPanel>
                </div>
            </PublicHeroFrame>
        </PublicLayout>
    );
}

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
        <label className="block">
            <span className="font-heading text-xs tracking-[0.16em] text-white/65 uppercase">
                {label}
            </span>
            <span className="mt-2 block">{children}</span>
            {error ? (
                <span className="text-violet-light mt-2 block text-sm">
                    {error}
                </span>
            ) : null}
        </label>
    );
}
