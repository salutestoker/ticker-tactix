import { HudButton, HudPanel, StatusBadge } from '@/Components/UI/Hud';
import AdminLayout from '@/Layouts/AdminLayout';
import type { PlaybookCategory } from '@/types';
import { Head, router } from '@inertiajs/react';

export default function AdminCategoriesIndex({
    categories,
}: {
    categories: PlaybookCategory[];
}) {
    return (
        <AdminLayout>
            <Head title="Manage Categories" />
            <HudPanel className="overflow-hidden">
                <div className="border-main-blue/25 flex items-center justify-between border-b p-5">
                    <h2 className="font-heading text-sm tracking-[0.16em] text-white uppercase">
                        Playbook Categories
                    </h2>
                    <HudButton href={route('admin.playbook-categories.create')}>
                        Create Category
                    </HudButton>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="font-heading text-seafoam-green text-xs tracking-[0.14em] uppercase">
                            <tr>
                                <th className="px-5 py-4">Name</th>
                                <th className="px-5 py-4">Slug</th>
                                <th className="px-5 py-4">Modules</th>
                                <th className="px-5 py-4">Playbooks</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr
                                    key={category.id}
                                    className="border-main-blue/20 border-t"
                                >
                                    <td className="px-5 py-4 text-white">
                                        {category.name}
                                    </td>
                                    <td className="px-5 py-4 text-white/60">
                                        {category.slug}
                                    </td>
                                    <td className="px-5 py-4">
                                        {category.modules_count ?? 0}
                                    </td>
                                    <td className="px-5 py-4">
                                        {category.playbooks_count ?? 0}
                                    </td>
                                    <td className="px-5 py-4">
                                        <StatusBadge
                                            active={category.is_active}
                                            published="published"
                                        />
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex gap-2">
                                            <HudButton
                                                href={route(
                                                    'admin.playbook-categories.edit',
                                                    category.id,
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
                                                            'admin.playbook-categories.destroy',
                                                            category.id,
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
