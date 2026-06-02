import { HudButton } from '@/Components/UI/Hud';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import type { FormEventHandler, ReactNode } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user?.name ?? '',
            email: user?.email ?? '',
        });

    if (!user) {
        return null;
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section>
            <header>
                <h2 className="font-heading text-sm tracking-[0.16em] text-white uppercase">
                    Profile Information
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/60">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-5 grid gap-5 xl:grid-cols-2">
                <Field label="Name" error={errors.name}>
                    <input
                        id="name"
                        className={input}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                    />
                </Field>
                <Field label="Email" error={errors.email}>
                    <input
                        id="email"
                        type="email"
                        className={input}
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                </Field>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="xl:col-span-2">
                        <p className="text-sm text-white/70">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="text-seafoam-green ml-1 underline-offset-4 hover:underline"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="text-seafoam-green mt-2 text-sm font-medium">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 xl:col-span-2">
                    <HudButton type="submit" disabled={processing}>
                        Save Profile
                    </HudButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-seafoam-green text-sm">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}

const input =
    'mt-2 w-full rounded-sm border border-main-blue/35 bg-panel-deep px-4 py-3 text-white outline-none transition focus:border-seafoam-green';

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
