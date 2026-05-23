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
import type { Module, ModuleFeature } from '@/types';
import { Head, Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

const sectionIconClasses =
    'flex h-12 w-12 shrink-0 items-center justify-center rounded-full border bg-panel-deep';

const featureToneClasses: Record<string, string> = {
    green: 'border-seafoam-green/45 bg-seafoam-green/10 text-seafoam-green',
    violet: 'border-violet-light/45 bg-violet-light/10 text-violet-light',
    blue: 'border-main-blue/45 bg-main-blue/10 text-sky-300',
    gold: 'border-gold/45 bg-gold/10 text-gold',
};

export default function ModulesShow({
    module,
    relatedModules,
}: {
    module: Module;
    relatedModules: Module[];
}) {
    const traderTypes = module.trader_types ?? module.traderTypes ?? [];
    const coreFeatures = module.core_features ?? [];
    const customizationOptions = module.customization_options ?? [];
    const bestUsedFor = module.best_used_for ?? [];

    return (
        <PublicLayout>
            <Head title={module.meta_title || module.title} />
            <PublicHeroFrame className="px-4 pt-32 pb-20 sm:px-6">
                <div className="relative mx-auto max-w-7xl">
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
                        <main>
                            <div className="text-seafoam-green mb-5 flex flex-wrap items-center gap-4">
                                <IconRenderer
                                    name={module.icon}
                                    className="h-12 w-12"
                                />
                                <AccessBadge access={module.access} />
                            </div>

                            <GradientHeading className="max-w-4xl">
                                {module.title}
                            </GradientHeading>
                            <p className="mt-4 max-w-3xl text-lg leading-7 text-white/76 sm:text-xl sm:leading-8">
                                {module.description}
                            </p>

                            <HudPanel className="mt-8 overflow-hidden rounded-[14px]">
                                <DetailRow
                                    icon="direction-target"
                                    title="What It Does"
                                    tone="green"
                                >
                                    <p>{module.description}</p>
                                </DetailRow>

                                <DetailRow
                                    icon="composite-engine"
                                    title="Module Overview"
                                    tone="violet"
                                >
                                    <p>
                                        {module.module_overview ||
                                            module.description}
                                    </p>
                                </DetailRow>

                                <DetailRow
                                    icon="backtested-brain-circuit"
                                    title="Core Features"
                                    tone="blue"
                                >
                                    <div className="grid gap-3">
                                        {coreFeatures.map((feature) => (
                                            <FeatureItem
                                                key={`${feature.label}-${feature.icon}`}
                                                feature={feature}
                                            />
                                        ))}
                                    </div>
                                </DetailRow>

                                <DetailRow
                                    icon="data-pipeline"
                                    title="Customization Options"
                                    tone="green"
                                >
                                    <BulletList items={customizationOptions} />
                                </DetailRow>

                                <DetailRow
                                    icon="execution-optimizer"
                                    title="Best Used For"
                                    tone="violet"
                                >
                                    <BulletList items={bestUsedFor} />
                                </DetailRow>

                                <DetailRow
                                    icon="backtest-validator"
                                    title="Summary"
                                    tone="green"
                                    isLast
                                >
                                    <p>
                                        {module.summary ||
                                            module.module_overview ||
                                            module.description}
                                    </p>
                                </DetailRow>
                            </HudPanel>
                        </main>

                        <aside className="lg:sticky lg:top-28">
                            <HudPanel className="rounded-[14px] p-6 sm:p-7">
                                <dl className="space-y-5">
                                    <SidebarTaxonomy
                                        icon="market-data-bars"
                                        label="Market"
                                    >
                                        {module.market ? (
                                            <TaxonomyBadge
                                                label={module.market.name}
                                                color={module.market.color}
                                            />
                                        ) : (
                                            <span className="text-white">
                                                —
                                            </span>
                                        )}
                                    </SidebarTaxonomy>

                                    <SidebarTaxonomy
                                        icon="user"
                                        label="Trader Types"
                                    >
                                        <div className="flex flex-wrap gap-2">
                                            {traderTypes.map((type) => (
                                                <TaxonomyBadge
                                                    key={type.id}
                                                    label={type.name}
                                                    color={type.color}
                                                />
                                            ))}
                                        </div>
                                    </SidebarTaxonomy>

                                    <SidebarMeta
                                        icon="direction-target"
                                        label="Purpose"
                                        value={module.purpose}
                                        tone="green"
                                    />
                                    <SidebarMeta
                                        icon="versioned-layers"
                                        label="Layer"
                                        value={module.layer}
                                        tone="blue"
                                    />
                                    <SidebarMeta
                                        icon="pulse"
                                        label="Key Output"
                                        value={module.key_output}
                                        tone="blue"
                                    />
                                    <SidebarMeta
                                        icon="range-rails"
                                        label="Trading Pace"
                                        value={module.trading_pace}
                                        tone="gold"
                                    />
                                    <SidebarMeta
                                        icon="goal-posts"
                                        label="Short Name"
                                        value={module.short_name}
                                        tone="violet"
                                    />
                                    <div className="border-main-blue/25 border-t pt-5">
                                        <SidebarMeta
                                            icon="data-pipeline"
                                            label="Version"
                                            value={formatVersion(
                                                module.version,
                                            )}
                                            tone="green"
                                        />
                                    </div>
                                    <SidebarMeta
                                        icon="lock"
                                        label="Access"
                                        value={module.access}
                                        tone="green"
                                    />
                                    <SidebarMeta
                                        icon="market-data-bars"
                                        label="Price"
                                        value={module.price}
                                        tone="green"
                                        valueClassName="font-heading text-xl text-seafoam-green"
                                    />
                                </dl>

                                {module.action_url ? (
                                    <HudButton
                                        href={module.action_url}
                                        external
                                        className="mt-8 w-full rounded-[14px]"
                                        variant="solid"
                                    >
                                        Subscribe
                                    </HudButton>
                                ) : (
                                    <HudButton
                                        type="button"
                                        disabled
                                        className="mt-8 w-full rounded-[14px]"
                                        variant="solid"
                                    >
                                        Coming Soon
                                    </HudButton>
                                )}
                            </HudPanel>
                        </aside>
                    </div>

                    {relatedModules.length ? (
                        <section className="mt-8">
                            <h2 className="font-heading text-lg tracking-[0.16em] text-white/80 uppercase">
                                Related Modules
                            </h2>
                            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {relatedModules.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={route('modules.show', item.slug)}
                                    >
                                        <HudPanel className="hover:border-seafoam-green/60 flex h-full items-center justify-between gap-4 rounded-[14px] p-5 transition hover:shadow-[0_0_36px_rgba(0,250,146,0.14)]">
                                            <div className="flex items-center gap-4">
                                                <span className="border-main-blue/40 bg-main-blue/10 text-seafoam-green flex h-12 w-12 items-center justify-center rounded-full border">
                                                    <IconRenderer
                                                        name={item.icon}
                                                        className="h-7 w-7"
                                                    />
                                                </span>
                                                <span className="font-heading text-sm leading-5 tracking-[0.08em] text-white uppercase">
                                                    {item.title}
                                                </span>
                                            </div>
                                            <span
                                                className="text-seafoam-green text-2xl"
                                                aria-hidden="true"
                                            >
                                                →
                                            </span>
                                        </HudPanel>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ) : null}
                </div>
            </PublicHeroFrame>
        </PublicLayout>
    );
}

function DetailRow({
    icon,
    title,
    tone,
    children,
    isLast = false,
}: {
    icon: string;
    title: string;
    tone: 'green' | 'violet' | 'blue';
    children: ReactNode;
    isLast?: boolean;
}) {
    const toneClass =
        tone === 'green'
            ? 'border-seafoam-green/35 text-seafoam-green'
            : tone === 'violet'
              ? 'border-violet-light/35 text-violet-light'
              : 'border-main-blue/35 text-sky-300';

    return (
        <section
            className={`grid gap-5 px-5 py-6 sm:grid-cols-[260px_1fr] sm:px-7 ${isLast ? '' : 'border-main-blue/20 border-b'}`}
        >
            <div className="flex w-3/4 items-center gap-4">
                <span className={`${sectionIconClasses} ${toneClass}`}>
                    <IconRenderer name={icon} className="h-7 w-7" />
                </span>
                <h2
                    className={`font-heading text-base leading-6 tracking-[0.16em] uppercase ${tone === 'green' ? 'text-seafoam-green' : tone === 'violet' ? 'text-violet-light' : 'text-sky-300'}`}
                >
                    {title}
                </h2>
            </div>
            <div className="text-sm leading-7 text-white/72 sm:text-base">
                {children}
            </div>
        </section>
    );
}

function FeatureItem({ feature }: { feature: ModuleFeature }) {
    const toneClass =
        featureToneClasses[feature.tone ?? ''] ?? featureToneClasses.green;

    return (
        <div className="border-main-blue/15 gap-3 border-b pb-3 last:border-b-0 last:pb-0 md:grid-cols-[200px_1fr]">
            <div className="mb-2 flex items-center gap-3">
                <span
                    className={`flex h-11 w-16 items-center justify-center rounded-[8px] border ${toneClass}`}
                >
                    <IconRenderer name={feature.icon} className="h-6 w-6" />
                </span>
                <span className={`font-heading text-sm ${toneClass}`}>
                    {feature.label}
                </span>
            </div>
            <p className="px-3 text-white/70">{feature.description}</p>
        </div>
    );
}

function BulletList({ items }: { items: string[] }) {
    if (!items.length) {
        return <p>—</p>;
    }

    return (
        <ul className="grid gap-2">
            {items.map((item) => (
                <li key={item} className="flex gap-3">
                    <span className="text-seafoam-green" aria-hidden="true">
                        •
                    </span>
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
}

function SidebarTaxonomy({
    icon,
    label,
    children,
}: {
    icon: string;
    label: string;
    children: ReactNode;
}) {
    return (
        <div className="grid grid-cols-[36px_1fr] gap-4">
            <IconRenderer
                name={icon}
                className="text-seafoam-green mt-1 h-7 w-7"
            />
            <div>
                <dt className="font-heading text-xs tracking-[0.16em] text-white/45 uppercase">
                    {label}
                </dt>
                <dd className="mt-2">{children}</dd>
            </div>
        </div>
    );
}

function SidebarMeta({
    icon,
    label,
    value,
    tone,
    valueClassName = 'text-lg leading-6 text-white',
}: {
    icon: string;
    label: string;
    value?: string | null;
    tone: 'green' | 'violet' | 'blue' | 'gold';
    valueClassName?: string;
}) {
    const toneClass =
        tone === 'green'
            ? 'text-seafoam-green'
            : tone === 'violet'
              ? 'text-violet-light'
              : tone === 'gold'
                ? 'text-gold'
                : 'text-sky-300';

    return (
        <div className="grid grid-cols-[36px_1fr] gap-4">
            <IconRenderer name={icon} className={`${toneClass} mt-1 h-7 w-7`} />
            <div>
                <dt className="font-heading text-xs tracking-[0.16em] text-white/45 uppercase">
                    {label}
                </dt>
                <dd className={`mt-1 ${valueClassName}`}>{value || '—'}</dd>
            </div>
        </div>
    );
}
