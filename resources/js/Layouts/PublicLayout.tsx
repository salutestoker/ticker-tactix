import TraderFitProvider, {
    useTraderFitModal,
} from '@/Components/TraderFit/TraderFitProvider';
import type { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChartNoAxesCombined, Pencil } from 'lucide-react';
import { useEffect, useRef, useState, type PropsWithChildren } from 'react';

const nav = [
    ['Home', 'home'],
    ['Trader Types', 'trader-types'],

    ['Modules', 'modules.index'],
    ['Playbooks', 'playbooks.index'],
    ['System', 'system'],
    ['Contact', 'contact'],
] as const;

type PublicLayoutProps = PropsWithChildren<{
    adminEditHref?: string;
}>;

export default function PublicLayout({
    adminEditHref,
    children,
}: PublicLayoutProps) {
    const { auth, flash } = usePage<PageProps>().props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const showAdminEditButton = auth.user?.is_admin && adminEditHref;

    useEffect(() => {
        if (!isMenuOpen) {
            return;
        }

        function closeOnOutsidePointer(event: PointerEvent) {
            const target = event.target as Node;

            if (
                menuRef.current?.contains(target) ||
                menuButtonRef.current?.contains(target)
            ) {
                return;
            }

            setIsMenuOpen(false);
        }

        document.addEventListener('pointerdown', closeOnOutsidePointer);

        return () => {
            document.removeEventListener('pointerdown', closeOnOutsidePointer);
        };
    }, [isMenuOpen]);

    return (
        <TraderFitProvider>
            <div className="bg-midnight-blue min-h-screen overflow-hidden text-white">
                <header className="fixed top-0 right-0 left-0 z-40 px-4 py-5 sm:px-6">
                    <div className="mx-auto flex items-center justify-between">
                        <Link
                            className="group border-seafoam-green/20 hover:border-seafoam-green text-seafoam-green flex h-10 w-10 items-center justify-center rounded-full border bg-black/50"
                            href={route('home')}
                            aria-label="Ticker Tactix home"
                        >
                            <img
                                className="h-auto w-1/2 object-contain transition group-hover:scale-105"
                                src="/design/assets/images/logo-ticker-tactix-alien.png"
                                alt=""
                            />
                        </Link>
                        <div className="flex items-center gap-3">
                            <TraderFitResultsButton />
                            {showAdminEditButton ? (
                                <Link
                                    href={adminEditHref}
                                    className="border-gold/45 bg-gold/10 hover:border-gold focus-visible:ring-seafoam-green focus-visible:ring-offset-midnight-blue font-heading inline-flex h-10 items-center justify-center gap-2 rounded-sm border px-3 text-xs font-semibold tracking-[0.12em] text-gold uppercase transition hover:bg-gold/15 hover:text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                                    aria-label="Edit this page in admin"
                                >
                                    <Pencil
                                        className="h-4 w-4 shrink-0"
                                        aria-hidden
                                    />
                                    <span>Edit</span>
                                </Link>
                            ) : null}
                            {/*auth.user && (
                            <HudButton
                                href={route('admin.dashboard')}
                                tone="violet"
                                className="hidden sm:inline-flex"
                            >
                                Dashboard
                            </HudButton>
                        )*/}
                            <button
                                ref={menuButtonRef}
                                className="border-seafoam-green/20 text-seafoam-green hover:border-seafoam-green/50 focus-visible:ring-seafoam-green focus-visible:ring-offset-midnight-blue flex h-10 w-10 items-center justify-center rounded-full border bg-black/50 transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                                type="button"
                                aria-controls="site-menu"
                                aria-expanded={isMenuOpen}
                                aria-label={
                                    isMenuOpen ? 'Close menu' : 'Open menu'
                                }
                                onClick={() => setIsMenuOpen((open) => !open)}
                            >
                                <span className="relative h-3 w-4">
                                    <span
                                        className={`absolute left-0 h-px w-4 rounded-full bg-current transition ${isMenuOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'}`}
                                    />
                                    <span
                                        className={`absolute top-1/2 left-0 h-px w-4 -translate-y-1/2 rounded-full bg-current transition ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}
                                    />
                                    <span
                                        className={`absolute left-0 h-px w-4 rounded-full bg-current transition ${isMenuOpen ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0'}`}
                                    />
                                </span>
                            </button>
                        </div>
                    </div>
                    {isMenuOpen ? (
                        <div
                            ref={menuRef}
                            id="site-menu"
                            className="border-main-blue/35 bg-panel/95 absolute top-24 right-4 w-[min(calc(100vw-2rem),26rem)] rounded-md border p-3 shadow-[0_0_40px_rgba(55,100,245,0.22)] backdrop-blur sm:right-6"
                        >
                            <nav className="grid gap-2">
                                {nav.map(([label, name]) => (
                                    <Link
                                        key={name}
                                        href={route(name)}
                                        className="font-heading hover:border-main-blue/35 hover:bg-main-blue/10 hover:text-seafoam-green rounded-sm border border-transparent px-4 py-3 text-xs font-semibold tracking-[0.18em] text-white/70 uppercase transition"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {label}
                                    </Link>
                                ))}
                                {/*
                            <Link
                                href={accountHref}
                                className="font-heading hover:border-violet-light/35 hover:bg-violet-light/10 hover:text-violet-light rounded-sm border border-transparent px-4 py-3 text-xs font-semibold tracking-[0.18em] text-white/70 uppercase transition"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {accountLabel}
                            </Link>*/}
                                {auth.user?.is_admin ? (
                                    <Link
                                        href={route('admin.dashboard')}
                                        className="font-heading hover:border-main-blue/35 hover:bg-main-blue/10 rounded-sm border border-transparent px-4 py-3 text-xs font-semibold tracking-[0.18em] text-white/70 uppercase transition hover:text-sky-300"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Admin
                                    </Link>
                                ) : null}
                            </nav>
                        </div>
                    ) : null}
                </header>

                {flash?.success || flash?.error ? (
                    <div className="border-seafoam-green/40 bg-panel/95 fixed top-24 right-4 z-50 max-w-sm rounded-sm border px-4 py-3 text-sm text-white shadow-[0_0_24px_rgba(0,250,146,0.18)]">
                        {flash.success || flash.error}
                    </div>
                ) : null}

                <main>{children}</main>
                <Footer />
            </div>
        </TraderFitProvider>
    );
}

function TraderFitResultsButton() {
    const { hasCompletedTraderFit, openTraderFitModal } = useTraderFitModal();

    if (!hasCompletedTraderFit) {
        return null;
    }

    return (
        <button
            className="border-main-blue/45 bg-main-blue/10 hover:border-main-blue hover:bg-main-blue/20 focus-visible:ring-seafoam-green focus-visible:ring-offset-midnight-blue font-heading inline-flex min-h-10 max-w-[calc(100vw-7rem)] items-center justify-center gap-2 rounded-sm border px-3 py-2 text-[0.62rem] font-semibold tracking-[0.1em] text-sky-300 uppercase transition hover:text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:px-4 sm:text-xs"
            onClick={() => openTraderFitModal()}
            type="button"
        >
            <span className="truncate">Trader Type Results</span>
            <ChartNoAxesCombined className="h-4 w-4 shrink-0" aria-hidden />
        </button>
    );
}

function Footer() {
    const footerColumns: FooterColumnData[] = [
        {
            title: 'System',
            links: [
                {
                    label: 'Trader Types',
                    href: route('trader-types'),
                    external: false,
                },
                {
                    label: 'Modules',
                    href: route('modules.index'),
                    external: false,
                },
                {
                    label: 'Playbooks',
                    href: route('playbooks.index'),
                    external: false,
                },
                {
                    label: 'System',
                    href: route('system'),
                    external: false,
                },
                {
                    label: 'Email Support',
                    href: 'mailto:tickertactix@gmail.com',
                    external: true,
                },
            ],
        },
        {
            title: 'Resources',
            links: [
                {
                    label: 'Economic Calendar',
                    href: 'https://tradingeconomics.com/calendar',
                    external: true,
                },
            ],
        },
        {
            title: 'Community',
            links: [
                { label: 'Discord (unlocked with subscription)' },
                {
                    label: 'X (Twitter)',
                    href: 'https://x.com/ticker_tactix',
                    external: true,
                },
            ],
        },
        {
            title: 'Legal',
            links: [
                {
                    label: 'Terms of Service',
                    href: route('legal.show', 'terms-of-service'),
                    external: false,
                },
                {
                    label: 'Membership Agreement',
                    href: route('legal.show', 'membership-agreement'),
                    external: false,
                },
                {
                    label: 'Privacy Policy',
                    href: route('legal.show', 'privacy-policy'),
                    external: false,
                },
                {
                    label: 'Financial Disclaimer',
                    href: route('legal.show', 'financial-disclaimer'),
                    external: false,
                },
            ],
        },
    ];
    const mobileFooterColumnGroups = [
        [footerColumns[0], footerColumns[2]],
        [footerColumns[1], footerColumns[3]],
    ];
    const desktopFooterColumnOrder: Record<string, string> = {
        System: 'md:order-1',
        Resources: 'md:order-2',
        Community: 'md:order-3',
        Legal: 'md:order-4',
    };

    return (
        <footer className="bg-main-blue-bright relative overflow-hidden text-white">
            <video
                className="pointer-events-none absolute inset-0 opacity-90 max-md:top-full max-md:w-[520%] max-md:max-w-none max-md:-translate-y-full md:h-full md:w-full md:object-cover"
                autoPlay
                loop
                muted
                playsInline
                aria-hidden="true"
            >
                <source
                    src="/design/assets/videos/compressed/bg-footer-loop.mp4"
                    type="video/mp4"
                />
            </video>
            <div className="from-midnight-blue via-main-blue-bright/30 to-main-blue-bright/20 absolute inset-0 bg-gradient-to-b" />
            <div className="relative mx-auto max-w-6xl px-6 py-28 text-center">
                {/*<img*/}
                {/*    className="mx-auto mb-12 h-28 w-auto object-contain"*/}
                {/*    src="/design/assets/images/logo-ticker-tactix-2026.png"*/}
                {/*    alt="Ticker Tactix"*/}
                {/*/>*/}
                <div className="grid grid-cols-2 gap-x-6 gap-y-10 border-y border-white/15 py-10 text-left text-sm text-white/75 md:grid-cols-4 md:text-center">
                    {mobileFooterColumnGroups.map((columnGroup) => (
                        <div
                            key={columnGroup
                                .map((column) => column.title)
                                .join('-')}
                            className="space-y-10 md:contents"
                        >
                            {columnGroup.map((column) => (
                                <FooterColumn
                                    key={column.title}
                                    title={column.title}
                                    links={column.links}
                                    className={
                                        desktopFooterColumnOrder[column.title]
                                    }
                                />
                            ))}
                        </div>
                    ))}
                </div>
                <p className="font-heading mt-10 text-xs tracking-[0.35em] text-white/70 uppercase">
                    Trade with{' '}
                    <span className="text-seafoam-green">structure</span>,
                    not&nbsp;<span className="text-violet-light">emotion</span>.
                </p>
                <p className="mx-auto mt-6 max-w-xl text-xs text-white/60">
                    Ticker-Tactix LLC provides educational software tools for
                    financial market analysis. Nothing on this website
                    constitutes financial advice. Trading involves risk and
                    users are responsible for their own decisions.
                </p>
                <p className="mt-4 text-xs text-white/60 uppercase">
                    Copyright © 2026 Ticker-Tactix LLC.
                </p>
            </div>
        </footer>
    );
}

type FooterLink = {
    label: string;
    href?: string;
    external?: boolean;
};

type FooterColumnData = {
    title: string;
    links: FooterLink[];
};

function FooterColumn({
    title,
    links,
    className = '',
}: FooterColumnData & { className?: string }) {
    return (
        <div className={className}>
            <h3 className="font-heading text-seafoam-green text-xs tracking-[0.22em] uppercase">
                {title}
            </h3>
            <div className="mt-4 space-y-2">
                {links.map((link) => (
                    <div key={link.label}>
                        {link.href ? (
                            <a
                                className="text-inherit no-underline"
                                href={link.href}
                                target={link.external ? '_blank' : undefined}
                                rel={link.external ? 'noreferrer' : undefined}
                            >
                                {link.label}
                            </a>
                        ) : (
                            link.label
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
