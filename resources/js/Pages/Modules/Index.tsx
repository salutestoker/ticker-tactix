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
                <div className="mx-auto max-w-7xl">
                    <Eyebrow>System Modules</Eyebrow>
                    <GradientHeading className="text-center">
                        Module Matrix
                    </GradientHeading>
                    <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {modules.map((module) => (
                            <Link
                                key={module.id}
                                href={route('modules.show', module.slug)}
                            >
                                <HudPanel className="hover:border-seafoam-green/60 h-full p-6 transition hover:shadow-[0_0_36px_rgba(0,250,146,0.16)]">
                                    <div className="flex items-start gap-4">
                                        <div className="border-seafoam-green/35 bg-seafoam-green/10 text-seafoam-green rounded-md border p-3">
                                            <IconRenderer
                                                name={module.icon}
                                                className="h-8 w-8"
                                            />
                                        </div>
                                        <div>
                                            <h2 className="font-heading text-lg tracking-[0.1em] text-white uppercase">
                                                {module.title}
                                            </h2>
                                            <p className="mt-2 text-sm text-white/55">
                                                {module.market?.name ||
                                                    'No market assigned'}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="mt-5 leading-7 text-white/68">
                                        {module.description}
                                    </p>
                                    <div className="mt-5 flex flex-wrap gap-2">
                                        {(
                                            module.trader_types ??
                                            module.traderTypes ??
                                            []
                                        ).map((type: TraderType) => (
                                            <TaxonomyBadge
                                                key={type.id}
                                                label={type.name}
                                                color={type.color}
                                            />
                                        ))}
                                    </div>
                                    <div className="mt-6 flex items-center justify-between">
                                        <span className="font-heading text-violet-light text-sm">
                                            {formatVersion(module.version)}
                                        </span>
                                        <AccessBadge access={module.access} />
                                    </div>
                                </HudPanel>
                            </Link>
                        ))}
                    </div>
                </div>
            </PublicHeroFrame>
        </PublicLayout>
    );
}
