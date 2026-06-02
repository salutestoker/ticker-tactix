import { HudButton } from '@/Components/UI/Hud';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import type { FormEventHandler, ReactNode } from 'react';
import { useRef } from 'react';

export default function UpdatePasswordForm() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section>
            <header>
                <h2 className="font-heading text-sm tracking-[0.16em] text-white uppercase">
                    Update Password
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/60">
                    Ensure your account is using a long, random password to stay
                    secure.
                </p>
            </header>

            <form
                onSubmit={updatePassword}
                className="mt-5 grid gap-5 xl:grid-cols-3"
            >
                <Field label="Current Password" error={errors.current_password}>
                    <input
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData('current_password', e.target.value)
                        }
                        type="password"
                        className={input}
                        autoComplete="current-password"
                    />
                </Field>

                <Field label="New Password" error={errors.password}>
                    <input
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className={input}
                        autoComplete="new-password"
                    />
                </Field>

                <Field
                    label="Confirm Password"
                    error={errors.password_confirmation}
                >
                    <input
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        type="password"
                        className={input}
                        autoComplete="new-password"
                    />
                </Field>

                <div className="flex items-center gap-4 xl:col-span-3">
                    <HudButton type="submit" disabled={processing}>
                        Save Password
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
