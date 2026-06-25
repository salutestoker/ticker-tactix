import { EmptyState, Eyebrow, GradientHeading, HudPanel } from '@/Components/UI/Hud';
import { PublicHeroFrame } from '@/Components/UI/PublicHero';
import PublicLayout from '@/Layouts/PublicLayout';
import type { Faq as FaqItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function Faq({ faqs }: { faqs: FaqItem[] }) {
    const [openIds, setOpenIds] = useState<number[]>([]);

    function toggleFaq(id: number) {
        setOpenIds((current) =>
            current.includes(id)
                ? current.filter((openId) => openId !== id)
                : [...current, id],
        );
    }

    return (
        <PublicLayout adminEditHref={route('admin.faqs.index')}>
            <Head title="FAQ">
                <meta
                    name="robots"
                    content="noindex, nofollow, noarchive"
                />
            </Head>
            <PublicHeroFrame className="px-4 pt-32 pb-20 sm:px-6">
                <div className="mx-auto max-w-4xl text-center">
                    <Eyebrow>FAQ</Eyebrow>
                    <GradientHeading>Frequently Asked Questions</GradientHeading>
                    <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/75">
                        Quick answers for Ticker Tactix access, product setup,
                        and membership workflows.
                    </p>
                </div>

                <div className="mx-auto mt-12 grid max-w-4xl gap-4">
                    {faqs.length > 0 ? (
                        faqs.map((faq) => (
                            <FaqAccordion
                                key={faq.id}
                                faq={faq}
                                open={openIds.includes(faq.id)}
                                onToggle={() => toggleFaq(faq.id)}
                            />
                        ))
                    ) : (
                        <EmptyState title="No FAQs Published">
                            FAQs will appear here after they are added in the
                            admin command center.
                        </EmptyState>
                    )}
                </div>
            </PublicHeroFrame>
        </PublicLayout>
    );
}

function FaqAccordion({
    faq,
    open,
    onToggle,
}: {
    faq: FaqItem;
    open: boolean;
    onToggle: () => void;
}) {
    const answerId = `faq-answer-${faq.id}`;

    return (
        <HudPanel className="overflow-hidden">
            <button
                type="button"
                className="focus-visible:ring-seafoam-green focus-visible:ring-offset-midnight-blue flex w-full items-center justify-between gap-5 p-5 text-left transition hover:bg-main-blue/10 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:p-6"
                aria-expanded={open}
                aria-controls={answerId}
                onClick={onToggle}
            >
                <span className="font-heading text-sm leading-6 tracking-[0.12em] text-white uppercase sm:text-base">
                    {faq.question}
                </span>
                <ChevronDown
                    className={[
                        'text-seafoam-green h-5 w-5 shrink-0 transition-transform',
                        open ? 'rotate-180' : '',
                    ].join(' ')}
                    aria-hidden
                />
            </button>
            <div
                id={answerId}
                className={[
                    'border-main-blue/20 border-t px-5 text-left transition',
                    open ? 'block py-5 sm:px-6 sm:py-6' : 'hidden',
                ].join(' ')}
            >
                <p className="whitespace-pre-line text-base leading-8 text-white/72">
                    {faq.answer}
                </p>
            </div>
        </HudPanel>
    );
}
