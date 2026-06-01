import { IconRenderer } from '@/Components/Icons/IconRenderer';
import {
    AccessBadge,
    GradientHeading,
    HudPanel,
    TaxonomyBadge,
} from '@/Components/UI/Hud';
import { PublicHeroFrame } from '@/Components/UI/PublicHero';
import PublicLayout from '@/Layouts/PublicLayout';
import { formatVersion } from '@/lib/format';
import type { Module, Playbook, TraderType } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Children, type ReactNode } from 'react';

type Props = {
    traderType: TraderType;
};

type Tone = 'green' | 'violet' | 'gold' | 'blue';

const toneClasses: Record<
    Tone,
    {
        border: string;
        bg: string;
        text: string;
        shadow: string;
    }
> = {
    green: {
        border: 'border-seafoam-green/45',
        bg: 'bg-seafoam-green/10',
        text: 'text-seafoam-green',
        shadow: 'shadow-[0_0_28px_rgba(0,250,146,0.14)]',
    },
    violet: {
        border: 'border-violet-light/45',
        bg: 'bg-violet-light/10',
        text: 'text-violet-light',
        shadow: 'shadow-[0_0_28px_rgba(181,67,215,0.14)]',
    },
    gold: {
        border: 'border-gold/45',
        bg: 'bg-gold/10',
        text: 'text-gold',
        shadow: 'shadow-[0_0_28px_rgba(243,191,56,0.14)]',
    },
    blue: {
        border: 'border-main-blue/45',
        bg: 'bg-main-blue/10',
        text: 'text-sky-300',
        shadow: 'shadow-[0_0_28px_rgba(55,100,245,0.14)]',
    },
};

export default function TraderTypesShow({ traderType }: Props) {
    const modules = traderType.modules ?? [];
    const playbooks = traderType.playbooks ?? [];
    const tone = toneForTraderType(traderType.color);
    const activeTone = toneClasses[tone];

    return (
        <PublicLayout
            adminEditHref={route('admin.trader-types.edit', traderType.id)}
        >
            <Head title={traderType.name} />
            <PublicHeroFrame className="px-4 pt-32 pb-20 sm:px-6">
                <div className="relative mx-auto max-w-7xl">
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
                        <main>
                            <div className="mb-5 flex flex-wrap items-center gap-3">
                                <span
                                    className={`flex h-16 w-16 items-center justify-center rounded-[14px] border ${activeTone.border} ${activeTone.bg} ${activeTone.text} ${activeTone.shadow}`}
                                >
                                    <IconRenderer
                                        name={traderType.icon}
                                        className="h-9 w-9"
                                    />
                                </span>
                                <TaxonomyBadge
                                    label="Trader Type"
                                    color={traderType.color}
                                />
                            </div>

                            <GradientHeading className="max-w-4xl">
                                {traderType.name}
                            </GradientHeading>
                            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/76 sm:text-xl sm:leading-9">
                                {traderType.description ||
                                    'A Ticker-Tactix framework path for matching market pace, structure level, and execution support.'}
                            </p>

                            <HudPanel className="mt-8 overflow-hidden rounded-[14px]">
                                <DetailRow
                                    icon="user"
                                    title="Trader Profile"
                                    tone={tone}
                                >
                                    <p>
                                        This path groups the modules and
                                        playbooks designed for traders who share
                                        this market, structure level, and
                                        execution rhythm.
                                    </p>
                                </DetailRow>
                                <DetailRow
                                    icon="composite-engine"
                                    title="Modules"
                                    tone="green"
                                >
                                    <p>
                                        Modules organize the market information
                                        this trader type needs before execution
                                        is considered.
                                    </p>
                                </DetailRow>
                                <DetailRow
                                    icon="playbooks-book-open"
                                    title="Playbooks"
                                    tone="violet"
                                    isLast
                                >
                                    <p>
                                        Playbooks convert module output into
                                        structured execution guidance matched to
                                        the trader profile.
                                    </p>
                                </DetailRow>
                            </HudPanel>
                        </main>

                        <aside className="lg:sticky lg:top-28">
                            <HudPanel className="rounded-[14px] p-6 sm:p-7">
                                <dl className="space-y-5 text-sm">
                                    <Meta
                                        label="Profile"
                                        value={traderType.name}
                                    />
                                    <Meta
                                        label="Published Modules"
                                        value={String(modules.length)}
                                    />
                                    <Meta
                                        label="Published Playbooks"
                                        value={String(playbooks.length)}
                                    />
                                </dl>
                            </HudPanel>
                        </aside>
                    </div>

                    {modules.length === 1 && playbooks.length === 1 ? (
                        <PairedCatalogSection
                            module={modules[0]}
                            playbook={playbooks[0]}
                        />
                    ) : (
                        <>
                            <CatalogSection
                                className="mt-12"
                                eyebrow="Decision Tools"
                                title="Modules"
                                emptyCopy="No published modules are currently assigned to this trader type."
                            >
                                {modules.map((module) => (
                                    <ModuleCard
                                        key={module.id}
                                        module={module}
                                    />
                                ))}
                            </CatalogSection>

                            <CatalogSection
                                className="mt-12"
                                eyebrow="Execution Frameworks"
                                title="Playbooks"
                                emptyCopy="No published playbooks are currently assigned to this trader type."
                            >
                                {playbooks.map((playbook) => (
                                    <PlaybookCard
                                        key={playbook.id}
                                        playbook={playbook}
                                    />
                                ))}
                            </CatalogSection>
                        </>
                    )}
                </div>
            </PublicHeroFrame>
        </PublicLayout>
    );
}

function DetailRow({
    icon,
    title,
    tone,
    children,
    isLast = false,
}: {
    icon: string;
    title: string;
    tone: Tone;
    children: ReactNode;
    isLast?: boolean;
}) {
    const activeTone = toneClasses[tone];

    return (
        <section
            className={`grid gap-5 px-5 py-6 sm:grid-cols-[240px_1fr] sm:px-7 ${isLast ? '' : 'border-main-blue/20 border-b'}`}
        >
            <div className="flex items-center gap-4">
                <span
                    className={`bg-panel-deep flex h-12 w-12 shrink-0 items-center justify-center rounded-full border ${activeTone.border} ${activeTone.text}`}
                >
                    <IconRenderer name={icon} className="h-7 w-7" />
                </span>
                <h2
                    className={`font-heading text-base leading-6 tracking-[0.16em] uppercase ${activeTone.text}`}
                >
                    {title}
                </h2>
            </div>
            <div className="text-sm leading-7 text-white/72 sm:text-base">
                {children}
            </div>
        </section>
    );
}

function Meta({ label, value }: { label: string; value?: string | null }) {
    return (
        <div>
            <dt className="font-heading text-xs tracking-[0.16em] text-white/45 uppercase">
                {label}
            </dt>
            <dd className="mt-1 text-white">{value || '-'}</dd>
        </div>
    );
}

function PairedCatalogSection({
    module,
    playbook,
}: {
    module: Module;
    playbook: Playbook;
}) {
    return (
        <section className="mt-12">
            <p className="font-heading text-seafoam-green text-xs tracking-[0.22em] uppercase">
                Recommended Stack
            </p>
            <h2 className="font-heading mt-2 text-2xl tracking-[0.08em] text-white uppercase">
                Module + Playbook
            </h2>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <ModuleCard module={module} />
                <PlaybookCard playbook={playbook} />
            </div>
        </section>
    );
}

function CatalogSection({
    children,
    className = '',
    emptyCopy,
    eyebrow,
    title,
}: {
    children: ReactNode;
    className?: string;
    emptyCopy: string;
    eyebrow: string;
    title: string;
}) {
    const items = Children.toArray(children);

    return (
        <section className={className}>
            <p className="font-heading text-seafoam-green text-xs tracking-[0.22em] uppercase">
                {eyebrow}
            </p>
            <h2 className="font-heading mt-2 text-2xl tracking-[0.08em] text-white uppercase">
                {title}
            </h2>
            {items.length ? (
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {items}
                </div>
            ) : (
                <HudPanel className="mt-5 rounded-[14px] p-6 text-white/65">
                    {emptyCopy}
                </HudPanel>
            )}
        </section>
    );
}

function ModuleCard({ module }: { module: Module }) {
    return (
        <Link href={route('modules.show', module.slug)} className="group block">
            <HudPanel className="hover:border-seafoam-green/60 flex h-full flex-col rounded-[14px] p-5 transition hover:shadow-[0_0_36px_rgba(0,250,146,0.14)]">
                <CatalogCardHeader
                    imageUrl={module.image_url}
                    icon={module.icon}
                    title={module.title}
                    tone="green"
                />
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-white/70">
                    {module.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                    {module.market ? (
                        <TaxonomyBadge
                            label={module.market.name}
                            color={module.market.color}
                        />
                    ) : null}
                    <span className="font-heading text-seafoam-green border-seafoam-green/35 bg-seafoam-green/10 inline-flex rounded-sm border px-3 py-1 text-[0.65rem] tracking-[0.12em] uppercase">
                        {formatVersion(module.version)}
                    </span>
                </div>
                <span className="font-heading text-seafoam-green mt-auto inline-flex items-center gap-1 pt-5 text-xs tracking-[0.14em] uppercase">
                    Explore Module
                    <IconRenderer
                        name="chevron-right"
                        className="h-4 w-4 transition group-hover:translate-x-1"
                    />
                </span>
            </HudPanel>
        </Link>
    );
}

function PlaybookCard({ playbook }: { playbook: Playbook }) {
    return (
        <Link
            href={route('playbooks.show', playbook.slug)}
            className="group block"
        >
            <HudPanel className="hover:border-violet-light/60 flex h-full flex-col rounded-[14px] p-5 transition hover:shadow-[0_0_36px_rgba(181,67,215,0.14)]">
                <CatalogCardHeader
                    imageUrl={playbook.logo_url}
                    icon={playbook.icon}
                    title={playbook.title}
                    tone="violet"
                />
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-white/70">
                    {playbook.best_for}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                    {playbook.market ? (
                        <TaxonomyBadge
                            label={playbook.market.name}
                            color={playbook.market.color}
                        />
                    ) : null}
                    <AccessBadge access={playbook.access} />
                </div>
                <span className="font-heading text-violet-light mt-auto inline-flex items-center gap-1 pt-5 text-xs tracking-[0.14em] uppercase">
                    Explore Playbook
                    <IconRenderer
                        name="chevron-right"
                        className="h-4 w-4 transition group-hover:translate-x-1"
                    />
                </span>
            </HudPanel>
        </Link>
    );
}

function CatalogCardHeader({
    imageUrl,
    icon,
    title,
    tone,
}: {
    imageUrl?: string | null;
    icon?: string | null;
    title: string;
    tone: 'green' | 'violet';
}) {
    const activeTone = toneClasses[tone];

    return (
        <div className="flex items-center gap-4">
            <span
                className={`bg-midnight-blue flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border ${activeTone.border} ${activeTone.bg} ${activeTone.text}`}
            >
                {imageUrl ? (
                    <img
                        className="h-full w-full object-cover mix-blend-lighten"
                        src={imageUrl}
                        alt=""
                    />
                ) : (
                    <IconRenderer name={icon} className="h-8 w-8" />
                )}
            </span>
            <h3 className="font-heading text-base leading-6 tracking-[0.08em] text-white uppercase">
                {title}
            </h3>
        </div>
    );
}

function toneForTraderType(color?: string | null): Tone {
    if (color === 'seafoam-green') {
        return 'green';
    }

    if (color === 'gold') {
        return 'gold';
    }

    if (color === 'main-blue') {
        return 'blue';
    }

    return 'violet';
}
