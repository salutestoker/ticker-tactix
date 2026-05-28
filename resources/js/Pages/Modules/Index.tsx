import { IconRenderer } from '@/Components/Icons/IconRenderer';
import { Eyebrow, HudPanel, TaxonomyBadge } from '@/Components/UI/Hud';
import { ModuleCarouselCard } from '@/Components/UI/ModuleCardsCarousel';
import { PublicHeroFrame } from '@/Components/UI/PublicHero';
import PublicLayout from '@/Layouts/PublicLayout';
import { formatVersion } from '@/lib/format';
import type { Module, PageProps, TraderType } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

export default function ModulesIndex({
    modules,
}: PageProps<{ modules: Module[] }>) {
    return (
        <PublicLayout>
            <Head title="Modules" />
            <PublicHeroFrame>
                <div className="relative z-10 flex w-[102vw] translate-x-[-2%] -translate-y-[10%] justify-center mix-blend-lighten">
                    <img
                        src="/design/assets/images/bg-modules.jpg"
                        className=""
                        alt=""
                    />
                </div>
                <div className="mx-auto max-w-7xl xl:max-w-[1500px]">
                    <Eyebrow>System Modules</Eyebrow>
                    <h1 className="font-heading text-center text-4xl leading-none font-semibold uppercase sm:text-5xl lg:text-6xl">
                        <span className="text-violet">Module</span>{' '}
                        <span className="text-seafoam-green">Matrix</span>
                    </h1>
                    <p className="mx-auto mt-5 max-w-2xl text-center text-lg text-white/75">
                        Specialized components that power the Ticker-Tactix
                        system. Each module serves a defined role in organizing
                        market context, trend, participation, and structure.
                    </p>

                    <div className="border-main-blue-bright/40 mx-auto mb-5 max-w-2xl border-b pt-2 pb-5"></div>
                    <p className="font-heading text-seafoam-green mx-auto mt-5 max-w-xl text-center text-sm leading-7 font-semibold tracking-[0.24em] uppercase sm:text-base">
                        Not sure where to start? <br />
                        Begin with your trader type.
                    </p>

                    <div className="mt-10 grid gap-4 md:grid-cols-2 lg:hidden">
                        {modules.map((module) => (
                            <ModuleCarouselCard
                                key={module.id}
                                module={module}
                                layout="grid"
                            />
                        ))}
                    </div>

                    <HudPanel className="mt-10 hidden overflow-hidden lg:block">
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse text-left text-sm">
                                <thead className="font-heading text-seafoam-green text-xs tracking-[0.14em] uppercase">
                                    <tr>
                                        <th className="px-3 py-4 sm:px-6 sm:py-5">
                                            Module
                                        </th>
                                        <th className="hidden px-6 py-5 md:table-cell">
                                            What It Does
                                        </th>
                                        <th className="px-3 py-4 sm:px-6 sm:py-5">
                                            Trader Type
                                        </th>
                                        <th className="hidden px-6 py-5 md:table-cell">
                                            Market
                                        </th>
                                        {/*<th className="hidden px-6 py-5 md:table-cell">*/}
                                        {/*    Access*/}
                                        {/*</th>*/}
                                        <th className="hidden px-6 py-5 md:table-cell">
                                            Version
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
                                    {modules.map((module) => (
                                        <tr
                                            key={module.id}
                                            role="link"
                                            tabIndex={0}
                                            aria-label={`Explore ${module.title}`}
                                            className="border-main-blue/20 hover:bg-main-blue/10 focus-visible:ring-seafoam-green/60 cursor-pointer border-t transition focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
                                            onClick={() =>
                                                router.visit(
                                                    route(
                                                        'modules.show',
                                                        module.slug,
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
                                                            'modules.show',
                                                            module.slug,
                                                        ),
                                                    );
                                                }
                                            }}
                                        >
                                            <td className="min-w-[250px] px-3 py-4 font-medium text-white sm:px-6 sm:py-5">
                                                <div className="flex items-center gap-4">
                                                    {module.image_url && (
                                                        <div className="border-main-blue-bright/60 bg-midnight-blue h-12 w-12 overflow-hidden rounded-full border">
                                                            <img
                                                                className="h-full w-full object-cover mix-blend-lighten"
                                                                src={
                                                                    module.image_url
                                                                }
                                                                alt=""
                                                            />
                                                        </div>
                                                    )}
                                                    {module.icon &&
                                                        !module.image_url && (
                                                            <div className="border-main-blue-bright/60 bg-midnight-blue flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border">
                                                                <IconRenderer
                                                                    name={
                                                                        module.icon
                                                                    }
                                                                    className="text-seafoam-green objec-c h-6 w-6"
                                                                />
                                                            </div>
                                                        )}
                                                    <span className="font-heading w-[calc(100%-75px)] text-sm tracking-[0.08em] text-white uppercase">
                                                        {module.title}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="hidden w-full min-w-[300px] px-6 py-5 text-white/75 md:table-cell">
                                                {module.description}
                                            </td>
                                            <td className="px-3 py-4 align-middle sm:px-6 sm:py-5 md:min-w-[300px]">
                                                <TaxonomyList
                                                    types={
                                                        module.trader_types ??
                                                        module.traderTypes ??
                                                        []
                                                    }
                                                />
                                            </td>
                                            <td className="hidden px-6 py-5 md:table-cell">
                                                {module.market ? (
                                                    <TaxonomyBadge
                                                        label={
                                                            module.market.name
                                                        }
                                                        color={
                                                            module.market.color
                                                        }
                                                    />
                                                ) : (
                                                    <span className="text-white/45">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            {/*<td className="hidden px-6 py-5 md:table-cell">*/}
                                            {/*    <AccessBadge*/}
                                            {/*        access={module.access}*/}
                                            {/*    />*/}
                                            {/*</td>*/}
                                            <td className="text-seafoam-green hidden px-6 py-5 md:table-cell">
                                                {formatVersion(module.version)}
                                            </td>
                                            <td className="font-heading px-3 py-4 text-lg text-white sm:px-6 sm:py-5">
                                                {module.price || '—'}
                                            </td>
                                            <td className="px-3 py-4 sm:px-6 sm:py-5">
                                                <ActionLink
                                                    href={route(
                                                        'modules.show',
                                                        module.slug,
                                                    )}
                                                    label={`Explore ${module.title}`}
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

export function TaxonomyList({ types }: { types: TraderType[] }) {
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
