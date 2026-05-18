import { HudButton } from '@/Components/UI/Hud';
import type { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

const nav = [
    ['Dashboard', 'admin.dashboard', 'admin.dashboard'],
    ['Modules', 'admin.modules.index', 'admin.modules.*'],
    ['Playbooks', 'admin.playbooks.index', 'admin.playbooks.*'],
    ['Markets', 'admin.markets.index', 'admin.markets.*'],
    ['Trader Types', 'admin.trader-types.index', 'admin.trader-types.*'],
] as const;

const navLinkBase =
    'font-heading block rounded-sm border px-4 py-3 text-xs tracking-[0.16em] uppercase transition';
const navLinkIdle =
    'border-transparent text-white/65 hover:border-seafoam-green/40 hover:bg-seafoam-green/10 hover:text-seafoam-green';
const navLinkActive =
    'border-seafoam-green/40 bg-seafoam-green/10 text-seafoam-green';

export default function AdminLayout({ children }: PropsWithChildren) {
    const { auth, flash } = usePage<PageProps>().props;

    return (
        <div className="bg-midnight-blue min-h-screen text-white">
            <aside className="border-main-blue/25 bg-panel-deep/95 fixed inset-y-0 left-0 hidden w-72 border-r p-6 lg:block">
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
                    <HudButton
                        href={route('home')}
                        tone="blue"
                        className="w-full"
                    >
                        Public Site
                    </HudButton>
                </div>
            </aside>
            <div className="lg:pl-72">
                <header className="border-main-blue/20 bg-midnight-blue/90 sticky top-0 z-30 border-b px-5 py-4 backdrop-blur">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-heading text-seafoam-green text-xs tracking-[0.22em] uppercase">
                                Admin Command Center
                            </p>
                            <h1 className="font-heading mt-1 text-xl tracking-[0.08em] text-white uppercase">
                                Ticker Tactix
                            </h1>
                        </div>
                        <div className="flex gap-2">
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
                        </div>
                    </div>
                </header>
                {flash?.success || flash?.error ? (
                    <div className="border-seafoam-green/40 bg-panel mx-5 mt-5 rounded-sm border px-4 py-3 text-sm text-white">
                        {flash.success || flash.error}
                    </div>
                ) : null}
                <main className="px-5 py-8 lg:px-8">{children}</main>
            </div>
        </div>
    );
}
