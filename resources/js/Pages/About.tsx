import { Eyebrow, GradientHeading, HudPanel } from '@/Components/UI/Hud';
import { PublicHeroFrame } from '@/Components/UI/PublicHero';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';

export default function About() {
    return (
        <PublicLayout>
            <Head title="Methodology" />
            <PublicHeroFrame>
                <div className="relative z-10 flex w-[102vw] translate-x-[-2%] -translate-y-[10%] justify-center mix-blend-lighten">
                    <img
                        src="/design/assets/images/bg-methodology.png"
                        className=""
                        alt=""
                    />
                </div>
                <div className="mx-auto max-w-5xl text-center">
                    <Eyebrow>Methodology</Eyebrow>
                    <GradientHeading>
                        Rules-Based Market Operations
                    </GradientHeading>
                    <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-white/75">
                        Ticker Tactix organizes market decisions into modules,
                        categories, and deployable playbooks so traders can
                        constrain risk, reduce emotional override, and repeat
                        the same decision process under pressure.
                    </p>
                </div>
                <div className="mx-auto my-20 max-w-5xl text-center">
                    <Eyebrow>Rules-Based Market Operations</Eyebrow>
                    <GradientHeading className="mx-auto max-w-5xl">
                        <span className="text-3xl sm:text-5xl">
                            How Ticker-Tactix brings structure to decisions.
                        </span>
                    </GradientHeading>
                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/75">
                        Ticker-Tactix organizes market decisions into modules
                        and deployable playbooks so traders can reduce emotional
                        override, constrain risk, and repeat the same decision
                        process under pressure. Rather than starting with
                        excitement, opinion, or impulse, the system starts with
                        structure. Each layer is designed to narrow the field of
                        possible decisions before execution is ever considered.
                    </p>
                    <img
                        src="/design/assets/images/system.jpg"
                        className="mt-6 hidden mix-blend-lighten"
                        alt=""
                    />
                </div>
                <div className="mx-auto mt-14 grid max-w-6xl gap-6 md:grid-cols-3">
                    {[
                        [
                            'Structure First',
                            'Every playbook starts with regime, trend, volatility, and participation context before execution.',
                        ],
                        [
                            'Signal Discipline',
                            'Modules are designed to separate useful confirmation from noisy market movement.',
                        ],
                        [
                            'Deployment Ready',
                            'Playbooks convert module output into execution guidance matched to market, hold time, and access tier.',
                        ],
                    ].map(([title, copy]) => (
                        <HudPanel key={title} className="p-7">
                            <h2 className="font-heading text-seafoam-green text-lg tracking-[0.12em] uppercase">
                                {title}
                            </h2>
                            <p className="mt-4 leading-7 text-white/68">
                                {copy}
                            </p>
                        </HudPanel>
                    ))}
                </div>
            </PublicHeroFrame>
        </PublicLayout>
    );
}
