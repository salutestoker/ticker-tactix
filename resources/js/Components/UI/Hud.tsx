import { brandColor } from '@/lib/brand';
import { accessLabel } from '@/lib/format';
import { Link } from '@inertiajs/react';
import type { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from 'react';

type Tone = 'green' | 'violet' | 'blue' | 'gold';

const toneClasses: Record<Tone, string> = {
    green: 'border-seafoam-green/55 bg-seafoam-green/10 text-seafoam-green shadow-[0_0_24px_rgba(0,250,146,0.18)]',
    violet: 'border-violet-light/55 bg-violet-light/10 text-violet-light shadow-[0_0_24px_rgba(181,67,215,0.18)]',
    blue: 'border-main-blue/55 bg-main-blue/10 text-sky-300 shadow-[0_0_24px_rgba(55,100,245,0.18)]',
    gold: 'border-gold/55 bg-gold/10 text-gold shadow-[0_0_24px_rgba(243,191,56,0.18)]',
};

interface HudButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    href?: string;
    tone?: Tone;
    variant?: 'solid' | 'outline';
    external?: boolean;
}

export function HudButton({
    href,
    tone = 'green',
    variant = 'outline',
    external = false,
    children,
    className = '',
    ...props
}: HudButtonProps) {
    const solid =
        tone === 'green'
            ? 'border-seafoam-green bg-seafoam-green text-midnight-blue shadow-[0_0_28px_rgba(0,250,146,0.32)]'
            : tone === 'violet'
              ? 'border-violet-light text-midnight-blue bg-violet-light shadow-[0_0_28px_rgba(181,67,215,0.3)]'
              : toneClasses[tone];
    const classes = [
        'inline-flex min-h-11 items-center justify-center rounded-sm border px-5 py-3 font-heading text-xs font-semibold uppercase tracking-[0.14em] transition hover:brightness-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seafoam-green focus-visible:ring-offset-2 focus-visible:ring-offset-midnight-blue disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'solid' ? solid : toneClasses[tone],
        className,
    ].join(' ');

    if (href) {
        if (external) {
            return (
                <a
                    className={classes}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                >
                    {children}
                </a>
            );
        }

        return (
            <Link className={classes} href={href}>
                {children}
            </Link>
        );
    }

    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
}

export function HudPanel({
    children,
    className = '',
}: PropsWithChildren<{ className?: string }>) {
    return (
        <div
            className={`border-main-blue/35 bg-panel/80 rounded-md border shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_30px_rgba(55,100,245,0.13)] ${className}`}
        >
            {children}
        </div>
    );
}

export function Eyebrow({ children }: PropsWithChildren) {
    return (
        <div className="font-heading text-seafoam-green mb-4 flex items-center justify-center gap-3 text-xs font-semibold tracking-[0.35em] uppercase">
            <span className="to-main-blue/70 h-px w-16 bg-gradient-to-r from-transparent" />
            {children}
            <span className="to-violet-light/70 h-px w-16 bg-gradient-to-l from-transparent" />
        </div>
    );
}

export function GradientHeading({
    children,
    className = '',
}: PropsWithChildren<{ className?: string }>) {
    return (
        <h1
            className={`brand-gradient-text font-heading text-4xl leading-none font-semibold uppercase sm:text-5xl lg:text-6xl ${className}`}
        >
            {children}
        </h1>
    );
}

export function AccessBadge({ access }: { access: string }) {
    return (
        <span
            className={`font-heading inline-flex items-center rounded-sm border px-3 py-1 text-[0.65rem] font-semibold tracking-[0.12em] uppercase ${toneClasses.blue}`}
        >
            {accessLabel(access)}
        </span>
    );
}

export function TaxonomyBadge({
    label,
    color,
}: {
    label: string;
    color?: string | null;
}) {
    const tone = brandColor(color);

    return (
        <span
            className={`font-heading inline-flex items-center rounded-sm border px-3 py-1 text-[0.65rem] font-semibold tracking-[0.12em] uppercase ${tone.borderClass} ${tone.backgroundClass} ${tone.textClass} ${tone.glowClass}`}
        >
            {label}
        </span>
    );
}

export function StatusBadge({
    active,
    published,
}: {
    active: boolean;
    published?: string | null;
}) {
    const label =
        active && published ? 'Published' : active ? 'Draft' : 'Hidden';

    return (
        <span
            className={`font-heading inline-flex rounded-sm border px-3 py-1 text-[0.65rem] tracking-[0.12em] uppercase ${active && published ? toneClasses.green : active ? toneClasses.blue : toneClasses.violet}`}
        >
            {label}
        </span>
    );
}

export function EmptyState({
    title,
    children,
}: PropsWithChildren<{ title: ReactNode }>) {
    return (
        <HudPanel className="p-8 text-center">
            <h3 className="font-heading text-lg tracking-[0.16em] text-white uppercase">
                {title}
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/60">
                {children}
            </p>
        </HudPanel>
    );
}
