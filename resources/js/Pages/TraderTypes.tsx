import { Eyebrow } from '@/Components/UI/Hud';
import { PublicHeroFrame } from '@/Components/UI/PublicHero';
import { TraderTypeCards } from '@/Components/UI/TraderTypeCards';
import PublicLayout from '@/Layouts/PublicLayout';
import type { PageProps, TraderType } from '@/types';
import { Head } from '@inertiajs/react';

type TraderTypesProps = PageProps<{
    traderTypes: TraderType[];
}>;

export default function TraderTypes({ traderTypes }: TraderTypesProps) {
    return (
        <PublicLayout>
            <Head title="What Type of Trader Are You?" />
            <PublicHeroFrame className="px-4 pt-32 pb-20 sm:px-6">
                <div className="pointer-events-none relative z-0 flex w-[102vw] translate-x-[-2%] -translate-y-[15%] justify-center mix-blend-lighten">
                    <img
                        src="/design/assets/images/bg-what-type-of-trader-are-you.jpg"
                        className=""
                        alt=""
                    />
                </div>
                <div className="mx-auto mt-[-30%] max-w-6xl text-center">
                    <Eyebrow>Framework Fit</Eyebrow>
                    <h1 className="font-heading leading-none font-semibold tracking-[0.06em] text-white uppercase drop-shadow-[0_0_26px_rgba(125,211,252,0.32)]">
                        <span className="text-seafoam-green mr-3 inline-block text-7xl sm:text-8xl lg:text-9xl">
                            {traderTypes.length || 6}
                        </span>
                        <span className="text-4xl sm:text-6xl lg:text-7xl">
                            Trader Types
                        </span>
                    </h1>
                    <p className="mx-auto mt-5 max-w-4xl text-xl leading-8 text-white/82 sm:text-2xl">
                        Find the Ticker-Tactix framework that fits how you
                        trade.
                    </p>
                </div>

                <TraderTypeCards traderTypes={traderTypes} className="mt-6" />
            </PublicHeroFrame>
        </PublicLayout>
    );
}
