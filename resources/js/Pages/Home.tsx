import { ModuleCardsCarousel } from '@/Components/UI/ModuleCardsCarousel';
import { TraderTypeCards } from '@/Components/UI/TraderTypeCards';
import PublicLayout from '@/Layouts/PublicLayout';
import type { Module, PageProps, TraderType } from '@/types';
import { Head } from '@inertiajs/react';

interface Props extends PageProps {
    modules: Module[];
    traderTypes: TraderType[];
}

export default function Home({ modules, traderTypes }: Props) {
    return (
        <PublicLayout>
            <Head title="Ticker-Tactix" />
            <section className="relative min-h-[980px] overflow-hidden px-6 pb-5">
                <div className="absolute inset-0 h-[50vw] bg-[url('/design/assets/images/bg-hero.jpg')] bg-cover bg-bottom opacity-95 md:h-[80vh]" />

                <img
                    className="absolute top-[15%] left-1/2 min-h-[80vw] w-full max-w-[2100px] min-w-300 -translate-x-1/2"
                    src="/design/assets/images/bg-abduction.png"
                    alt=""
                />

                <div className="via-midnight-blue/80 to-midnight-blue absolute inset-0 bg-gradient-to-b from-transparent" />
                <div className="relative mx-auto mt-[20vw] flex max-w-7xl flex-col items-center text-center md:mt-[260px]">
                    <img
                        className="h-40 w-auto max-w-none md:h-80"
                        src="/design/assets/images/logo-ticker-tactix-2026.png"
                        alt="Ticker Tactix"
                    />
                    <div className="w-full">
                        <h1 className="text-seafoam-green font-heading text-5xl leading-[0.8] font-semibold uppercase sm:text-7xl lg:text-8xl">
                            <div style={{ lineHeight: 0.4 }}>
                                <span className="brand-gradient-text-reverse font-heading text-main-blue text-2xl tracking-[0.12em] uppercase sm:text-4xl">
                                    Trade With
                                </span>
                            </div>
                            Structure
                            <div>
                                <span className="brand-gradient-text text-[2.75rem] sm:text-[4.1rem] lg:text-[5.5rem]">
                                    Not Emotion
                                </span>
                            </div>
                        </h1>
                        {/*<p className="font-mono-display mx-auto mt-8 max-w-2xl text-lg leading-8 tracking-[0.12em] text-white/80 uppercase">*/}
                        {/*    A rules-based market operating system for traders*/}
                        {/*    who value structure over signals.*/}
                        {/*</p>*/}

                        <p className="font-mono-display mx-auto mt-8 max-w-2xl text-lg leading-8 tracking-[0.12em] text-white/80 uppercase">
                            A rules-based market operating system for traders
                            who value structure over signals.
                        </p>

                        <TraderTypeCards
                            traderTypes={traderTypes}
                            className="mt-10"
                        />
                        <ModuleCardsCarousel modules={modules} />

                        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                            {/*<HudButton*/}
                            {/*    href={route('modules.index')}*/}
                            {/*    variant="solid"*/}
                            {/*>*/}
                            {/*    Explore Modules*/}
                            {/*</HudButton>*/}
                            {/*<HudButton*/}
                            {/*    href={route('playbooks.index')}*/}
                            {/*    tone="violet"*/}
                            {/*    variant="solid"*/}
                            {/*>*/}
                            {/*    Explore Playbooks*/}
                            {/*</HudButton>*/}
                        </div>
                    </div>

                    <div className="relative z-10 mt-6 w-full py-5 mix-blend-lighten">
                        <img
                            src="/design/assets/images/bg-home-how-ticker-tactix-works.png"
                            className="mx-auto"
                            alt=""
                        />
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
