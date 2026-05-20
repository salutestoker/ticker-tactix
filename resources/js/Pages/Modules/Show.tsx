import { IconRenderer } from '@/Components/Icons/IconRenderer';
import {
    AccessBadge,
    GradientHeading,
    HudButton,
    HudPanel,
    TaxonomyBadge,
} from '@/Components/UI/Hud';
import { PublicHeroFrame } from '@/Components/UI/PublicHero';
import PublicLayout from '@/Layouts/PublicLayout';
import { formatVersion } from '@/lib/format';
import type { Module } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function ModulesShow({
    module,
    relatedModules,
}: {
    module: Module;
    relatedModules: Module[];
}) {
    return (
        <PublicLayout>
            <Head title={module.meta_title || module.title} />
            <PublicHeroFrame>
                <div className="relative z-10 w-[102vw] translate-x-[-2%] -translate-y-[18%] mix-blend-lighten">
                    <img
                        src="/design/assets/images/bg-playbooks.png"
                        className=""
                        alt=""
                    />
                </div>
                <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_360px]">
                    <div>
                        <div className="text-seafoam-green mb-6 flex items-center gap-4">
                            <IconRenderer
                                name={module.icon}
                                className="h-14 w-14"
                            />
                            <AccessBadge access={module.access} />
                        </div>
                        <GradientHeading>{module.title}</GradientHeading>
                        <p className="mt-8 text-xl leading-9 text-white/78">
                            {module.description}
                        </p>
                        <HudPanel className="mt-10 p-8">
                            <h2 className="font-heading text-seafoam-green text-xl tracking-[0.14em] uppercase">
                                What It Does
                            </h2>
                            <p className="mt-5 leading-8 text-white/70">
                                {module.description}
                            </p>
                        </HudPanel>
                    </div>
                    <HudPanel className="h-fit p-6">
                        <dl className="space-y-5 text-sm">
                            <TaxonomyMeta
                                label="Market"
                                value={module.market?.name}
                                color={module.market?.color}
                            />
                            <div>
                                <dt className="font-heading text-[0.65rem] tracking-[0.16em] text-white/45 uppercase">
                                    Trader Types
                                </dt>
                                <dd className="mt-2 flex flex-wrap gap-2">
                                    {(
                                        module.trader_types ??
                                        module.traderTypes ??
                                        []
                                    ).map((type) => (
                                        <TaxonomyBadge
                                            key={type.id}
                                            label={type.name}
                                            color={type.color}
                                        />
                                    ))}
                                </dd>
                            </div>
                            <Meta
                                label="Version"
                                value={formatVersion(module.version)}
                            />
                        </dl>
                        <HudButton
                            href={route('modules.index')}
                            className="mt-8 w-full"
                        >
                            {module.action_label || 'Back To Matrix'}
                        </HudButton>
                    </HudPanel>
                </div>
                {relatedModules.length ? (
                    <div className="mx-auto mt-16 max-w-6xl">
                        <h2 className="font-heading text-xl tracking-[0.16em] text-white uppercase">
                            Trader’s also bought
                        </h2>
                        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                            {relatedModules.map((item) => (
                                <Link
                                    key={item.id}
                                    href={route('modules.show', item.slug)}
                                >
                                    <HudPanel className="hover:border-seafoam-green/60 h-full p-5 text-sm text-white/70 transition">
                                        <IconRenderer
                                            name={item.icon}
                                            className="text-seafoam-green mb-4 h-8 w-8"
                                        />
                                        <span className="font-heading text-white uppercase">
                                            {item.title}
                                        </span>
                                    </HudPanel>
                                </Link>
                            ))}
                        </div>
                    </div>
                ) : null}
            </PublicHeroFrame>
        </PublicLayout>
    );
}

function Meta({ label, value }: { label: string; value?: string | null }) {
    return (
        <div>
            <dt className="font-heading text-[0.65rem] tracking-[0.16em] text-white/45 uppercase">
                {label}
            </dt>
            <dd className="mt-1 text-white">{value || '—'}</dd>
        </div>
    );
}

function TaxonomyMeta({
    label,
    value,
    color,
}: {
    label: string;
    value?: string | null;
    color?: string | null;
}) {
    return (
        <div>
            <dt className="font-heading text-[0.65rem] tracking-[0.16em] text-white/45 uppercase">
                {label}
            </dt>
            <dd className="mt-2">
                {value ? (
                    <TaxonomyBadge label={value} color={color} />
                ) : (
                    <span className="text-white">—</span>
                )}
            </dd>
        </div>
    );
}
