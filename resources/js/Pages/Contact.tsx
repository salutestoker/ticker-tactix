import { Eyebrow, GradientHeading, HudButton } from '@/Components/UI/Hud';
import { PublicHeroFrame } from '@/Components/UI/PublicHero';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';

export default function Contact() {
    return (
        <PublicLayout>
            <Head title="Contact" />
            <PublicHeroFrame>
                <div className="mx-auto max-w-4xl text-center">
                    <Eyebrow>Contact</Eyebrow>
                    <GradientHeading>CONTACT TICKER-TACTIX</GradientHeading>
                    <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/75">
                        For module access, playbook questions, partnership
                        inquiries, or member support, send us a message and
                        we’ll route your inquiry to the appropriate channel.
                    </p>
                    <HudButton
                        className="mt-12 w-[300px] max-w-full p-8"
                        href="mailto:support@tickertactix.test"
                        external
                        tone="blue"
                    >
                        Email
                    </HudButton>
                </div>
            </PublicHeroFrame>
        </PublicLayout>
    );
}
