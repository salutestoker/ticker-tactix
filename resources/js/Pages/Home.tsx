import { IconRenderer } from '@/Components/Icons/IconRenderer';
import {
    AccessBadge,
    Eyebrow,
    GradientHeading,
    HudButton,
    HudPanel,
} from '@/Components/UI/Hud';
import PublicLayout from '@/Layouts/PublicLayout';
import { formatPrice } from '@/lib/format';
import type { Module, PageProps, Playbook } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface Props extends PageProps {
    modules: Module[];
    playbooks: Playbook[];
    featuredPlaybooks: Playbook[];
}

const systemCards = [
    {
        title: 'Backtested System Logic',
        description:
            'Rules-based logic validated through historical testing and controlled deployment.',
        icon: 'backtested-brain-circuit',
        tone: 'violet',
    },
    {
        title: 'Structured Command Center',
        description:
            'Centralized intelligence that processes, validates, and coordinates all modules.',
        icon: 'command-cube',
        tone: 'seafoam',
    },
    {
        title: 'Versioned Access Model',
        description:
            'Modules are released in versions with controlled access and ongoing updates.',
        icon: 'versioned-layers',
        tone: 'violet',
    },
] as const;

export default function Home({ modules, playbooks }: Props) {
    return (
        <PublicLayout>
            <Head title="Trade With Structure, Not Emotion" />
            <section className="relative min-h-[980px] overflow-hidden px-6 py-28">
                <div className="absolute inset-0 h-[50vw] bg-[url('/design/assets/images/bg-hero.jpg')] bg-cover bg-bottom opacity-95 md:h-[50vh]" />

                <img
                    className="absolute top-[15%] left-1/2 min-h-[80vw] w-full max-w-[2100px] min-w-300 -translate-x-1/2"
                    src="/design/assets/images/bg-abduction.png"
                    alt=""
                />

                <div className="via-midnight-blue/80 to-midnight-blue absolute inset-0 bg-gradient-to-b from-transparent" />
                <div className="relative mx-auto flex max-w-7xl flex-col items-center text-center">
                    <img
                        className="mt-16 h-32 w-auto object-contain sm:h-40"
                        src="/design/assets/images/logo-ticker-tactix-2026.png"
                        alt="Ticker Tactix"
                    />
                    <div className="mt-1">
                        <h1 className="text-seafoam-green font-heading text-5xl leading-[0.8] font-semibold uppercase sm:text-7xl lg:text-8xl">
                            <div>
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
                        <p className="font-mono-display mx-auto mt-8 max-w-2xl text-lg leading-8 tracking-[0.12em] text-white/80 uppercase">
                            A rules-based market operating system for traders
                            who value structure over signals.
                        </p>
                        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                            <HudButton
                                href={route('modules.index')}
                                variant="solid"
                            >
                                Explore Modules
                            </HudButton>
                            <HudButton
                                href={route('playbooks.index')}
                                tone="violet"
                                variant="solid"
                            >
                                Explore Playbooks
                            </HudButton>
                        </div>
                    </div>

                    <div className="mt-36 w-full">
                        <Eyebrow>System Overview</Eyebrow>
                        <GradientHeading className="mx-auto max-w-5xl">
                            How The Ticker-Tactix System Constrains Decisions
                        </GradientHeading>
                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/75">
                            Market analysis flows from directional bias, to
                            participation, to volatility assessment, into
                            structured playbook execution.
                        </p>
                    </div>
                </div>
            </section>

            <section className="from-main-blue-bright to-midnight-blue bg-gradient-to-b px-6 py-24">
                <div className="mx-auto max-w-7xl">
                    <Eyebrow>System Modules</Eyebrow>
                    <GradientHeading className="text-center">
                        Module Matrix
                    </GradientHeading>
                    <p className="mx-auto mt-5 max-w-2xl text-center text-lg text-white/75">
                        Specialized components that power the Ticker-Tactix
                        system. Each module has a unique role in producing
                        high-probability signals.
                    </p>
                    <div className="mt-12 grid gap-6 lg:grid-cols-3">
                        {systemCards.map((card) => (
                            <SystemInfoCard key={card.title} {...card} />
                        ))}
                    </div>
                    <HudPanel className="mt-10 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse text-left text-sm">
                                <thead className="font-heading text-seafoam-green text-xs tracking-[0.14em] uppercase">
                                    <tr>
                                        <th className="px-6 py-5">Module</th>
                                        <th className="px-6 py-5">Purpose</th>
                                        <th className="px-6 py-5">
                                            What It Does
                                        </th>
                                        <th className="px-6 py-5">
                                            Key Output
                                        </th>
                                        <th className="px-6 py-5">Version</th>
                                        <th className="px-6 py-5">Access</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {modules.slice(0, 8).map((module) => (
                                        <tr
                                            key={module.id}
                                            className="border-main-blue/20 border-t"
                                        >
                                            <td className="px-6 py-5">
                                                <Link
                                                    href={route(
                                                        'modules.show',
                                                        module.slug,
                                                    )}
                                                    className="text-seafoam-green flex items-center gap-4 hover:text-white"
                                                >
                                                    <IconRenderer
                                                        name={module.icon}
                                                        className="h-8 w-8"
                                                    />
                                                    <span className="font-heading text-sm tracking-[0.08em] uppercase">
                                                        {module.title}
                                                    </span>
                                                </Link>
                                            </td>
                                            <td className="px-6 py-5 text-white/75">
                                                {module.purpose}
                                            </td>
                                            <td className="px-6 py-5 text-white/65">
                                                {module.what_it_does}
                                            </td>
                                            <td className="text-violet-light px-6 py-5">
                                                {module.key_output}
                                            </td>
                                            <td className="text-seafoam-green px-6 py-5">
                                                {module.version}
                                            </td>
                                            <td className="px-6 py-5">
                                                <AccessBadge
                                                    access={module.access}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </HudPanel>
                </div>
            </section>

            <section className="bg-midnight-blue px-6 py-24">
                <div className="mx-auto max-w-7xl">
                    <Eyebrow>Playbook Access</Eyebrow>
                    <GradientHeading className="text-center">
                        Deployment Matrix
                    </GradientHeading>
                    <p className="mx-auto mt-5 max-w-2xl text-center text-lg text-white/75">
                        Choose the framework that matches your market, holding
                        period, and execution speed.
                    </p>
                    <HudPanel className="mt-12 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead className="font-heading text-xs tracking-[0.14em] text-white/60 uppercase">
                                    <tr>
                                        <th className="px-6 py-5">Category</th>
                                        <th className="px-6 py-5">
                                            Playbook / Framework
                                        </th>
                                        <th className="px-6 py-5">Access</th>
                                        <th className="px-6 py-5">Market</th>
                                        <th className="px-6 py-5">Best For</th>
                                        <th className="px-6 py-5">Avg Hold</th>
                                        <th className="px-6 py-5">Price</th>
                                        <th className="px-6 py-5">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {playbooks.map((playbook) => (
                                        <tr
                                            key={playbook.id}
                                            className="border-main-blue/20 border-t"
                                        >
                                            <td className="text-seafoam-green px-6 py-5">
                                                {playbook.category?.name}
                                            </td>
                                            <td className="px-6 py-5 font-medium text-white">
                                                <Link
                                                    href={route(
                                                        'playbooks.show',
                                                        playbook.slug,
                                                    )}
                                                >
                                                    {playbook.framework}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-5">
                                                <AccessBadge
                                                    access={playbook.access}
                                                />
                                            </td>
                                            <td className="px-6 py-5 text-white/70">
                                                {playbook.market}
                                            </td>
                                            <td className="px-6 py-5 text-white/65">
                                                {playbook.best_for}
                                            </td>
                                            <td className="px-6 py-5 text-white/70">
                                                {playbook.average_hold_time ??
                                                    '—'}
                                            </td>
                                            <td className="font-heading text-seafoam-green px-6 py-5">
                                                {formatPrice(
                                                    playbook.price_cents,
                                                    playbook.currency,
                                                )}
                                            </td>
                                            <td className="px-6 py-5">
                                                <HudButton
                                                    href={
                                                        playbook.payment_url ||
                                                        route(
                                                            'playbooks.show',
                                                            playbook.slug,
                                                        )
                                                    }
                                                    external={Boolean(
                                                        playbook.payment_url,
                                                    )}
                                                    tone={
                                                        playbook.payment_url
                                                            ? 'green'
                                                            : 'violet'
                                                    }
                                                >
                                                    {playbook.payment_url
                                                        ? 'Unlock'
                                                        : 'Coming Soon'}
                                                </HudButton>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </HudPanel>
                </div>
            </section>
        </PublicLayout>
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
            className={`bg-panel-deep/92 flex min-h-32 items-center gap-6 rounded-[14px] border p-6 text-left ${cardTone}`}
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
