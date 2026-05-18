import { Eyebrow, GradientHeading, HudPanel } from '@/Components/UI/Hud';
import { PublicHeroFrame } from '@/Components/UI/PublicHero';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';

export default function LegalShow({ title }: { title: string; slug: string }) {
    return (
        <PublicLayout>
            <Head title={title} />
            <PublicHeroFrame>
                <div className="mx-auto max-w-4xl">
                    <Eyebrow>Legal</Eyebrow>
                    <GradientHeading className="text-center">
                        {title}
                    </GradientHeading>
                    <HudPanel className="mt-12 space-y-5 p-8 leading-7 text-white/70">
                        <p>
                            This page is a placeholder for the final{' '}
                            {title.toLowerCase()} content.
                        </p>
                        <p>
                            Ticker Tactix content is for education and
                            decision-support only. It is not financial advice
                            and does not guarantee trading outcomes.
                        </p>
                        <p>
                            Replace this content before production launch with
                            reviewed legal language appropriate for the
                            business, membership model, and jurisdiction.
                        </p>
                    </HudPanel>
                </div>
            </PublicHeroFrame>
        </PublicLayout>
    );
}
