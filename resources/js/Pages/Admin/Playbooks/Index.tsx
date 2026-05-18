import {
    AccessBadge,
    HudButton,
    HudPanel,
    StatusBadge,
    TaxonomyBadge,
} from '@/Components/UI/Hud';
import AdminLayout from '@/Layouts/AdminLayout';
import type { Playbook } from '@/types';
import { Head, router } from '@inertiajs/react';

export default function AdminPlaybooksIndex({
    playbooks,
}: {
    playbooks: Playbook[];
}) {
    return (
        <AdminLayout>
            <Head title="Manage Playbooks" />
            <HudPanel className="overflow-hidden">
                <div className="border-main-blue/25 flex items-center justify-between border-b p-5">
                    <h2 className="font-heading text-sm tracking-[0.16em] text-white uppercase">
                        Playbooks
                    </h2>
                    <HudButton href={route('admin.playbooks.create')}>
                        Create Playbook
                    </HudButton>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="font-heading text-seafoam-green text-xs tracking-[0.14em] uppercase">
                            <tr>
                                <th className="px-5 py-4">Playbook</th>
                                <th className="px-5 py-4">Market</th>
                                <th className="px-5 py-4">Trader Types</th>
                                <th className="px-5 py-4">Access</th>
                                <th className="px-5 py-4">Price</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {playbooks.map((playbook) => (
                                <tr
                                    key={playbook.id}
                                    className="border-main-blue/20 border-t"
                                >
                                    <td className="px-5 py-4 text-white">
                                        {playbook.title}
                                    </td>
                                    <td className="px-5 py-4">
                                        {playbook.market ? (
                                            <TaxonomyBadge
                                                label={playbook.market.name}
                                                color={playbook.market.color}
                                            />
                                        ) : (
                                            <span className="text-white/45">
                                                —
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex flex-wrap gap-2">
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
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <AccessBadge access={playbook.access} />
                                    </td>
                                    <td className="text-seafoam-green px-5 py-4">
                                        {playbook.price || '—'}
                                    </td>
                                    <td className="px-5 py-4">
                                        <StatusBadge
                                            active={playbook.is_active}
                                            published={playbook.published_at}
                                        />
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex gap-2">
                                            <HudButton
                                                href={route(
                                                    'admin.playbooks.edit',
                                                    playbook.id,
                                                )}
                                                tone="blue"
                                            >
                                                Edit
                                            </HudButton>
                                            <HudButton
                                                type="button"
                                                tone="violet"
                                                onClick={() =>
                                                    router.delete(
                                                        route(
                                                            'admin.playbooks.destroy',
                                                            playbook.id,
                                                        ),
                                                    )
                                                }
                                            >
                                                Archive
                                            </HudButton>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </HudPanel>
        </AdminLayout>
    );
}
