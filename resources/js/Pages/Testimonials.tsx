import { PublicHeroFrame } from '@/Components/UI/PublicHero';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';

const testimonials = [
    "For me I was using it for XLM, and I've already doubled my XLM bag over the past couple months.",
    "I used it and ugh got $2,800, so I'm taking the kids to Disney World.",
    'Any like blockchain, any stock, any commodity and its fool proof easy. In terms of if it turns green, buy it, if it turns red, sell it.',
    'It is a really fool proof indicator. I have a very similar indicator personally that I built myself... and I just wanted to say um that he has it coded pretty perfectly, which manages both risk and also is dummy proof.',
    'Let me tell you, all of us in that one, I think it was like a 12 hour period or a 24 hour period, like one scalp we all made thousands of dollars. It will elevate the trader girl or trader boy in you.',
];

export default function Testimonials() {
    return (
        <PublicLayout>
            <Head title="Testimonials" />
            <PublicHeroFrame className="px-4 pt-32 pb-24 sm:px-6 lg:pt-36 lg:pb-28">
                <div className="relative z-10 w-[102vw] translate-x-[-2%] -translate-y-[18%] mix-blend-lighten">
                    <img
                        src="/design/assets/images/bg-testimonials.png"
                        className=""
                        alt=""
                    />
                </div>
                <div className="mx-auto max-w-7xl">
                    <header className="mx-auto max-w-4xl text-center">
                        <p className="font-mono-display border-seafoam-green/25 bg-seafoam-green/8 text-seafoam-green mx-auto mt-10 inline-flex rounded-sm border px-4 py-2 text-xs tracking-[0.24em] uppercase">
                            What members are saying
                        </p>
                        <h1 className="font-heading brand-gradient-text mt-7 text-4xl leading-none font-semibold tracking-[0.16em] uppercase sm:text-6xl lg:text-7xl">
                            Testimonials
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-white/72">
                            Real member notes from the Ticker-Tactix community.
                        </p>
                    </header>

                    <div className="mx-auto mt-16 grid max-w-3xl gap-7">
                        {testimonials.map((testimonial, index) => (
                            <TestimonialCard
                                key={testimonial}
                                quote={testimonial}
                                index={index}
                            />
                        ))}
                    </div>

                    <div className="mx-auto mt-16 max-w-4xl text-center">
                        <div className="flex items-center justify-center gap-5">
                            <span className="via-main-blue/25 to-seafoam-green/25 h-px flex-1 bg-gradient-to-r from-transparent" />
                            <span className="border-seafoam-green/25 bg-seafoam-green/10 h-2 w-16 rounded-full border" />
                            <span className="via-violet-light/25 to-main-blue/25 h-px flex-1 bg-gradient-to-l from-transparent" />
                        </div>
                        <p className="font-heading mt-6 text-xs tracking-[0.35em] text-white/70 uppercase">
                            Trade with{' '}
                            <span className="text-seafoam-green">
                                structure
                            </span>
                            , not{' '}
                            <span className="text-violet-light">emotion</span>.
                        </p>
                    </div>
                </div>
            </PublicHeroFrame>
        </PublicLayout>
    );
}

function TestimonialCard({ quote, index }: { quote: string; index: number }) {
    const stagger =
        index % 2 === 0
            ? 'md:-ml-8 md:mr-8 lg:-ml-14 lg:mr-14'
            : 'md:ml-8 md:-mr-8 lg:ml-14 lg:-mr-14';
    const accent =
        index % 2 === 0
            ? {
                  border: 'border-seafoam-green/28',
                  rail: 'from-seafoam-green via-seafoam-green/45 to-transparent',
                  quote: 'border-seafoam-green/25 bg-seafoam-green/8 text-seafoam-green',
              }
            : {
                  border: 'border-violet-light/28',
                  rail: 'from-violet-light via-main-blue/45 to-transparent',
                  quote: 'border-violet-light/25 bg-violet-light/8 text-violet-light',
              };

    return (
        <article
            className={`bg-panel/72 relative overflow-hidden rounded-[14px] border px-6 py-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur sm:px-8 sm:py-9 lg:px-10 ${accent.border} ${stagger}`}
        >
            <div
                className={`pointer-events-none absolute top-8 bottom-8 left-0 w-px bg-gradient-to-b ${accent.rail}`}
            />
            <div className="from-seafoam-green/4 to-violet-light/5 pointer-events-none absolute inset-0 bg-gradient-to-r via-transparent" />
            <div className="relative flex flex-col gap-5 sm:flex-row sm:gap-7">
                <span
                    className={`font-heading flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border text-4xl leading-none ${accent.quote}`}
                    aria-hidden="true"
                >
                    &ldquo;
                </span>
                <div className="min-w-0 flex-1">
                    <blockquote className="max-w-5xl text-xl leading-9 font-medium text-white/84 italic sm:text-2xl sm:leading-10">
                        {quote}
                    </blockquote>
                    <div className="mt-6 h-px w-full max-w-3xl bg-gradient-to-r from-white/16 via-white/8 to-transparent" />
                </div>
            </div>
        </article>
    );
}
