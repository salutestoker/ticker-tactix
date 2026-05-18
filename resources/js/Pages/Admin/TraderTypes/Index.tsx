import { IconRenderer } from '@/Components/Icons/IconRenderer';
import {
    HudButton,
    HudPanel,
    StatusBadge,
    TaxonomyBadge,
} from '@/Components/UI/Hud';
import AdminLayout from '@/Layouts/AdminLayout';
import type { TraderType } from '@/types';
import { Head, router } from '@inertiajs/react';

export default function AdminTraderTypesIndex({
    traderTypes,
}: {
    traderTypes: TraderType[];
}) {
    return (
        <AdminLayout>
            <Head title="Manage Trader Types" />
            <HudPanel className="overflow-hidden">
                <div className="border-main-blue/25 flex items-center justify-between border-b p-5">
                    <h2 className="font-heading text-sm tracking-[0.16em] text-white uppercase">
                        Trader Types
                    </h2>
                    <HudButton href={route('admin.trader-types.create')}>
                        Create Trader Type
                    </HudButton>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="font-heading text-seafoam-green text-xs tracking-[0.14em] uppercase">
                            <tr>
                                <th className="px-5 py-4">Name</th>
                                <th className="px-5 py-4">Slug</th>
                                <th className="px-5 py-4">Icon</th>
                                <th className="px-5 py-4">Color</th>
                                <th className="px-5 py-4">Modules</th>
                                <th className="px-5 py-4">Playbooks</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {traderTypes.map((traderType) => (
                                <tr
                                    key={traderType.id}
                                    className="border-main-blue/20 border-t"
                                >
                                    <td className="px-5 py-4 text-white">
                                        {traderType.name}
                                    </td>
                                    <td className="px-5 py-4 text-white/60">
                                        {traderType.slug}
                                    </td>
                                    <td className="px-5 py-4">
                                        {traderType.icon ? (
                                            <IconRenderer
                                                name={traderType.icon}
                                                className="text-seafoam-green h-6 w-6"
                                            />
                                        ) : (
                                            <span className="text-white/45">
                                                —
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        <TaxonomyBadge
                                            label={
                                                traderType.color || 'default'
                                            }
                                            color={traderType.color}
                                        />
                                    </td>
                                    <td className="px-5 py-4 text-white/70">
                                        {traderType.modules_count ?? 0}
                                    </td>
                                    <td className="px-5 py-4 text-white/70">
                                        {traderType.playbooks_count ?? 0}
                                    </td>
                                    <td className="px-5 py-4">
                                        <StatusBadge
                                            active={traderType.is_active}
                                            published="published"
                                        />
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex gap-2">
                                            <HudButton
                                                href={route(
                                                    'admin.trader-types.edit',
                                                    traderType.id,
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
                                                            'admin.trader-types.destroy',
                                                            traderType.id,
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
