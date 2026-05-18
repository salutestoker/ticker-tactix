import {
    AccessBadge,
    GradientHeading,
    HudButton,
    HudPanel,
    TaxonomyBadge,
} from '@/Components/UI/Hud';
import { PublicHeroFrame } from '@/Components/UI/PublicHero';
import PublicLayout from '@/Layouts/PublicLayout';
import type { Playbook } from '@/types';
import { Head } from '@inertiajs/react';

export default function PlaybooksShow({ playbook }: { playbook: Playbook }) {
    return (
        <PublicLayout>
            <Head title={playbook.meta_title || playbook.title} />
            <PublicHeroFrame>
                <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_360px]">
                    <div>
                        <AccessBadge access={playbook.access} />
                        <GradientHeading className="mt-6">
                            {playbook.title}
                        </GradientHeading>
                        <p className="mt-8 text-xl leading-9 text-white/78">
                            {playbook.best_for}
                        </p>
                        <HudPanel className="mt-10 p-8">
                            <h2 className="font-heading text-seafoam-green text-xl tracking-[0.14em] uppercase">
                                Deployment Profile
                            </h2>
                            <p className="mt-5 leading-8 text-white/70">
                                This playbook is tuned for{' '}
                                {playbook.market?.name || 'multi-market'}{' '}
                                conditions with a typical hold time of{' '}
                                {playbook.average_hold_time ||
                                    'variable duration'}
                                .
                            </p>
                        </HudPanel>
                    </div>
                    <HudPanel className="h-fit p-6">
                        <dl className="space-y-5 text-sm">
                            <TaxonomyMeta
                                label="Market"
                                value={playbook.market?.name}
                                color={playbook.market?.color}
                            />
                            <div>
                                <dt className="font-heading text-[0.65rem] tracking-[0.16em] text-white/45 uppercase">
                                    Trader Types
                                </dt>
                                <dd className="mt-2 flex flex-wrap gap-2">
                                    {(
                                        playbook.trader_types ??
                                        playbook.traderTypes ??
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
                                label="Trading Pace"
                                value={playbook.trading_pace}
                            />
                            <Meta
                                label="Average Hold"
                                value={playbook.average_hold_time}
                            />
                            <Meta label="Price" value={playbook.price} />
                        </dl>
                        <HudButton
                            href={route('playbooks.index')}
                            className="mt-8 w-full"
                        >
                            {playbook.action_label || 'Back To Matrix'}
                        </HudButton>
                    </HudPanel>
                </div>
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
