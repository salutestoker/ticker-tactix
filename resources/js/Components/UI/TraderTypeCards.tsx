import { IconRenderer } from '@/Components/Icons/IconRenderer';
import type { TraderType } from '@/types';
import { Link } from '@inertiajs/react';

type TaxonomyColor = 'violet-light' | 'seafoam-green' | 'gold';

type TraderTypeCard = {
    number: number;
    title: string;
    description: string;
    modules: string[];
    playbooks: string[];
    traderTypeColor: TaxonomyColor;
    icon: string;
};

const toneClasses: Record<
    TaxonomyColor,
    {
        card: string;
        number: string;
        title: string;
        divider: string;
        bullet: string;
        glow: string;
    }
> = {
    'violet-light': {
        card: 'border-violet-light/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_18px_rgba(181,67,215,0.09)]',
        number: 'border-violet-light/55 bg-violet-light/10 text-white shadow-[0_0_12px_rgba(181,67,215,0.12)]',
        title: 'text-violet-light',
        divider: 'border-violet-light/28',
        bullet: 'bg-violet-light shadow-[0_0_7px_rgba(181,67,215,0.22)]',
        glow: 'from-violet-light/8',
    },
    'seafoam-green': {
        card: 'border-seafoam-green/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_18px_rgba(0,250,146,0.09)]',
        number: 'border-seafoam-green/55 bg-seafoam-green/10 text-white shadow-[0_0_12px_rgba(0,250,146,0.12)]',
        title: 'text-seafoam-green',
        divider: 'border-seafoam-green/28',
        bullet: 'bg-seafoam-green shadow-[0_0_7px_rgba(0,250,146,0.22)]',
        glow: 'from-seafoam-green/8',
    },
    gold: {
        card: 'border-gold/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_18px_rgba(243,191,56,0.09)]',
        number: 'border-gold/55 bg-gold/10 text-white shadow-[0_0_12px_rgba(243,191,56,0.12)]',
        title: 'text-gold',
        divider: 'border-gold/28',
        bullet: 'bg-gold shadow-[0_0_7px_rgba(243,191,56,0.22)]',
        glow: 'from-gold/8',
    },
};

export function TraderTypeCards({
    traderTypes,
    className = '',
}: {
    traderTypes: TraderType[];
    className?: string;
}) {
    const cards = traderTypes.map(toTraderTypeCard);
    const isHomeRoute = route().current('home');
    const cardsGrid = (
        <div className="mx-auto mt-12 grid max-w-7xl gap-6 lg:grid-cols-2">
            {cards.map((traderType) => (
                <TraderTypePanel
                    key={traderType.title}
                    traderType={traderType}
                />
            ))}
        </div>
    );

    return (
        <div className={className}>
            {isHomeRoute ? (
                <>{cardsGrid}</>
            ) : (
                <>
                    <TraderTypeLegend />
                    {cardsGrid}
                </>
            )}
        </div>
    );
}

export function TraderTypeLegend({ className = '' }: { className?: string }) {
    return (
        <div
            className={`mx-auto flex max-w-4xl flex-col gap-6 text-base leading-7 text-white/78 md:grid md:grid-cols-2 md:gap-3 ${className}`}
        >
            <Legend
                icon="composite-engine"
                label="Modules"
                href={route('modules.index')}
                copy="Decision-support tools that organize market context, trend, participation, and structure."
                tone="green"
            />
            <Legend
                icon="chat"
                label="Playbooks"
                href={route('playbooks.index')}
                copy="Structured execution frameworks delivered through guided Discord strategy channels."
                tone="violet"
            />
        </div>
    );
}

function TraderTypePanel({ traderType }: { traderType: TraderTypeCard }) {
    const tone = toneClasses[traderType.traderTypeColor];

    return (
        <article
            className={`bg-panel/80 relative overflow-hidden rounded-[14px] border p-4 text-left backdrop-blur ${tone.card}`}
        >
            <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tone.glow} via-transparent to-transparent`}
            />
            <div className="relative">
                <header
                    className={`flex items-center gap-4 border-b pb-4 ${tone.divider}`}
                >
                    <div
                        className={`font-heading flex h-16 w-16 shrink-0 items-center justify-center rounded-[10px] border text-3xl ${tone.number}`}
                    >
                        {traderType.number}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2
                            className={`font-heading text-3xl leading-none tracking-[0.08em] uppercase sm:text-4xl ${tone.title}`}
                        >
                            {traderType.title}
                        </h2>
                    </div>
                    <div
                        className={`hidden h-16 w-16 shrink-0 items-center justify-center rounded-full border bg-black/25 sm:flex ${tone.number}`}
                    >
                        <IconRenderer
                            name={traderType.icon}
                            className="h-10 w-10"
                        />
                    </div>
                </header>

                <p className="mx-auto max-w-xl px-5 py-5 text-center text-lg leading-8 text-white/84">
                    {traderType.description}
                </p>

                <div
                    className={`grid gap-5 border-t pt-5 md:grid-cols-2 ${tone.divider}`}
                >
                    <TypeList
                        title="Modules"
                        icon="command-cube"
                        items={traderType.modules}
                        tone={traderType.traderTypeColor}
                    />
                    <TypeList
                        title="Playbooks"
                        icon="playbooks-book-open"
                        items={traderType.playbooks}
                        tone={traderType.traderTypeColor}
                    />
                </div>
            </div>
        </article>
    );
}

function TypeList({
    title,
    icon,
    items,
    tone,
}: {
    title: string;
    icon: string;
    items: string[];
    tone: TaxonomyColor;
}) {
    const activeTone = toneClasses[tone];
    const hasItems = items.length > 0;

    return (
        <section
            className={`grid grid-cols-[44px_1fr] gap-4 ${hasItems ? '' : 'invisible'}`}
            aria-hidden={!hasItems}
        >
            <div
                className={`flex h-11 w-11 items-center justify-center rounded-full border bg-black/25 ${activeTone.number}`}
            >
                <IconRenderer name={icon} className="h-6 w-6" />
            </div>
            <div>
                <h3
                    className={`font-heading text-lg tracking-[0.12em] uppercase ${activeTone.title}`}
                >
                    {title}
                </h3>
                <ul className="mt-2 grid gap-1.5 text-sm leading-5 text-white/82 sm:text-base">
                    {items.map((item) => (
                        <li key={item} className="flex gap-2">
                            <span
                                className={`mt-2 h-2 w-2 shrink-0 rounded-full ${activeTone.bullet}`}
                                aria-hidden="true"
                            />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

function toTraderTypeCard(
    traderType: TraderType,
    index: number,
): TraderTypeCard {
    const modules = traderType.modules ?? [];
    const playbooks = traderType.playbooks ?? [];

    return {
        number: index + 1,
        title: traderType.name,
        description: traderType.description ?? '',
        modules: modules.map((module) => module.title),
        playbooks: playbooks.map((playbook) => playbook.title),
        traderTypeColor: taxonomyColor(traderType.color),
        icon: traderType.icon || fallbackIcon(traderType.name),
    };
}

function taxonomyColor(color?: string | null): TaxonomyColor {
    if (
        color === 'violet-light' ||
        color === 'seafoam-green' ||
        color === 'gold'
    ) {
        return color;
    }

    return 'violet-light';
}

function fallbackIcon(name: string): string {
    if (name.includes('CRYPTO')) {
        return 'crypto-info-box';
    }

    if (name.includes('NYSE')) {
        return 'market-data-bars';
    }

    return 'command-cube';
}

function Legend({
    icon,
    label,
    copy,
    href,
    tone,
}: {
    icon: string;
    label: string;
    copy: string;
    href: string;
    tone: 'green' | 'violet';
}) {
    const toneClass =
        tone === 'green'
            ? 'border-seafoam-green/45 text-seafoam-green bg-seafoam-green/10'
            : 'border-violet-light/45 text-violet-light bg-violet-light/10';

    return (
        <Link
            href={href}
            className="group flex gap-3 text-left transition hover:text-white md:items-center md:justify-center"
        >
            <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] border transition group-hover:scale-105 ${toneClass}`}
            >
                <IconRenderer name={icon} className="h-7 w-7" />
            </span>
            <span>
                <span
                    className={`font-heading tracking-[0.08em] uppercase ${tone === 'green' ? 'text-seafoam-green' : 'text-violet-light'}`}
                >
                    {label}
                </span>
                <span className="block">{copy}</span>
            </span>
        </Link>
    );
}
