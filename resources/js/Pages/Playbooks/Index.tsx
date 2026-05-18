import {
    AccessBadge,
    Eyebrow,
    GradientHeading,
    HudButton,
    HudPanel,
} from '@/Components/UI/Hud';
import { PublicHeroFrame } from '@/Components/UI/PublicHero';
import PublicLayout from '@/Layouts/PublicLayout';
import { formatPrice } from '@/lib/format';
import type { PageProps, Playbook } from '@/types';
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
                                        <th className="px-6 py-5">Framework</th>
                                        <th className="px-6 py-5">Access</th>
                                        <th className="px-6 py-5">Market</th>
                                        <th className="px-6 py-5">Best For</th>
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
                                                    {playbook.framework}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-5">
                                                <AccessBadge
                                                    access={playbook.access}
                                                />
                                            </td>
                                            <td className="px-6 py-5 text-white/70">
                                                {playbook.market}
                                            </td>
                                            <td className="px-6 py-5 text-white/65">
                                                {playbook.best_for}
                                            </td>
                                            <td className="font-heading text-seafoam-green px-6 py-5">
                                                {formatPrice(
                                                    playbook.price_cents,
                                                    playbook.currency,
                                                )}
                                            </td>
                                            <td className="px-6 py-5">
                                                <HudButton
                                                    href={route(
                                                        'playbooks.show',
                                                        playbook.slug,
                                                    )}
                                                    tone="violet"
                                                >
                                                    Inspect
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
