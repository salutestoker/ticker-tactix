import {
    HudButton,
    HudPanel,
    StatusBadge,
    TaxonomyBadge,
} from '@/Components/UI/Hud';
import AdminLayout from '@/Layouts/AdminLayout';
import type { Market } from '@/types';
import { Head, router } from '@inertiajs/react';

export default function AdminMarketsIndex({ markets }: { markets: Market[] }) {
    return (
        <AdminLayout>
            <Head title="Manage Markets" />
            <HudPanel className="overflow-hidden">
                <div className="border-main-blue/25 flex items-center justify-between border-b p-5">
                    <h2 className="font-heading text-sm tracking-[0.16em] text-white uppercase">
                        Markets
                    </h2>
                    <HudButton href={route('admin.markets.create')}>
                        Create Market
                    </HudButton>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="font-heading text-seafoam-green text-xs tracking-[0.14em] uppercase">
                            <tr>
                                <th className="px-5 py-4">Name</th>
                                <th className="px-5 py-4">Slug</th>
                                <th className="px-5 py-4">Color</th>
                                <th className="px-5 py-4">Modules</th>
                                <th className="px-5 py-4">Playbooks</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {markets.map((market) => (
                                <tr
                                    key={market.id}
                                    className="border-main-blue/20 border-t"
                                >
                                    <td className="px-5 py-4 text-white">
                                        {market.name}
                                    </td>
                                    <td className="px-5 py-4 text-white/60">
                                        {market.slug}
                                    </td>
                                    <td className="px-5 py-4">
                                        <TaxonomyBadge
                                            label={market.color || 'default'}
                                            color={market.color}
                                        />
                                    </td>
                                    <td className="px-5 py-4 text-white/70">
                                        {market.modules_count ?? 0}
                                    </td>
                                    <td className="px-5 py-4 text-white/70">
                                        {market.playbooks_count ?? 0}
                                    </td>
                                    <td className="px-5 py-4">
                                        <StatusBadge
                                            active={market.is_active}
                                            published="published"
                                        />
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex gap-2">
                                            <HudButton
                                                href={route(
                                                    'admin.markets.edit',
                                                    market.id,
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
                                                            'admin.markets.destroy',
                                                            market.id,
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
