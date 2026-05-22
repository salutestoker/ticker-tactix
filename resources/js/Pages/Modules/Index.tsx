import { IconRenderer } from '@/Components/Icons/IconRenderer';
import {
    AccessBadge,
    Eyebrow,
    HudPanel,
    TaxonomyBadge,
} from '@/Components/UI/Hud';
import { PublicHeroFrame } from '@/Components/UI/PublicHero';
import PublicLayout from '@/Layouts/PublicLayout';
import { formatVersion } from '@/lib/format';
import type { Module, PageProps, TraderType } from '@/types';
import { Head, router } from '@inertiajs/react';

export default function ModulesIndex({
    modules,
}: PageProps<{ modules: Module[] }>) {
    return (
        <PublicLayout>
            <Head title="Modules" />
            <PublicHeroFrame>
                <div className="relative z-10 flex w-[102vw] translate-x-[-2%] -translate-y-[18%] justify-center mix-blend-lighten">
                    <img
                        src="/design/assets/images/bg-modules.png"
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
                        system. Each module has a unique role in producing
                        high-probability signals.
                    </p>
                    <HudPanel className="mt-10 overflow-hidden">
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
                                        <th className="hidden px-6 py-5 md:table-cell">
                                            Access
                                        </th>
                                        <th className="hidden px-6 py-5 md:table-cell">
                                            Version
                                        </th>
                                        <th className="px-3 py-4 sm:px-6 sm:py-5">
                                            Price
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
                                            <td className="px-3 py-4 sm:px-6 sm:py-5">
                                                <div className="text-seafoam-green flex items-center gap-4">
                                                    <IconRenderer
                                                        name={module.icon}
                                                        className="h-8 w-8"
                                                    />
                                                    <span className="font-heading text-sm tracking-[0.08em] text-white uppercase">
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
                                            <td className="hidden px-6 py-5 md:table-cell">
                                                <AccessBadge
                                                    access={module.access}
                                                />
                                            </td>
                                            <td className="text-seafoam-green hidden px-6 py-5 md:table-cell">
                                                {formatVersion(module.version)}
                                            </td>
                                            <td className="font-heading text-seafoam-green px-3 py-4 sm:px-6 sm:py-5">
                                                {module.price || '—'}
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
