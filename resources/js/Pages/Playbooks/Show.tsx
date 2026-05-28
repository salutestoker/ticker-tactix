import { IconRenderer } from '@/Components/Icons/IconRenderer';
import {
    AccessBadge,
    GradientHeading,
    HudButton,
    HudPanel,
    TaxonomyBadge,
} from '@/Components/UI/Hud';
import { MobilePurchaseHud } from '@/Components/UI/MobilePurchaseHud';
import { PublicHeroFrame } from '@/Components/UI/PublicHero';
import PublicLayout from '@/Layouts/PublicLayout';
import type { Playbook } from '@/types';
import { Head } from '@inertiajs/react';

export default function PlaybooksShow({ playbook }: { playbook: Playbook }) {
    const actionChildren =
        playbook.slug === 'sigma-pro-engine' ? (
            <>
                Explore{' '}
                <IconRenderer name="chevron-right" className="h-5 w-5" />
            </>
        ) : (
            'Subscribe'
        );

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
                        <ParagraphCopy
                            className="mt-8 space-y-6"
                            text={playbook.best_for ?? ''}
                        />
                        <MobilePurchaseHud
                            price={playbook.price}
                            actionUrl={playbook.action_url}
                            actionChildren={actionChildren}
                        />
                        <HudPanel className="mt-10 p-8">
                            <h2 className="font-heading text-seafoam-green text-xl tracking-[0.14em] uppercase">
                                Description
                            </h2>
                            <ParagraphCopy
                                className="mt-5 text-sm leading-8 text-white/70"
                                text={playbook.long_description?.trim() ?? ''}
                            />
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
                            <Meta
                                label="Delivery"
                                value="Alerts + Guided Discord"
                            />

                            <Meta label="Access" value="Subscription" />
                            <div className="max-md:hidden">
                                <Meta label="Price" value={playbook.price} />
                            </div>
                        </dl>
                        <div className="max-md:hidden">
                            {playbook.slug !== 'sigma-pro-engine' &&
                                (playbook.action_url ? (
                                    <HudButton
                                        href={playbook.action_url}
                                        external
                                        className="mt-8 w-full"
                                        variant="solid"
                                    >
                                        Subscribe
                                    </HudButton>
                                ) : (
                                    <HudButton
                                        type="button"
                                        disabled
                                        className="mt-8 w-full"
                                        variant="solid"
                                    >
                                        Coming Soon
                                    </HudButton>
                                ))}

                            {playbook.slug === 'sigma-pro-engine' &&
                                playbook.action_url && (
                                    <HudButton
                                        href={playbook.action_url}
                                        external
                                        className="mt-8 w-full"
                                        variant="solid"
                                    >
                                        Explore{' '}
                                        <IconRenderer
                                            name="chevron-right"
                                            className="h-5 w-5"
                                        />
                                    </HudButton>
                                )}
                        </div>
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

function ParagraphCopy({
    text,
    className,
}: {
    text: string;
    className?: string;
}) {
    const paragraphs = text
        .split(/\r\n|\r|\n+/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);

    if (!paragraphs.length) {
        return null;
    }

    return (
        <div className={className}>
            {paragraphs.map((paragraph, index) => (
                <p key={`${index}-${paragraph}`} className="mb-2 text-white/78">
                    {paragraph}
                </p>
            ))}
        </div>
    );
}
