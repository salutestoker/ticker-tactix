import type { PropsWithChildren } from 'react';

export function PublicHeroBackdrop() {
    return (
        <>
            <div className="absolute inset-x-0 top-0 h-[50vw] bg-[url('/design/assets/images/bg-hero.jpg')] bg-cover bg-top opacity-50" />
            <div className="from-midnight-blue/60 to-midnight-blue absolute inset-0 bg-gradient-to-b" />
        </>
    );
}

export function PublicHeroFrame({
    children,
    className = 'px-6 pt-40 pb-24',
}: PropsWithChildren<{ className?: string }>) {
    return (
        <section className={`relative overflow-hidden ${className}`}>
            <PublicHeroBackdrop />
            <div className="relative">{children}</div>
        </section>
    );
}
