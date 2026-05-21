import { IconRenderer } from '@/Components/Icons/IconRenderer';
import { Eyebrow } from '@/Components/UI/Hud';
import { PublicHeroFrame } from '@/Components/UI/PublicHero';
import PublicLayout from '@/Layouts/PublicLayout';
import type { Market, Module, PageProps, Playbook, TraderType } from '@/types';
import { Head } from '@inertiajs/react';

type TaxonomyColor = 'violet-light' | 'seafoam-green' | 'gold';

type MarketChip = {
    name: string;
    color: TaxonomyColor;
};

type TraderTypeCard = {
    number: number;
    title: string;
    description: string;
    modules: string[];
    playbooks: string[];
    traderTypeColor: TaxonomyColor;
    markets: MarketChip[];
    icon: string;
};

type TraderTypesProps = PageProps<{
    traderTypes: TraderType[];
}>;

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

export default function TraderTypes({ traderTypes }: TraderTypesProps) {
    const cards = traderTypes.map(toTraderTypeCard);

    return (
        <PublicLayout>
            <Head title="What Type of Trader Are You?" />
            <PublicHeroFrame className="px-4 pt-32 pb-20 sm:px-6">
                <div className="relative z-10 w-[102vw] translate-x-[-2%] -translate-y-[35%] mix-blend-lighten">
                    <img
                        src="/design/assets/images/bg-what-type-of-trader-are-you.png"
                        className=""
                        alt=""
                    />
                </div>
                <div className="mx-auto mt-[-35%] max-w-6xl text-center">
                    <Eyebrow>Framework Fit</Eyebrow>
                    <h1 className="font-heading leading-none font-semibold tracking-[0.06em] text-white uppercase drop-shadow-[0_0_26px_rgba(125,211,252,0.32)]">
                        <span className="text-seafoam-green mr-3 inline-block text-7xl sm:text-8xl lg:text-9xl">
                            {cards.length || 6}
                        </span>
                        <span className="text-4xl sm:text-6xl lg:text-7xl">
                            Trader Types
                        </span>
                    </h1>
                    <p className="mx-auto mt-5 max-w-4xl text-xl leading-8 text-white/82 sm:text-2xl">
                        Find the Ticker-Tactix framework that fits how you
                        trade.
                    </p>
                    <div className="mx-auto mt-6 grid max-w-4xl gap-3 text-base leading-7 text-white/78 md:grid-cols-2">
                        <Legend
                            icon="composite-engine"
                            label="Modules"
                            copy="TradingView indicators + Discord module channels."
                            tone="green"
                        />
                        <Legend
                            icon="chat"
                            label="Playbooks"
                            copy="Alert-guided Discord strategy channels."
                            tone="violet"
                        />
                    </div>
                </div>

                <div className="mx-auto mt-12 grid max-w-7xl gap-6 lg:grid-cols-2">
                    {cards.map((traderType) => (
                        <TraderTypePanel
                            key={traderType.title}
                            traderType={traderType}
                        />
                    ))}
                </div>

                {/*<div className="mx-auto mt-14 max-w-5xl text-center">*/}
                {/*    <HudPanel className="rounded-[14px] px-6 py-7">*/}
                {/*        <p className="font-heading brand-gradient-text text-2xl tracking-[0.35em] uppercase sm:text-4xl">*/}
                {/*            Ticker-Tactix*/}
                {/*        </p>*/}
                {/*        <p className="font-heading mt-4 text-xs tracking-[0.35em] text-white/70 uppercase">*/}
                {/*            Trade with{' '}*/}
                {/*            <span className="text-seafoam-green">*/}
                {/*                structure*/}
                {/*            </span>*/}
                {/*            , not{' '}*/}
                {/*            <span className="text-violet-light">emotion</span>.*/}
                {/*        </p>*/}
                {/*    </HudPanel>*/}
                {/*</div>*/}
            </PublicHeroFrame>
        </PublicLayout>
    );
}

function TraderTypePanel({ traderType }: { traderType: TraderTypeCard }) {
    const tone = toneClasses[traderType.traderTypeColor];

    return (
        <article
            className={`bg-panel/80 relative overflow-hidden rounded-[14px] border p-4 backdrop-blur ${tone.card}`}
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
        markets: marketsForTraderType(traderType, modules, playbooks),
        icon: traderType.icon || fallbackIcon(traderType.name),
    };
}

function marketsForTraderType(
    traderType: TraderType,
    modules: Module[],
    playbooks: Playbook[],
): MarketChip[] {
    const markets = [...modules, ...playbooks]
        .map((item) => item.market)
        .filter((market): market is Market => Boolean(market));
    const byName = new Map<string, MarketChip>();

    markets.forEach((market) => {
        byName.set(market.name, {
            name: market.name,
            color: taxonomyColor(market.color),
        });
    });

    const sorted = [...byName.values()].sort(
        (a, b) => marketSortValue(a.name) - marketSortValue(b.name),
    );

    if (sorted.length) {
        return sorted;
    }

    if (traderType.name.startsWith('NYSE')) {
        return [{ name: 'NYSE', color: 'seafoam-green' }];
    }

    if (traderType.name.startsWith('CRYPTO')) {
        return [{ name: 'Crypto', color: 'violet-light' }];
    }

    return [{ name: 'All', color: 'gold' }];
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

function marketSortValue(name: string): number {
    return (
        {
            NYSE: 10,
            Crypto: 20,
            All: 30,
        }[name] ?? 100
    );
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
    tone,
}: {
    icon: string;
    label: string;
    copy: string;
    tone: 'green' | 'violet';
}) {
    const toneClass =
        tone === 'green'
            ? 'border-seafoam-green/45 text-seafoam-green bg-seafoam-green/10'
            : 'border-violet-light/45 text-violet-light bg-violet-light/10';

    return (
        <div className="flex items-center justify-center gap-3 text-left">
            <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] border ${toneClass}`}
            >
                <IconRenderer name={icon} className="h-7 w-7" />
            </span>
            <p>
                <span
                    className={`font-heading tracking-[0.08em] uppercase ${tone === 'green' ? 'text-seafoam-green' : 'text-violet-light'}`}
                >
                    {label}
                </span>
                <div>{copy}</div>
            </p>
        </div>
    );
}
