import { HudButton, HudPanel } from '@/Components/UI/Hud';
import AdminLayout from '@/Layouts/AdminLayout';
import type { User } from '@/types';
import { Head } from '@inertiajs/react';

type AdminUser = Pick<
    User,
    | 'id'
    | 'name'
    | 'email'
    | 'discord_username'
    | 'discord_global_name'
    | 'is_admin'
> & {
    created_at?: string | null;
};

export default function UsersIndex({ users }: { users: AdminUser[] }) {
    return (
        <AdminLayout>
            <Head title="Admin Users" />
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="font-heading text-seafoam-green text-xs tracking-[0.22em] uppercase">
                        Access Control
                    </p>
                    <h2 className="font-heading mt-1 text-2xl tracking-[0.12em] text-white uppercase">
                        Users
                    </h2>
                </div>
                <HudButton href={route('admin.users.create')} tone="green">
                    New User
                </HudButton>
            </div>
            <HudPanel className="overflow-hidden">
                <div className="divide-main-blue/20 divide-y">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="grid gap-4 p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                        >
                            <div>
                                <p className="font-heading text-sm tracking-[0.14em] text-white uppercase">
                                    {user.name}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/55">
                                    <span>{user.email}</span>
                                    {user.discord_global_name ||
                                    user.discord_username ? (
                                        <span>
                                            Discord:{' '}
                                            {user.discord_global_name ||
                                                user.discord_username}
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {user.is_admin ? (
                                    <span className="font-heading border-seafoam-green/55 bg-seafoam-green/10 text-seafoam-green inline-flex rounded-sm border px-3 py-1 text-[0.65rem] tracking-[0.12em] uppercase">
                                        Admin
                                    </span>
                                ) : (
                                    <span className="font-heading border-main-blue/45 bg-main-blue/10 inline-flex rounded-sm border px-3 py-1 text-[0.65rem] tracking-[0.12em] text-sky-300 uppercase">
                                        User
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                    {!users.length ? (
                        <div className="p-8 text-center text-sm text-white/55">
                            No users found.
                        </div>
                    ) : null}
                </div>
            </HudPanel>
        </AdminLayout>
    );
}
