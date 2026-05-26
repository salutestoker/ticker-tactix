import { IconRenderer } from '@/Components/Icons/IconRenderer';
import {
    AccessBadge,
    Eyebrow,
    GradientHeading,
    HudPanel,
    TaxonomyBadge,
} from '@/Components/UI/Hud';
import { PublicHeroFrame } from '@/Components/UI/PublicHero';
import { RotatingTaxonomyBadges } from '@/Components/UI/RotatingTaxonomyBadges';
import PublicLayout from '@/Layouts/PublicLayout';
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
                    <HudPanel className="mt-12 overflow-hidden">
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
                                            Best For
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
                                                    {playbook.icon && (
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
                                                    <RotatingTaxonomyBadges
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
                                            <td className="hidden w-full min-w-[300px] px-6 py-5 text-white/75 md:table-cell">
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
