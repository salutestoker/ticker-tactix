import {
    AccessBadge,
    GradientHeading,
    HudButton,
    HudPanel,
} from '@/Components/UI/Hud';
import { PublicHeroFrame } from '@/Components/UI/PublicHero';
import PublicLayout from '@/Layouts/PublicLayout';
import { formatPrice } from '@/lib/format';
import type { Playbook } from '@/types';
import { Head } from '@inertiajs/react';

export default function PlaybooksShow({
    playbook,
}: {
    playbook: Playbook;
    relatedPlaybooks: Playbook[];
}) {
    return (
        <PublicLayout>
            <Head title={playbook.meta_title || playbook.framework} />
            <PublicHeroFrame>
                <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_360px]">
                    <div>
                        <AccessBadge access={playbook.access} />
                        <GradientHeading className="mt-6">
                            {playbook.framework}
                        </GradientHeading>
                        <p className="mt-8 text-xl leading-9 text-white/78">
                            {playbook.best_for}
                        </p>
                        <HudPanel className="mt-10 p-8">
                            <h2 className="font-heading text-seafoam-green text-xl tracking-[0.14em] uppercase">
                                Deployment Profile
                            </h2>
                            <p className="mt-5 leading-8 text-white/70">
                                This framework is tuned for{' '}
                                {playbook.market || 'multi-market'} conditions
                                with a typical hold time of{' '}
                                {playbook.average_hold_time ||
                                    'variable duration'}
                                .
                            </p>
                        </HudPanel>
                    </div>
                    <HudPanel className="h-fit p-6">
                        <dl className="space-y-5 text-sm">
                            <Meta
                                label="Category"
                                value={playbook.category?.name}
                            />
                            <Meta label="Market" value={playbook.market} />
                            <Meta
                                label="Average Hold"
                                value={playbook.average_hold_time}
                            />
                            <Meta
                                label="Price"
                                value={formatPrice(
                                    playbook.price_cents,
                                    playbook.currency,
                                )}
                            />
                        </dl>
                        <HudButton
                            href={
                                playbook.payment_url || route('playbooks.index')
                            }
                            external={Boolean(playbook.payment_url)}
                            className="mt-8 w-full"
                        >
                            {playbook.payment_url
                                ? 'Unlock Playbook'
                                : 'Back To Matrix'}
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
