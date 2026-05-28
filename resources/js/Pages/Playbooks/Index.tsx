import { IconRenderer } from '@/Components/Icons/IconRenderer';
import {
    AccessBadge,
    Eyebrow,
    GradientHeading,
    HudPanel,
    TaxonomyBadge,
} from '@/Components/UI/Hud';
import { PublicHeroFrame } from '@/Components/UI/PublicHero';
import PublicLayout from '@/Layouts/PublicLayout';
import { TaxonomyList } from '@/Pages/Modules/Index';
import type { PageProps, Playbook } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

export default function PlaybooksIndex({
    playbooks,
}: PageProps<{ playbooks: Playbook[] }>) {
    return (
        <PublicLayout>
            <Head title="Playbooks" />
            <PublicHeroFrame>
                <div className="relative z-10 flex w-[102vw] translate-x-[-2%] -translate-y-[10%] justify-center mix-blend-lighten">
                    <img
                        src="/design/assets/images/bg-playbooks.jpg"
                        className=""
                        alt=""
                    />
                </div>
                <div className="mx-auto max-w-7xl xl:max-w-[1500px]">
                    <Eyebrow>Playbook Access</Eyebrow>
                    <GradientHeading className="text-center">
                        Playbook Matrix
                    </GradientHeading>
                    <p className="mx-auto mt-5 max-w-lg text-center text-lg text-white/75">
                        Deployable frameworks that convert module output into
                        repeatable trading structure.
                    </p>
                    <PlaybookPrimer />

                    <p className="font-heading text-seafoam-green mx-auto my-20 max-w-4xl text-center text-sm leading-7 font-semibold tracking-[0.24em] uppercase sm:text-base">
                        Use the matrix below to compare playbooks by market,
                        access type, trader profile, and deployment style.
                    </p>
                    <div className="mt-12 grid gap-4 md:grid-cols-2 lg:hidden">
                        {playbooks.map((playbook) => (
                            <PlaybookCard
                                key={playbook.id}
                                playbook={playbook}
                            />
                        ))}
                    </div>

                    <HudPanel className="mt-12 hidden overflow-hidden lg:block">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead className="font-heading text-seafoam-green text-xs tracking-[0.14em] uppercase">
                                    <tr>
                                        <th className="px-3 py-4 sm:px-6 sm:py-5">
                                            Playbook
                                        </th>
                                        <th className="px-3 py-4 sm:px-6 sm:py-5">
                                            Trader Type
                                        </th>
                                        <th className="hidden px-6 py-5 md:table-cell">
                                            Access
                                        </th>
                                        <th className="hidden px-6 py-5 md:table-cell">
                                            Market
                                        </th>
                                        <th className="hidden px-6 py-5 md:table-cell">
                                            Designed For
                                        </th>
                                        <th className="px-3 py-4 sm:px-6 sm:py-5">
                                            Price
                                        </th>
                                        <th className="px-3 py-4 sm:px-6 sm:py-5">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {playbooks.map((playbook) => (
                                        <tr
                                            key={playbook.id}
                                            role="link"
                                            tabIndex={0}
                                            aria-label={`Explore ${playbook.title}`}
                                            className="border-main-blue/20 hover:bg-main-blue/10 focus-visible:ring-seafoam-green/60 cursor-pointer border-t transition focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
                                            onClick={() =>
                                                router.visit(
                                                    route(
                                                        'playbooks.show',
                                                        playbook.slug,
                                                    ),
                                                )
                                            }
                                            onKeyDown={(event) => {
                                                if (
                                                    event.key === 'Enter' ||
                                                    event.key === ' '
                                                ) {
                                                    event.preventDefault();
                                                    router.visit(
                                                        route(
                                                            'playbooks.show',
                                                            playbook.slug,
                                                        ),
                                                    );
                                                }
                                            }}
                                        >
                                            <td className="min-w-[330px] px-3 py-4 font-medium text-white sm:px-6 sm:py-5">
                                                <div className="text-seafoam-green flex items-center gap-4">
                                                    {playbook.logo_url && (
                                                        <div className="border-seafoam-green bg-midnight-blue h-12 w-12 overflow-hidden rounded-full border p-2">
                                                            <img
                                                                className="h-full w-full object-cover mix-blend-lighten"
                                                                src={
                                                                    playbook.logo_url
                                                                }
                                                                alt=""
                                                            />
                                                        </div>
                                                    )}
                                                    {playbook.icon &&
                                                        !playbook.logo_url && (
                                                            <div className="border-seafoam-green bg-midnight-blue flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border">
                                                                <IconRenderer
                                                                    name={
                                                                        playbook.icon
                                                                    }
                                                                    className="h-6 w-6 object-cover"
                                                                />
                                                            </div>
                                                        )}
                                                    <span className="font-heading w-[calc(100%-55px)] text-sm tracking-[0.08em] text-white uppercase">
                                                        {playbook.title}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 sm:px-6 sm:py-5">
                                                <div className="flex flex-wrap gap-2">
                                                    <TaxonomyList
                                                        types={
                                                            playbook.trader_types ??
                                                            playbook.traderTypes ??
                                                            []
                                                        }
                                                    />
                                                </div>
                                            </td>
                                            <td className="hidden px-6 py-5 md:table-cell">
                                                <AccessBadge
                                                    access={playbook.access}
                                                />
                                            </td>
                                            <td className="hidden px-6 py-5 md:table-cell">
                                                {playbook.market ? (
                                                    <TaxonomyBadge
                                                        label={
                                                            playbook.market.name
                                                        }
                                                        color={
                                                            playbook.market
                                                                .color
                                                        }
                                                    />
                                                ) : (
                                                    <span className="text-white/45">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="hidden min-w-[230px] px-6 py-5 text-white/75 md:table-cell">
                                                {playbook.best_for}
                                            </td>
                                            <td className="font-heading px-3 py-4 text-lg text-white sm:px-6 sm:py-5">
                                                {playbook.price || '—'}
                                            </td>
                                            <td className="px-3 py-4 sm:px-6 sm:py-5">
                                                <ActionLink
                                                    href={route(
                                                        'playbooks.show',
                                                        playbook.slug,
                                                    )}
                                                    label={`Explore ${playbook.title}`}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </HudPanel>
                </div>
            </PublicHeroFrame>
        </PublicLayout>
    );
}

function PlaybookCard({ playbook }: { playbook: Playbook }) {
    const bannerSrc = playbook.banner_image_url;

    return (
        <div className="group border-main-blue/45 to-panel-deep hover:border-violet-light/70 focus-visible:ring-seafoam-green/70 flex h-[30rem] w-full flex-col overflow-hidden rounded-[14px] border bg-gradient-to-b from-[#0e1f4b] p-5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_0_24px_rgba(55,100,245,0.16)] transition hover:-translate-y-1 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_0_30px_rgba(181,67,215,0.15)] focus-visible:ring-2 focus-visible:outline-none">
            <div className="relative flex gap-5">
                <div className="w-2/3 min-w-0">
                    <p className="font-heading text-violet-light text-[0.66rem] font-semibold tracking-[0.18em] uppercase">
                        Playbook
                    </p>
                    <h3 className="font-heading mt-3 mb-3 text-2xl leading-[1.05] font-semibold tracking-[0.01em] text-white">
                        {playbook.title}&nbsp;
                        <span className="font-heading text-seafoam-green ml-auto text-xs">
                            {playbook.price || ''}
                        </span>
                    </h3>
                    <p className="min-w-[260px] text-sm leading-6 text-white">
                        {playbook.best_for}
                    </p>
                </div>

                <div className="absolute -top-2 right-[-16px] h-20 w-20 sm:top-[-25px]">
                    {playbook.logo_url ? (
                        <img
                            className="h-full w-full object-contain mix-blend-lighten transition duration-300 group-hover:scale-105"
                            src={playbook.logo_url}
                            alt=""
                            draggable={false}
                            loading="lazy"
                        />
                    ) : (
                        <div className="border-main-blue/45 bg-main-blue/10 text-violet-light flex h-18 w-18 items-center justify-center rounded-[14px] border">
                            <IconRenderer
                                name={playbook.icon}
                                className="h-10 w-10"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
                <div>
                    {playbook.market ? (
                        <TaxonomyBadge
                            label={playbook.market.name}
                            color={playbook.market.color}
                        />
                    ) : (
                        <span className="text-white/45">—</span>
                    )}
                </div>
                <AccessBadge access={playbook.access} showIcon />
            </div>

            <div className="mt-4 flex max-h-30 items-center rounded-lg mix-blend-lighten">
                {bannerSrc ? (
                    <img
                        className="h-full w-full object-cover"
                        src={bannerSrc}
                        alt=""
                        draggable={false}
                        loading="lazy"
                    />
                ) : (
                    <FallbackPlaybookVisual playbook={playbook} />
                )}
            </div>

            <Link
                href={route('playbooks.show', playbook.slug)}
                className="text-violet-light font-heading mt-auto flex items-center gap-2 pt-4 text-sm font-medium uppercase"
            >
                Explore Playbook
                <IconRenderer
                    name="chevron-right"
                    className="h-4 w-4 transition group-hover:translate-x-1"
                />
            </Link>
        </div>
    );
}

function FallbackPlaybookVisual({ playbook }: { playbook: Playbook }) {
    return (
        <div className="from-main-blue/18 via-violet-light/16 to-gold/12 relative flex h-full min-h-28 w-full items-center overflow-hidden bg-gradient-to-r">
            <div className="absolute inset-x-0 top-1/2 h-px bg-violet-300/45 shadow-[0_0_20px_rgba(181,67,215,0.45)]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(181,67,215,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(55,100,245,0.08)_1px,transparent_1px)] bg-[size:28px_28px]" />
            <IconRenderer
                name={playbook.icon}
                className="text-violet-light relative z-10 mx-auto h-16 w-16 opacity-90"
            />
        </div>
    );
}

function ActionLink({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            aria-label={label}
            className="font-heading border-main-blue/60 bg-main-blue/10 hover:border-main-blue hover:bg-main-blue/20 focus-visible:ring-seafoam-green inline-flex min-h-10 items-center justify-center rounded-sm border px-4 py-2 text-xs font-semibold tracking-[0.14em] text-sky-300 uppercase transition hover:text-white focus-visible:ring-2 focus-visible:outline-none"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
        >
            Explore
            <IconRenderer name="chevron-right" className={`h-5 w-5`} />
        </Link>
    );
}

const playbookAttributes = [
    {
        icon: 'market-data-bars',
        title: 'Market',
        meaning: 'NYSE, crypto',
        tone: 'green',
    },
    {
        icon: 'user',
        title: 'Trader Type',
        meaning: 'Daily context, swing structure, intraday momentum',
        tone: 'violet',
    },
    {
        icon: 'lock',
        title: 'Access',
        meaning: 'Newsletter, guided Discord, partner community',
        tone: 'gold',
    },
] as const;

const attributeToneClasses = {
    green: {
        border: 'border-seafoam-green/45',
        bg: 'bg-seafoam-green/10',
        text: 'text-seafoam-green',
        shadow: 'shadow-[0_0_22px_rgba(0,250,146,0.13)]',
    },
    violet: {
        border: 'border-violet-light/45',
        bg: 'bg-violet-light/10',
        text: 'text-violet-light',
        shadow: 'shadow-[0_0_22px_rgba(181,67,215,0.13)]',
    },
    gold: {
        border: 'border-gold/45',
        bg: 'bg-gold/10',
        text: 'text-gold',
        shadow: 'shadow-[0_0_22px_rgba(243,191,56,0.13)]',
    },
};

function PlaybookPrimer() {
    return (
        <section className="mx-auto mt-14 grid max-w-7xl gap-6 text-left lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
            <article className="border-main-blue/40 bg-panel/75 relative overflow-hidden rounded-[14px] border p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_34px_rgba(55,100,245,0.13)] sm:p-8">
                <div className="from-main-blue/16 via-violet-light/8 pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent" />
                <div className="relative">
                    <div className="font-heading text-seafoam-green text-xs font-semibold tracking-[0.24em] uppercase">
                        What is a playbook?
                    </div>
                    <h2 className="font-heading mt-4 text-2xl leading-tight font-semibold tracking-[0.06em] text-white uppercase sm:text-3xl">
                        Structured Execution Frameworks
                    </h2>
                    <div className="mt-5 space-y-4 text-base leading-7 text-white/76 sm:text-lg sm:leading-8">
                        <p>
                            Playbooks are structured execution frameworks built
                            from Ticker-Tactix modules.
                        </p>
                        <p>
                            Modules help organize market information. Playbooks
                            define how that information is applied across a
                            specific market, style, and level of execution.
                        </p>
                        <p>
                            Each playbook is designed to help traders follow a
                            more repeatable process instead of reacting
                            emotionally to price movement.
                        </p>
                    </div>
                </div>
            </article>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {playbookAttributes.map((attribute) => {
                    const tone = attributeToneClasses[attribute.tone];

                    return (
                        <article
                            key={attribute.title}
                            className={`border-main-blue/30 bg-panel/65 relative overflow-hidden rounded-[14px] border p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ${tone.shadow}`}
                        >
                            <div
                                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-[12px] border ${tone.border} ${tone.bg} ${tone.text}`}
                            >
                                <IconRenderer
                                    name={attribute.icon}
                                    className="h-7 w-7"
                                />
                            </div>
                            <h3
                                className={`font-heading text-sm tracking-[0.18em] uppercase ${tone.text}`}
                            >
                                {attribute.title}
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-white/72">
                                {attribute.meaning}
                            </p>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
