import { IconRenderer } from '@/Components/Icons/IconRenderer';
import {
    AccessBadge,
    GradientHeading,
    HudButton,
    HudPanel,
} from '@/Components/UI/Hud';
import { PublicHeroFrame } from '@/Components/UI/PublicHero';
import PublicLayout from '@/Layouts/PublicLayout';
import type { Module } from '@/types';
import { Head } from '@inertiajs/react';

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
                            {module.purpose}
                        </p>
                        <HudPanel className="mt-10 p-8">
                            <h2 className="font-heading text-seafoam-green text-xl tracking-[0.14em] uppercase">
                                What It Does
                            </h2>
                            <p className="mt-5 leading-8 text-white/70">
                                {module.what_it_does || module.description}
                            </p>
                        </HudPanel>
                    </div>
                    <HudPanel className="h-fit p-6">
                        <dl className="space-y-5 text-sm">
                            <Meta
                                label="Category"
                                value={module.category?.name}
                            />
                            <Meta
                                label="Key Output"
                                value={module.key_output}
                            />
                            <Meta label="Version" value={module.version} />
                        </dl>
                        <HudButton
                            href={module.payment_url || route('modules.index')}
                            external={Boolean(module.payment_url)}
                            className="mt-8 w-full"
                        >
                            {module.payment_url
                                ? 'Access Module'
                                : 'Back To Matrix'}
                        </HudButton>
                    </HudPanel>
                </div>
                {relatedModules.length ? (
                    <div className="mx-auto mt-16 max-w-6xl">
                        <h2 className="font-heading text-xl tracking-[0.16em] text-white uppercase">
                            Related Modules
                        </h2>
                        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                            {relatedModules.map((item) => (
                                <HudPanel
                                    key={item.id}
                                    className="p-5 text-sm text-white/70"
                                >
                                    {item.title}
                                </HudPanel>
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
