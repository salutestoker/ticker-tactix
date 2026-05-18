import { AccessBadge, HudPanel, StatusBadge } from '@/Components/UI/Hud';
import AdminLayout from '@/Layouts/AdminLayout';
import type { Module, Playbook } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function AdminDashboard({
    stats,
    recentModules,
    recentPlaybooks,
}: {
    stats: {
        modules: number;
        playbooks: number;
        markets: number;
        traderTypes: number;
        drafts: number;
    };
    recentModules: Module[];
    recentPlaybooks: Playbook[];
}) {
    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            <div className="grid gap-5 md:grid-cols-4">
                {Object.entries(stats).map(([label, value]) => (
                    <HudPanel key={label} className="p-6">
                        <p className="font-heading text-xs tracking-[0.18em] text-white/45 uppercase">
                            {label}
                        </p>
                        <p className="font-heading text-seafoam-green mt-3 text-4xl">
                            {value}
                        </p>
                    </HudPanel>
                ))}
            </div>
            <div className="mt-8 grid gap-6 xl:grid-cols-2">
                <Recent
                    title="Recent Modules"
                    items={recentModules}
                    routeName="admin.modules.edit"
                />
                <Recent
                    title="Recent Playbooks"
                    items={recentPlaybooks}
                    routeName="admin.playbooks.edit"
                />
            </div>
        </AdminLayout>
    );
}

function Recent({
    title,
    items,
    routeName,
}: {
    title: string;
    items: (Module | Playbook)[];
    routeName: string;
}) {
    return (
        <HudPanel className="overflow-hidden">
            <h2 className="border-main-blue/25 font-heading border-b p-5 text-sm tracking-[0.16em] text-white uppercase">
                {title}
            </h2>
            <div className="divide-main-blue/20 divide-y">
                {items.map((item) => (
                    <Link
                        key={item.id}
                        className="hover:bg-main-blue/10 flex items-center justify-between gap-4 p-5 transition"
                        href={route(routeName, item.id)}
                    >
                        <div>
                            <p className="font-medium text-white">
                                {item.title}
                            </p>
                            <p className="mt-1 text-sm text-white/50">
                                {item.market?.name || 'No market assigned'}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {'access' in item ? (
                                <AccessBadge access={item.access} />
                            ) : null}
                            <StatusBadge
                                active={item.is_active}
                                published={item.published_at}
                            />
                        </div>
                    </Link>
                ))}
            </div>
        </HudPanel>
    );
}
