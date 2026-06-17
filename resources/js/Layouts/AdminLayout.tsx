import { HudButton } from '@/Components/UI/Hud';
import FlashToast from '@/Components/UI/FlashToast';
import type { PageProps } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { Eye, PanelLeftClose, PanelLeftOpen, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';

const nav = [
    ['Dashboard', 'admin.dashboard', 'admin.dashboard'],
    [
        'Newsletter Generator',
        'admin.newsletter-generator',
        'admin.newsletter-generator',
    ],
    ['Customers', 'admin.customers.index', 'admin.customers.*'],
    ['Modules', 'admin.modules.index', 'admin.modules.*'],
    ['Playbooks', 'admin.playbooks.index', 'admin.playbooks.*'],
    ['Markets', 'admin.markets.index', 'admin.markets.*'],
    ['Trader Types', 'admin.trader-types.index', 'admin.trader-types.*'],
    ['Users', 'admin.users.index', 'admin.users.*'],
    ['Components', 'admin.components.index', 'admin.components.*'],
] as const;

const navLinkBase =
    'font-heading block rounded-sm border px-4 py-3 text-xs tracking-[0.16em] uppercase transition';
const navLinkIdle =
    'border-transparent text-white/65 hover:border-seafoam-green/40 hover:bg-seafoam-green/10 hover:text-seafoam-green';
const navLinkActive =
    'border-seafoam-green/40 bg-seafoam-green/10 text-seafoam-green';

type AdminLayoutProps = PropsWithChildren<{
    publicViewHref?: string;
}>;

export default function AdminLayout({
    children,
    publicViewHref,
}: AdminLayoutProps) {
    const { auth } = usePage<PageProps>().props;
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    useEffect(() => {
        const storedValue = window.sessionStorage.getItem(
            'ticker-tactix-admin-sidebar-collapsed',
        );

        setIsSidebarCollapsed(storedValue === 'true');
    }, []);

    function toggleSidebar() {
        setIsSidebarCollapsed((current) => {
            const nextValue = !current;

            window.sessionStorage.setItem(
                'ticker-tactix-admin-sidebar-collapsed',
                String(nextValue),
            );

            return nextValue;
        });
    }

    return (
        <div className="bg-midnight-blue min-h-screen text-white">
            <FlashToast />
            <aside
                className={[
                    'border-main-blue/25 bg-panel-deep/95 fixed inset-y-0 left-0 hidden w-72 border-r p-6 transition-transform duration-300 lg:block',
                    isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0',
                ].join(' ')}
            >
                <Link href={route('home')} className="block">
                    <img
                        className="mx-auto h-24 w-auto object-contain"
                        src="/design/assets/images/logo-ticker-tactix-2026.png"
                        alt="Ticker Tactix"
                    />
                </Link>
                <nav className="mt-10 space-y-2">
                    {nav.map(([label, name, match]) => {
                        const isActive = route().current(match);

                        return (
                            <Link
                                key={name}
                                href={route(name)}
                                className={`${navLinkBase} ${isActive ? navLinkActive : navLinkIdle}`}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="absolute right-6 bottom-6 left-6">
                    <p className="mb-3 text-center text-xs text-white/45">
                        Signed in as {auth.user?.name}
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                        <HudButton
                            href={route('profile.edit')}
                            tone="blue"
                            className="w-full px-3"
                        >
                            Profile
                        </HudButton>
                        <HudButton
                            type="button"
                            tone="violet"
                            className="w-full px-3"
                            onClick={() => router.post(route('logout'))}
                        >
                            Logout
                        </HudButton>
                    </div>
                </div>
            </aside>
            <div
                className={[
                    'transition-[padding] duration-300',
                    isSidebarCollapsed ? 'lg:pl-0' : 'lg:pl-72',
                ].join(' ')}
            >
                <header className="border-main-blue/20 bg-midnight-blue/90 sticky top-0 z-30 border-b px-5 py-4 backdrop-blur">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                className="border-main-blue/45 bg-main-blue/10 text-seafoam-green hover:border-seafoam-green/60 hover:bg-seafoam-green/10 inline-flex size-11 items-center justify-center rounded-sm border transition focus-visible:ring-2 focus-visible:ring-seafoam-green focus-visible:ring-offset-2 focus-visible:ring-offset-midnight-blue focus-visible:outline-none"
                                onClick={toggleSidebar}
                                aria-label={
                                    isSidebarCollapsed
                                        ? 'Show admin sidebar'
                                        : 'Hide admin sidebar'
                                }
                                title={
                                    isSidebarCollapsed
                                        ? 'Show sidebar'
                                        : 'Hide sidebar'
                                }
                            >
                                {isSidebarCollapsed ? (
                                    <PanelLeftOpen
                                        className="h-5 w-5"
                                        aria-hidden
                                    />
                                ) : (
                                    <PanelLeftClose
                                        className="h-5 w-5"
                                        aria-hidden
                                    />
                                )}
                            </button>
                            <div>
                                <p className="font-heading text-seafoam-green text-xs tracking-[0.22em] uppercase">
                                    Admin Command Center
                                </p>
                                <h1 className="font-heading mt-1 text-xl tracking-[0.08em] text-white uppercase">
                                    Ticker Tactix
                                </h1>
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-end gap-2">
                            <HudButton
                                href={route('admin.modules.create')}
                                tone="green"
                            >
                                New Module
                            </HudButton>
                            <HudButton
                                href={route('admin.playbooks.create')}
                                tone="violet"
                            >
                                New Playbook
                            </HudButton>
                            <HudButton
                                href={route('admin.users.create')}
                                tone="blue"
                            >
                                <User className="mr-2 h-4 w-4" aria-hidden />
                                New User
                            </HudButton>

                            {publicViewHref ? (
                                <HudButton href={publicViewHref} tone="blue">
                                    <Eye className="mr-2 h-4 w-4" aria-hidden />
                                    View
                                </HudButton>
                            ) : (
                                <HudButton href={route('home')} tone="blue">
                                    <Eye className="mr-2 h-4 w-4" aria-hidden />
                                    View Site
                                </HudButton>
                            )}
                        </div>
                    </div>
                </header>
                <main className="px-5 py-8 lg:px-8">{children}</main>
            </div>
        </div>
    );
}
