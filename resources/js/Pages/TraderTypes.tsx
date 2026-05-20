import { IconRenderer } from '@/Components/Icons/IconRenderer';
import { Eyebrow, TaxonomyBadge } from '@/Components/UI/Hud';
import { PublicHeroFrame } from '@/Components/UI/PublicHero';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';

type TaxonomyColor = 'violet-light' | 'seafoam-green' | 'gold';

type TraderTypeCard = {
    number: number;
    title: string;
    description: string;
    modules: string[];
    playbooks: string[];
    traderTypeColor: TaxonomyColor;
    market: {
        name: 'NYSE' | 'Crypto';
        color: TaxonomyColor;
    };
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

const traderTypes: TraderTypeCard[] = [
    {
        number: 1,
        title: 'NYSE BASE',
        description:
            'For newer stock traders building structure with a smaller account. Focused on broad-market context and clean foundational tools.',
        modules: ['Momentum Cycles', 'Sequence Pressure', 'Long VWAP'],
        playbooks: ['Market Environment'],
        traderTypeColor: 'violet-light',
        market: { name: 'NYSE', color: 'seafoam-green' },
        icon: 'market-data-bars',
    },
    {
        number: 2,
        title: 'CRYPTO BASE',
        description:
            'For crypto traders who want a simple starting point and community-led guidance before stepping into advanced deployment.',
        modules: ['SIGMA Pro Engine (partner access)'],
        playbooks: ['Join SIGMA'],
        traderTypeColor: 'violet-light',
        market: { name: 'Crypto', color: 'violet-light' },
        icon: 'crypto-info-box',
    },
    {
        number: 3,
        title: 'NYSE CORE',
        description:
            'For patient stock traders ready for a more structured framework and broader market rotation awareness.',
        modules: ['Momentum Cycles', 'Sequence Pressure', 'Long VWAP'],
        playbooks: ['NYSE Sector Rotation Playbook'],
        traderTypeColor: 'seafoam-green',
        market: { name: 'NYSE', color: 'seafoam-green' },
        icon: 'sector-rotation',
    },
    {
        number: 4,
        title: 'CRYPTO CORE',
        description:
            'For patient XRP traders who want slower-developing setups and a structured swing framework.',
        modules: ['Momentum Cycles', 'Sequence Pressure', 'Long VWAP'],
        playbooks: ['XRP Turtle Playbook'],
        traderTypeColor: 'seafoam-green',
        market: { name: 'Crypto', color: 'violet-light' },
        icon: 'turtle',
    },
    {
        number: 5,
        title: 'NYSE PRO',
        description:
            'For active equity and index traders seeking a full intraday decision stack and tighter execution structure.',
        modules: [
            'Momentum Cycles',
            'Sequence Pressure',
            'Trend Tracer',
            'Info Box / Info Line',
            'Pulse',
            'Range Rails',
            'AVWAP',
            'Candle Color',
            'Tide',
        ],
        playbooks: ['SPY Scalp Playbook'],
        traderTypeColor: 'gold',
        market: { name: 'NYSE', color: 'seafoam-green' },
        icon: 'spy-playbook',
    },
    {
        number: 6,
        title: 'CRYPTO PRO',
        description:
            'For active crypto traders who want a full multi-module framework for intraday momentum and guided execution.',
        modules: [
            'Momentum Cycles',
            'Sequence Pressure',
            'Crypto Velocity Stats',
            'Crypto Info Box / Info Line',
            'Pulse',
            'Range Rails',
            'AVWAP',
            'Candle Color',
            'Tide',
        ],
        playbooks: ['BTC Bunny Playbook', 'XRP Bunny Playbook'],
        traderTypeColor: 'gold',
        market: { name: 'Crypto', color: 'violet-light' },
        icon: 'bunny',
    },
];

export default function TraderTypes() {
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
                            6
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
                            copy="invite-only TradingView indicators + Discord module channels."
                            tone="green"
                        />
                        <Legend
                            icon="chat"
                            label="Playbooks"
                            copy="alert-guided Discord strategy channels."
                            tone="violet"
                        />
                    </div>
                </div>

                <div className="mx-auto mt-12 grid max-w-7xl gap-6 lg:grid-cols-2">
                    {traderTypes.map((traderType) => (
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
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <TaxonomyMeta
                                label="Trader Type"
                                value={traderType.title}
                                color={traderType.traderTypeColor}
                            />
                            <TaxonomyMeta
                                label="Market"
                                value={traderType.market.name}
                                color={traderType.market.color}
                            />
                        </div>
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

    return (
        <section className="grid grid-cols-[44px_1fr] gap-4">
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

function TaxonomyMeta({
    label,
    value,
    color,
}: {
    label: string;
    value: string;
    color: TaxonomyColor;
}) {
    return (
        <span className="inline-flex items-center gap-2 rounded-sm border border-white/10 bg-black/20 px-2 py-1">
            <span className="font-mono-display text-[0.58rem] tracking-[0.14em] text-white/45 uppercase">
                {label}
            </span>
            <TaxonomyBadge label={value} color={color} />
        </span>
    );
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
                </span>{' '}
                = {copy}
            </p>
        </div>
    );
}
