import { Eyebrow, GradientHeading, HudPanel } from '@/Components/UI/Hud';
import { PublicHeroFrame } from '@/Components/UI/PublicHero';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';

export default function About() {
    return (
        <PublicLayout>
            <Head title="Methodology" />
            <PublicHeroFrame>
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
