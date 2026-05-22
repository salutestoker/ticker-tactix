import { HudButton, HudPanel, StatusBadge } from '@/Components/UI/Hud';
import { RotatingTaxonomyBadges } from '@/Components/UI/RotatingTaxonomyBadges';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatVersion } from '@/lib/format';
import type { Module } from '@/types';
import { Head, router } from '@inertiajs/react';

export default function AdminModulesIndex({ modules }: { modules: Module[] }) {
    return (
        <AdminLayout>
            <Head title="Manage Modules" />
            <HudPanel className="overflow-hidden">
                <div className="border-main-blue/25 flex items-center justify-between border-b p-5">
                    <h2 className="font-heading text-sm tracking-[0.16em] text-white uppercase">
                        Modules
                    </h2>
                    <HudButton href={route('admin.modules.create')}>
                        Create Module
                    </HudButton>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="font-heading text-seafoam-green text-xs tracking-[0.14em] uppercase">
                            <tr>
                                <th className="px-5 py-4">Title</th>
                                <th className="px-5 py-4">Trader Types</th>
                                <th className="px-5 py-4">Version</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {modules.map((module) => (
                                <tr
                                    key={module.id}
                                    className="border-main-blue/20 border-t"
                                >
                                    <td className="px-5 py-4 text-white">
                                        {module.title}
                                    </td>
                                    <td className="px-5 py-4 align-middle">
                                        <RotatingTaxonomyBadges
                                            types={
                                                module.trader_types ??
                                                module.traderTypes ??
                                                []
                                            }
                                        />
                                    </td>
                                    <td className="text-violet-light px-5 py-4">
                                        {formatVersion(module.version)}
                                    </td>
                                    <td className="px-5 py-4">
                                        <StatusBadge
                                            active={module.is_active}
                                            published={module.published_at}
                                        />
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex gap-2">
                                            <HudButton
                                                href={route(
                                                    'admin.modules.edit',
                                                    module.id,
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
                                                            'admin.modules.destroy',
                                                            module.id,
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
