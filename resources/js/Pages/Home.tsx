import { Eyebrow, HudButton } from '@/Components/UI/Hud';
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
            <img
                className="absolute top-[15%] left-1/2 z-10 min-h-[80vw] w-full max-w-[2100px] min-w-300 -translate-x-1/2 opacity-30"
                src="/design/assets/images/bg-abduction.png"
                alt=""
            />
            <section className="relative min-h-screen overflow-hidden px-6">
                <div className="absolute inset-0 h-[30vw] bg-[url('/design/assets/images/bg-hero.jpg')] bg-cover bg-bottom opacity-95" />

                {/*<div className="via-midnight-blue/80 to-midnight-blue absolute inset-0 bg-gradient-to-b from-transparent" />*/}
                <div className="relative z-20 mx-auto mt-[12vw] flex max-w-7xl flex-col items-center text-center">
                    <img
                        className="h-40 w-auto max-w-none md:h-60"
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

                        <p className="font-mono-display mx-auto mt-8 mb-8 max-w-2xl text-lg leading-8 tracking-[0.12em] text-white/80 uppercase">
                            A rules-based market operating system for traders
                            who value structure over signals.
                        </p>

                        <HudButton href="#trader-types" variant="solid">
                            What type of trader are you?
                        </HudButton>
                    </div>
                </div>
            </section>
            <section id="trader-types" className="scroll-mt-15 px-6 pb-5">
                <div>
                    <div>
                        <div className="mt-10">
                            <Eyebrow>Get Started</Eyebrow>
                            <h1 className="font-heading text-center text-4xl leading-none font-semibold uppercase sm:text-5xl lg:text-6xl">
                                <span className="text-violet">
                                    What type of
                                </span>{' '}
                                <span className="text-seafoam-green block">
                                    trader are you?
                                </span>
                            </h1>
                            <p className="mx-auto mt-5 max-w-2xl text-center text-lg text-white/75">
                                Start by choosing your trader type. Each path
                                connects you to the modules and playbooks
                                designed for your market, pace, and level of
                                execution structure.
                            </p>
                        </div>

                        <TraderTypeCards
                            traderTypes={traderTypes}
                            className="mt-10"
                        />

                        <div className="relative z-10 mt-6 w-full py-5 mix-blend-lighten">
                            <img
                                src="/design/assets/images/bg-home-how-ticker-tactix-works.png"
                                className="mx-auto"
                                alt=""
                            />
                        </div>
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
                </div>
            </section>
        </PublicLayout>
    );
}
