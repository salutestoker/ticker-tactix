import { IconRenderer } from '@/Components/Icons/IconRenderer';
import { TaxonomyBadge } from '@/Components/UI/Hud';
import { TraderTypeCards } from '@/Components/UI/TraderTypeCards';
import PublicLayout from '@/Layouts/PublicLayout';
import type { Module, PageProps, Playbook, TraderType } from '@/types';
import { Head } from '@inertiajs/react';

interface Props extends PageProps {
    modules: Module[];
    playbooks: Playbook[];
    featuredPlaybooks: Playbook[];
    traderTypes: TraderType[];
}

const systemCards = [
    {
        title: 'Backtested Framework Logic',
        description:
            'Rules-based playbook architecture shaped through historical testing and disciplined deployment.',
        icon: 'backtested-brain-circuit',
        tone: 'violet',
    },
    {
        title: 'Structured Execution Layer',
        description:
            'A coordinated framework that translates market context into repeatable execution.',
        icon: 'command-cube',
        tone: 'seafoam',
    },
    {
        title: 'Versioned Access Model',
        description:
            'Playbooks are delivered through controlled versions with curated access and ongoing refinement.',
        icon: 'versioned-layers',
        tone: 'violet',
    },
] as const;

export default function Home({ traderTypes }: Props) {
    return (
        <PublicLayout>
            <Head title="Ticker-Tactix, LLC" />
            <section className="relative min-h-[980px] overflow-hidden px-6 pb-5">
                <div className="absolute inset-0 h-[50vw] bg-[url('/design/assets/images/bg-hero.jpg')] bg-cover bg-bottom opacity-95 md:h-[80vh]" />

                <img
                    className="absolute top-[15%] left-1/2 min-h-[80vw] w-full max-w-[2100px] min-w-300 -translate-x-1/2"
                    src="/design/assets/images/bg-abduction.png"
                    alt=""
                />

                <div className="via-midnight-blue/80 to-midnight-blue absolute inset-0 bg-gradient-to-b from-transparent" />
                <div className="relative mx-auto mt-[20vw] flex max-w-7xl flex-col items-center text-center md:mt-[260px]">
                    <img
                        className="h-40 w-auto max-w-none md:h-80"
                        src="/design/assets/images/logo-ticker-tactix-2026.png"
                        alt="Ticker Tactix"
                    />
                    <div className="">
                        <h1 className="text-seafoam-green font-heading text-5xl leading-[0.8] font-semibold uppercase sm:text-7xl lg:text-8xl">
                            <div style={{ lineHeight: 0.4 }}>
                                <span className="brand-gradient-text-reverse font-heading text-main-blue text-2xl tracking-[0.12em] uppercase sm:text-4xl">
                                    Trade With
                                </span>
                            </div>
                            Structure
                            <div>
                                <span className="brand-gradient-text text-[2.75rem] sm:text-[4.1rem] lg:text-[5.5rem]">
                                    Not Emotion
                                </span>
                            </div>
                        </h1>
                        {/*<p className="font-mono-display mx-auto mt-8 max-w-2xl text-lg leading-8 tracking-[0.12em] text-white/80 uppercase">*/}
                        {/*    A rules-based market operating system for traders*/}
                        {/*    who value structure over signals.*/}
                        {/*</p>*/}

                        <p className="font-mono-display mx-auto mt-8 max-w-2xl text-lg leading-8 tracking-[0.12em] text-white/80 uppercase">
                            A rules-based market operating system for traders
                            who value structure over signals.
                        </p>
                        <p className="mx-auto mt-4 max-w-2xl max-w-[500px] text-base text-white/80">
                            Custom indicators, structured playbooks, and
                            disciplined market frameworks for traders who want
                            decision support, not hype.
                        </p>

                        <TraderTypeCards
                            traderTypes={traderTypes}
                            className="mt-10"
                        />

                        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                            {/*<HudButton*/}
                            {/*    href={route('modules.index')}*/}
                            {/*    variant="solid"*/}
                            {/*>*/}
                            {/*    Explore Modules*/}
                            {/*</HudButton>*/}
                            {/*<HudButton*/}
                            {/*    href={route('playbooks.index')}*/}
                            {/*    tone="violet"*/}
                            {/*    variant="solid"*/}
                            {/*>*/}
                            {/*    Explore Playbooks*/}
                            {/*</HudButton>*/}
                        </div>
                    </div>

                    <div className="relative z-10 mt-6 w-full py-5 mix-blend-lighten">
                        <img
                            src="/design/assets/images/bg-home-how-ticker-tactix-works.png"
                            className="mx-auto"
                            alt=""
                        />
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

function TaxonomyList({ types }: { types: TraderType[] }) {
    if (!types.length) {
        return <span className="text-white/45">—</span>;
    }

    return (
        <div className="flex flex-wrap gap-2">
            {types.map((type) => (
                <TaxonomyBadge
                    key={type.id}
                    label={type.name}
                    color={type.color}
                />
            ))}
        </div>
    );
}

function SystemInfoCard({
    title,
    description,
    icon,
    tone,
}: {
    title: string;
    description: string;
    icon: string;
    tone: 'seafoam' | 'violet';
}) {
    const isSeafoam = tone === 'seafoam';
    const cardTone = isSeafoam
        ? 'border-seafoam-green/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_28px_rgba(0,250,146,0.18)]'
        : 'border-violet-light/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_28px_rgba(181,67,215,0.18)]';
    const iconTone = isSeafoam
        ? 'border-seafoam-green/70 bg-seafoam-green/10 text-seafoam-green shadow-[0_0_28px_rgba(0,250,146,0.2)]'
        : 'border-violet-light/70 bg-violet-light/10 text-violet-light shadow-[0_0_28px_rgba(181,67,215,0.2)]';

    return (
        <article
            className={`bg-panel-deep/92 flex min-h-32 items-center gap-6 rounded-[14px] border p-6 text-left lg:flex-col xl:flex-row ${cardTone}`}
        >
            <div
                className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-[14px] border ${iconTone}`}
            >
                <IconRenderer name={icon} className="h-12 w-12" />
            </div>
            <div>
                <h3 className="text-md leading-tight font-semibold text-white">
                    {title}
                </h3>
                <p className="mt-1 text-base leading-5 text-white/72">
                    {description}
                </p>
            </div>
        </article>
    );
}
