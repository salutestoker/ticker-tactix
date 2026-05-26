import { Eyebrow, HudPanel } from '@/Components/UI/Hud';
import { PublicHeroFrame } from '@/Components/UI/PublicHero';
import {
    TraderTypeCards,
    TraderTypeLegend,
} from '@/Components/UI/TraderTypeCards';
import PublicLayout from '@/Layouts/PublicLayout';
import type { PageProps, TraderType } from '@/types';
import { Head } from '@inertiajs/react';

type TraderTypesProps = PageProps<{
    traderTypes: TraderType[];
}>;

const traderTypeGuide = [
    {
        title: 'Choose by market',
        copy: 'NYSE or Crypto.',
        tone: 'text-seafoam-green',
    },
    {
        title: 'Choose by structure level',
        copy: 'Base, Core, or Pro.',
        tone: 'text-violet-light',
    },
    {
        title: 'Choose by trading style',
        copy: 'Daily context, swing structure, or active execution.',
        tone: 'text-gold',
    },
];

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
                <div className="mx-auto mt-[-20%] max-w-6xl text-center">
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

                <div className="relative z-20 pt-20">
                    <TraderTypeLegend />
                </div>

                <div className="mx-auto my-20 grid max-w-6xl gap-6 md:grid-cols-3">
                    {traderTypeGuide.map(({ title, copy, tone }) => (
                        <HudPanel key={title} className="relative p-5">
                            <h2
                                className={`font-heading text-[15px] tracking-[0.12em] uppercase ${tone}`}
                            >
                                {title}
                            </h2>
                            <p className="mt-4 leading-7 text-white/68">
                                {copy}
                            </p>
                        </HudPanel>
                    ))}
                </div>

                <TraderTypeCards traderTypes={traderTypes} className="mt-6" />
            </PublicHeroFrame>
        </PublicLayout>
    );
}
