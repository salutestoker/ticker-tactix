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
import type { PageProps, Playbook, TraderType } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function PlaybooksIndex({
    playbooks,
}: PageProps<{ playbooks: Playbook[] }>) {
    return (
        <PublicLayout>
            <Head title="Playbooks" />
            <PublicHeroFrame>
                <div className="mx-auto max-w-7xl">
                    <Eyebrow>Playbook Access</Eyebrow>
                    <GradientHeading className="text-center">
                        Deployment Matrix
                    </GradientHeading>
                    <HudPanel className="mt-12 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead className="font-heading text-seafoam-green text-xs tracking-[0.14em] uppercase">
                                    <tr>
                                        <th className="px-6 py-5">Playbook</th>
                                        <th className="px-6 py-5">
                                            Trader Type
                                        </th>
                                        <th className="px-6 py-5">Access</th>
                                        <th className="px-6 py-5">Market</th>
                                        <th className="px-6 py-5">Best For</th>
                                        <th className="px-6 py-5">Avg Hold</th>
                                        <th className="px-6 py-5">Price</th>
                                        <th className="px-6 py-5">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {playbooks.map((playbook) => (
                                        <tr
                                            key={playbook.id}
                                            className="border-main-blue/20 border-t"
                                        >
                                            <td className="px-6 py-5 font-medium text-white">
                                                <Link
                                                    href={route(
                                                        'playbooks.show',
                                                        playbook.slug,
                                                    )}
                                                >
                                                    {playbook.title}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-wrap gap-2">
                                                    {(
                                                        playbook.trader_types ??
                                                        playbook.traderTypes ??
                                                        []
                                                    ).map(
                                                        (type: TraderType) => (
                                                            <TaxonomyBadge
                                                                key={type.id}
                                                                label={
                                                                    type.name
                                                                }
                                                                color={
                                                                    type.color
                                                                }
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <AccessBadge
                                                    access={playbook.access}
                                                />
                                            </td>
                                            <td className="px-6 py-5">
                                                {playbook.market ? (
                                                    <TaxonomyBadge
                                                        label={
                                                            playbook.market.name
                                                        }
                                                        color={
                                                            playbook.market
                                                                .color
                                                        }
                                                    />
                                                ) : (
                                                    <span className="text-white/45">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 text-white/65">
                                                {playbook.best_for}
                                            </td>
                                            <td className="px-6 py-5 text-white/70">
                                                {playbook.average_hold_time ??
                                                    '—'}
                                            </td>
                                            <td className="font-heading text-seafoam-green px-6 py-5">
                                                {playbook.price || '—'}
                                            </td>
                                            <td className="px-6 py-5">
                                                <HudButton
                                                    href={route(
                                                        'playbooks.show',
                                                        playbook.slug,
                                                    )}
                                                    tone="violet"
                                                >
                                                    {playbook.action_label ||
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
