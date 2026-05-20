import { IconRenderer } from '@/Components/Icons/IconRenderer';
import {
    AccessBadge,
    Eyebrow,
    GradientHeading,
    HudButton,
    HudPanel,
    TaxonomyBadge,
} from '@/Components/UI/Hud';
import { PublicHeroFrame } from '@/Components/UI/PublicHero';
import PublicLayout from '@/Layouts/PublicLayout';
import { formatVersion } from '@/lib/format';
import type { Module, PageProps, TraderType } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function ModulesIndex({
    modules,
}: PageProps<{ modules: Module[] }>) {
    return (
        <PublicLayout>
            <Head title="Modules" />
            <PublicHeroFrame>
                <div className="relative z-10 w-[102vw] translate-x-[-2%] -translate-y-[18%] mix-blend-lighten">
                    <img
                        src="/design/assets/images/bg-modules.png"
                        className=""
                        alt=""
                    />
                </div>
                <div className="mx-auto max-w-7xl">
                    <Eyebrow>System Modules</Eyebrow>
                    <GradientHeading className="text-center">
                        Module Matrix
                    </GradientHeading>
                    <HudPanel className="mt-10 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse text-left text-sm">
                                <thead className="font-heading text-seafoam-green text-xs tracking-[0.14em] uppercase">
                                    <tr>
                                        <th className="px-6 py-5">Module</th>
                                        <th className="px-6 py-5">
                                            What It Does
                                        </th>
                                        <th className="px-6 py-5">
                                            Trader Type
                                        </th>
                                        <th className="px-6 py-5">Market</th>
                                        <th className="px-6 py-5">Version</th>
                                        <th className="px-6 py-5">Access</th>
                                        <th className="px-6 py-5">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {modules.map((module) => (
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
                                                {module.description}
                                            </td>
                                            <td className="px-6 py-5">
                                                <TaxonomyList
                                                    types={
                                                        module.trader_types ??
                                                        module.traderTypes ??
                                                        []
                                                    }
                                                />
                                            </td>
                                            <td className="px-6 py-5">
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
                                            <td className="text-seafoam-green px-6 py-5">
                                                {formatVersion(module.version)}
                                            </td>
                                            <td className="px-6 py-5">
                                                <AccessBadge
                                                    access={module.access}
                                                />
                                            </td>
                                            <td className="px-6 py-5">
                                                <HudButton
                                                    href={route(
                                                        'modules.show',
                                                        module.slug,
                                                    )}
                                                    tone="violet"
                                                >
                                                    {module.action_label ||
                                                        'Inspect'}
                                                </HudButton>
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
