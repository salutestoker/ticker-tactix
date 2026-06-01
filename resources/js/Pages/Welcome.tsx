import { GradientHeading, HudButton, HudPanel } from '@/Components/UI/Hud';
import { PublicHeroFrame } from '@/Components/UI/PublicHero';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock3,
    LifeBuoy,
    Mail,
    ShieldCheck,
} from 'lucide-react';

const supportItems = [
    'Full name used at checkout',
    'Subscription email address',
    'TradingView username',
    'Date of subscription',
    'Short description of the issue',
];

export default function Welcome() {
    return (
        <PublicLayout>
            <Head title="Welcome" />
            <PublicHeroFrame className="px-4 pt-32 pb-20 sm:px-6">
                <div className="mx-auto max-w-5xl">
                    <main>
                        <div className="text-center">
                            <p className="font-heading text-seafoam-green text-xs font-semibold tracking-[0.28em] uppercase">
                                Welcome
                            </p>
                            <GradientHeading className="mx-auto mt-3 max-w-4xl">
                                Your Subscription Has Been Confirmed
                            </GradientHeading>
                            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/76">
                                Thank you for subscribing to Ticker-Tactix. Your
                                payment was received successfully, and access to
                                the invite-only TradingView indicator is granted
                                manually after verification.
                            </p>
                            <HudButton
                                className="mt-6"
                                href="https://discord.gg/HEkSTdxWjW"
                            >
                                Click here to join discord
                            </HudButton>
                        </div>

                        <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-6">
                            <HudPanel className="rounded-[14px] p-6 sm:p-8">
                                <div className="flex flex-col gap-5 sm:flex-row">
                                    <span className="border-seafoam-green/40 bg-seafoam-green/10 text-seafoam-green flex h-14 w-14 shrink-0 items-center justify-center rounded-full border">
                                        <CheckCircle2
                                            className="h-7 w-7"
                                            aria-hidden
                                        />
                                    </span>
                                    <div>
                                        <h2 className="font-heading text-xl tracking-[0.12em] text-white uppercase">
                                            Please Allow Time For Verification
                                        </h2>
                                        <p className="mt-4 leading-7 text-white/70">
                                            Access is not granted instantly.
                                            Verification times may vary
                                            depending on timing, payment review
                                            needs, and member volume.
                                        </p>
                                    </div>
                                </div>
                            </HudPanel>

                            <HudPanel className="rounded-[14px] p-6 sm:p-8">
                                <div className="flex flex-col gap-5 sm:flex-row">
                                    <span className="border-gold/40 bg-gold/10 text-gold flex h-14 w-14 shrink-0 items-center justify-center rounded-full border">
                                        <ShieldCheck
                                            className="h-7 w-7"
                                            aria-hidden
                                        />
                                    </span>
                                    <div>
                                        <h2 className="font-heading text-xl tracking-[0.12em] text-white uppercase">
                                            Next Step
                                        </h2>
                                        <p className="mt-4 leading-7 text-white/70">
                                            The Ticker-Tactix team will review
                                            your subscription details and
                                            complete manual TradingView access
                                            setup.
                                        </p>
                                        <div className="border-main-blue/20 mt-6 border-t pt-6">
                                            <div className="flex items-center gap-3">
                                                <Clock3
                                                    className="text-seafoam-green h-5 w-5"
                                                    aria-hidden
                                                />
                                                <p className="font-heading text-xs tracking-[0.16em] text-white/58 uppercase">
                                                    Manual Verification
                                                </p>
                                            </div>
                                            <p className="mt-3 text-sm leading-6 text-white/68">
                                                You do not need to subscribe
                                                again while verification is
                                                pending.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </HudPanel>

                            <HudPanel className="rounded-[14px] p-6 sm:p-8">
                                <div className="flex flex-col gap-5 sm:flex-row">
                                    <span className="border-main-blue/40 bg-main-blue/10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border text-sky-300">
                                        <LifeBuoy
                                            className="h-7 w-7"
                                            aria-hidden
                                        />
                                    </span>
                                    <div>
                                        <h2 className="font-heading text-xl tracking-[0.12em] text-white uppercase">
                                            Need Help?
                                        </h2>
                                        <p className="mt-4 leading-7 text-white/70">
                                            If you believe there is an issue
                                            with your onboarding, contact
                                            support and include the details
                                            below.
                                        </p>
                                        <ul className="mt-5 grid gap-3">
                                            {supportItems.map((item) => (
                                                <li
                                                    key={item}
                                                    className="flex items-start gap-3 text-sm leading-6 text-white/74"
                                                >
                                                    <span className="bg-seafoam-green mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="mt-7">
                                            <HudButton
                                                href="mailto:tickertactix@gmail.com"
                                                external
                                                tone="green"
                                            >
                                                <Mail
                                                    className="mr-2 h-4 w-4"
                                                    aria-hidden
                                                />
                                                Contact Support
                                            </HudButton>
                                        </div>
                                    </div>
                                </div>
                            </HudPanel>
                        </div>
                    </main>

                    <p className="mt-10 text-center text-sm leading-7 text-white/60">
                        Thank you again for joining Ticker-Tactix. We appreciate
                        your support and look forward to having you inside.
                    </p>
                </div>
            </PublicHeroFrame>
        </PublicLayout>
    );
}
