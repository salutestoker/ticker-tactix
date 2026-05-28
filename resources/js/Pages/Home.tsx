import TraderFitButton from '@/Components/TraderFit/TraderFitButton';
import { Eyebrow, HudButton } from '@/Components/UI/Hud';
import { ModuleCardsCarousel } from '@/Components/UI/ModuleCardsCarousel';
import {
    TraderTypeCards,
    TraderTypeLegend,
} from '@/Components/UI/TraderTypeCards';
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
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[165vh] overflow-hidden">
                <img
                    className="absolute top-[15vh] left-1/2 min-h-[80vw] w-[clamp(800px,100vw,2100px)] max-w-none -translate-x-1/2 opacity-30"
                    src="/design/assets/images/bg-abduction.png"
                    alt=""
                />
            </div>

            <section className="relative min-h-screen overflow-hidden px-6">
                <div className="absolute inset-0 h-[52vw] opacity-90 md:h-[30vw]">
                    <video
                        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-bottom max-md:max-w-none"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        aria-hidden="true"
                        poster="/design/assets/images/hero-video-poster.jpg"
                    >
                        <source
                            src="/design/assets/videos/compressed/bg-hero-loop.mp4"
                            type="video/mp4"
                        />
                    </video>

                    <div className="brand-gradient-midnight-blue absolute bottom-0 h-full w-full"></div>
                </div>

                <div className="relative z-20 mx-auto mt-[25vw] flex max-w-7xl flex-col items-center text-center md:mt-[12vw]">
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

                        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                            <TraderFitButton />
                        </div>
                    </div>
                </div>
            </section>
            <section
                id="trader-types"
                className="relative z-20 scroll-mt-15 px-6 pb-5"
            >
                <div>
                    <div>
                        <div className="mt-15 sm:mt-30">
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
                            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                                <HudButton
                                    href={route('trader-types')}
                                    variant="solid"
                                >
                                    Find Your Trader Type
                                </HudButton>
                                <HudButton
                                    href={route('system')}
                                    tone="violet"
                                    variant="solid"
                                >
                                    Explore the System
                                </HudButton>
                            </div>
                        </div>

                        <TraderTypeCards
                            traderTypes={traderTypes}
                            className="mt-10"
                        />

                        <p className="mx-auto mt-4 mb-8 text-center leading-8 text-white/80">
                            Ticker-Tactix organizes market decisions into layers
                            so traders can move from raw data to structured
                            execution.
                        </p>

                        <div className="bg-midnight-blue relative z-10 mt-6 w-full py-5">
                            <img
                                src="/design/assets/images/bg-home-how-ticker-tactix-works.png"
                                className="mx-auto mix-blend-lighten"
                                alt=""
                            />
                        </div>
                        <div className="relative z-20">
                            <TraderTypeLegend />
                        </div>

                        <ModuleCardsCarousel modules={modules} />
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
