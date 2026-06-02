import { HudButton } from '@/Components/UI/Hud';
import { Dialog, DialogPanel } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import { useRef, useState } from 'react';

export default function DeleteUserForm() {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section>
            <header>
                <h2 className="font-heading text-violet-light text-sm tracking-[0.16em] uppercase">
                    Delete Account
                </h2>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/60">
                    Once your account is deleted, all of its resources and data
                    will be permanently deleted. This action cannot be undone.
                </p>
            </header>

            <div className="mt-5">
                <button
                    type="button"
                    className="border-violet-light/55 bg-violet-light/10 text-violet-light hover:border-violet-light font-heading focus-visible:ring-violet-light focus-visible:ring-offset-midnight-blue inline-flex min-h-11 items-center justify-center rounded-sm border px-5 py-3 text-xs font-semibold tracking-[0.14em] uppercase transition hover:brightness-125 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                    onClick={confirmUserDeletion}
                >
                    Delete Account
                </button>
            </div>

            <Dialog
                className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-6"
                open={confirmingUserDeletion}
                onClose={closeModal}
            >
                <div className="bg-midnight-blue/85 fixed inset-0 backdrop-blur-sm" />
                <DialogPanel className="border-main-blue/35 bg-panel relative w-full max-w-2xl rounded-md border p-6 shadow-[0_0_40px_rgba(55,100,245,0.22)]">
                    <form onSubmit={deleteUser}>
                        <h2 className="font-heading text-violet-light text-sm tracking-[0.16em] uppercase">
                            Confirm Account Deletion
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-white/65">
                            Enter your password to permanently delete your
                            account.
                        </p>

                        <div className="mt-5">
                            <input
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                className={input}
                                autoFocus
                                placeholder="Password"
                            />

                            {errors.password ? (
                                <span className="font-body text-violet-light mt-2 block text-sm tracking-normal normal-case">
                                    {errors.password}
                                </span>
                            ) : null}
                        </div>

                        <div className="mt-6 flex flex-wrap justify-end gap-3">
                            <HudButton
                                type="button"
                                tone="blue"
                                onClick={closeModal}
                            >
                                Cancel
                            </HudButton>
                            <button
                                type="submit"
                                disabled={processing}
                                className="border-violet-light/55 bg-violet-light/10 text-violet-light hover:border-violet-light font-heading inline-flex min-h-11 items-center justify-center rounded-sm border px-5 py-3 text-xs font-semibold tracking-[0.14em] uppercase transition hover:brightness-125 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Delete Account
                            </button>
                        </div>
                    </form>
                </DialogPanel>
            </Dialog>
        </section>
    );
}

const input =
    'w-full rounded-sm border border-main-blue/35 bg-panel-deep px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-seafoam-green';
