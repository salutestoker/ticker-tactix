import {
    AccessBadge,
    Eyebrow,
    GradientHeading,
    HudPanel,
    TaxonomyBadge,
} from '@/Components/UI/Hud';
import { PublicHeroFrame } from '@/Components/UI/PublicHero';
import PublicLayout from '@/Layouts/PublicLayout';
import type { PageProps, Playbook, TraderType } from '@/types';
import { Head, router } from '@inertiajs/react';

export default function PlaybooksIndex({
    playbooks,
}: PageProps<{ playbooks: Playbook[] }>) {
    return (
        <PublicLayout>
            <Head title="Playbooks" />
            <PublicHeroFrame>
                <div className="relative z-10 flex w-[102vw] translate-x-[-2%] -translate-y-[18%] justify-center mix-blend-lighten">
                    <img
                        src="/design/assets/images/bg-playbooks.png"
                        className=""
                        alt=""
                    />
                </div>
                <div className="mx-auto max-w-7xl">
                    <Eyebrow>Playbook Access</Eyebrow>
                    <GradientHeading className="text-center">
                        Playbook Matrix
                    </GradientHeading>
                    <HudPanel className="mt-12 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead className="font-heading text-seafoam-green text-xs tracking-[0.14em] uppercase">
                                    <tr>
                                        <th className="px-3 py-4 sm:px-6 sm:py-5">
                                            Playbook
                                        </th>
                                        <th className="px-3 py-4 sm:px-6 sm:py-5">
                                            Trader Type
                                        </th>
                                        <th className="hidden px-6 py-5 md:table-cell">
                                            Access
                                        </th>
                                        <th className="hidden px-6 py-5 md:table-cell">
                                            Market
                                        </th>
                                        <th className="hidden px-6 py-5 md:table-cell">
                                            Best For
                                        </th>
                                        <th className="px-3 py-4 sm:px-6 sm:py-5">
                                            Price
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {playbooks.map((playbook) => (
                                        <tr
                                            key={playbook.id}
                                            role="link"
                                            tabIndex={0}
                                            aria-label={`Explore ${playbook.title}`}
                                            className="border-main-blue/20 hover:bg-main-blue/10 focus-visible:ring-seafoam-green/60 cursor-pointer border-t transition focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
                                            onClick={() =>
                                                router.visit(
                                                    route(
                                                        'playbooks.show',
                                                        playbook.slug,
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
                                                            'playbooks.show',
                                                            playbook.slug,
                                                        ),
                                                    );
                                                }
                                            }}
                                        >
                                            <td className="px-3 py-4 font-medium text-white sm:px-6 sm:py-5">
                                                <span className="font-heading text-sm tracking-[0.08em] text-white uppercase">
                                                    {playbook.title}
                                                </span>
                                            </td>
                                            <td className="px-3 py-4 sm:px-6 sm:py-5">
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
                                            <td className="hidden px-6 py-5 md:table-cell">
                                                <AccessBadge
                                                    access={playbook.access}
                                                />
                                            </td>
                                            <td className="hidden px-6 py-5 md:table-cell">
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
                                            <td className="hidden w-full min-w-[300px] px-6 py-5 text-white/75 md:table-cell">
                                                {playbook.best_for}
                                            </td>
                                            <td className="font-heading text-seafoam-green px-3 py-4 sm:px-6 sm:py-5">
                                                {playbook.price || '—'}
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
