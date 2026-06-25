import { Eyebrow, GradientHeading, HudButton, HudPanel } from '@/Components/UI/Hud';
import { PublicHeroFrame } from '@/Components/UI/PublicHero';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, useForm } from '@inertiajs/react';
import type { FormEvent, ReactNode } from 'react';

type ContactFormData = {
    checkout_name: string;
    subscription_email: string;
    tradingview_username: string;
    subscription_date: string;
    issue: string;
};

export default function Contact() {
    const { data, setData, post, processing, errors, reset } =
        useForm<ContactFormData>({
            checkout_name: '',
            subscription_email: '',
            tradingview_username: '',
            subscription_date: '',
            issue: '',
        });

    function submit(event: FormEvent) {
        event.preventDefault();

        post(route('contact.send'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    }

    return (
        <PublicLayout>
            <Head title="Contact" />
            <PublicHeroFrame className="px-4 pt-32 pb-20 sm:px-6">
                <div className="pointer-events-none relative z-0 flex w-[102vw] translate-x-[-2%] -translate-y-[15%] justify-center mix-blend-lighten">
                    <img
                        src="/design/assets/images/bg-testimonials.jpg"
                        className=""
                        alt=""
                    />
                </div>
                <div className="mx-auto max-w-5xl">
                    <div className="text-center">
                        <Eyebrow>Contact</Eyebrow>
                        <GradientHeading>Contact Support</GradientHeading>
                        <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/75">
                            Send the onboarding details needed to investigate
                            subscription access, TradingView setup, or Discord
                            membership issues.
                        </p>
                    </div>

                    <HudPanel className="mx-auto mt-10 max-w-3xl rounded-[14px] p-6 sm:p-8">
                        <form className="grid gap-5" onSubmit={submit}>
                            <Field
                                label="Full name used at checkout"
                                error={errors.checkout_name}
                            >
                                <input
                                    className={inputClass}
                                    value={data.checkout_name}
                                    onChange={(event) =>
                                        setData(
                                            'checkout_name',
                                            event.target.value,
                                        )
                                    }
                                    autoComplete="name"
                                />
                            </Field>

                            <Field
                                label="Subscription email address"
                                error={errors.subscription_email}
                            >
                                <input
                                    className={inputClass}
                                    value={data.subscription_email}
                                    type="email"
                                    onChange={(event) =>
                                        setData(
                                            'subscription_email',
                                            event.target.value,
                                        )
                                    }
                                    autoComplete="email"
                                />
                            </Field>

                            <Field
                                label="TradingView username"
                                error={errors.tradingview_username}
                            >
                                <input
                                    className={inputClass}
                                    value={data.tradingview_username}
                                    onChange={(event) =>
                                        setData(
                                            'tradingview_username',
                                            event.target.value,
                                        )
                                    }
                                    autoComplete="username"
                                />
                            </Field>

                            <Field
                                label="Date of subscription"
                                error={errors.subscription_date}
                            >
                                <input
                                    className={inputClass}
                                    value={data.subscription_date}
                                    type="date"
                                    onChange={(event) =>
                                        setData(
                                            'subscription_date',
                                            event.target.value,
                                        )
                                    }
                                />
                            </Field>

                            <Field
                                label="Short description of the issue"
                                error={errors.issue}
                            >
                                <textarea
                                    className={`${inputClass} min-h-36 resize-y`}
                                    value={data.issue}
                                    onChange={(event) =>
                                        setData('issue', event.target.value)
                                    }
                                />
                            </Field>

                            <div>
                                <HudButton
                                    type="submit"
                                    disabled={processing}
                                    tone="green"
                                    variant="solid"
                                >
                                    {processing
                                        ? 'Sending...'
                                        : 'Send Support Request'}
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
            <span className="font-heading text-[0.7rem] tracking-[0.16em] text-white/58 uppercase">
                {label}
            </span>
            {children}
            {error ? (
                <span
                    className="mt-2 block text-sm font-semibold text-[#ff7a82]"
                    role="alert"
                >
                    {error}
                </span>
            ) : null}
        </label>
    );
}

const inputClass =
    'mt-2 w-full rounded-sm border border-main-blue/35 bg-panel-deep px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-seafoam-green focus:ring-2 focus:ring-seafoam-green/25';
