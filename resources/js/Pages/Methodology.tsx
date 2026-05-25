import {
    Eyebrow,
    GradientHeading,
    HudButton,
    HudPanel,
} from '@/Components/UI/Hud';
import { PublicHeroFrame } from '@/Components/UI/PublicHero';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';

const methodologyPillars = [
    {
        title: 'Structure First',
        copy: 'Every playbook begins with regime, trend, volatility, and participation context before execution is considered.',
        tone: 'text-seafoam-green',
    },
    {
        title: 'Signal Discipline',
        copy: 'Modules are designed to separate useful confirmation from noisy market movement.',
        tone: 'text-violet-light',
    },
    {
        title: 'Deployment Ready',
        copy: 'Playbooks convert module output into structured execution guidance matched to market, hold time, and access tier.',
        tone: 'text-gold',
    },
];

export default function Methodology() {
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

                    <p className="font-heading text-seafoam-green mx-auto mt-5 max-w-4xl text-sm leading-7 font-semibold tracking-[0.24em] uppercase sm:text-base">
                        Structure First. Signal Discipline. Deployment Ready.
                    </p>

                    <div className="mx-auto mt-10 max-w-xl text-center">
                        <p className="mt-8 text-lg leading-8 text-white/75">
                            Ticker-Tactix organizes market decisions into
                            modules, categories, and deployable playbooks so
                            traders can constrain risk, reduce emotional
                            override, and repeat the same decision process under
                            pressure.
                        </p>

                        <p className="mt-5 text-lg leading-8 text-white/70">
                            Rather than starting with excitement, opinion, or
                            impulse, the system starts with structure. Each
                            layer is designed to narrow the field of possible
                            decisions before execution is considered.
                        </p>
                    </div>
                </div>

                <div className="mx-auto mt-16 grid max-w-6xl gap-6 md:grid-cols-3">
                    {methodologyPillars.map(({ title, copy, tone }, index) => (
                        <HudPanel key={title} className="relative p-7">
                            <div className="font-heading text-main-blue mb-5 text-xs tracking-[0.24em] uppercase">
                                Layer 0{index + 1}
                            </div>
                            <h2
                                className={`font-heading text-lg tracking-[0.12em] uppercase ${tone}`}
                            >
                                {title}
                            </h2>
                            <p className="mt-4 leading-7 text-white/68">
                                {copy}
                            </p>
                        </HudPanel>
                    ))}
                </div>

                <HudPanel className="mx-auto mt-14 max-w-4xl p-8 text-center sm:p-10">
                    <h2 className="font-heading text-2xl leading-tight font-semibold tracking-[0.08em] text-white uppercase sm:text-4xl">
                        Build Decisions Around Structure
                    </h2>
                    <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/72">
                        Explore the system layers behind Ticker-Tactix, then
                        find the trader path that fits your market, pace, and
                        level of execution structure.
                    </p>
                    <div className="mt-8">
                        <HudButton href={route('trader-types')} variant="solid">
                            Find Your Trader Type
                        </HudButton>
                    </div>
                </HudPanel>
            </PublicHeroFrame>
        </PublicLayout>
    );
}
