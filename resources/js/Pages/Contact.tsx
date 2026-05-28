import { Eyebrow, GradientHeading, HudButton } from '@/Components/UI/Hud';
import { PublicHeroFrame } from '@/Components/UI/PublicHero';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';

export default function Contact() {
    return (
        <PublicLayout>
            <Head title="Contact" />
            <PublicHeroFrame>
                <div className="pointer-events-none relative z-0 flex w-[102vw] translate-x-[-2%] -translate-y-[15%] justify-center mix-blend-lighten">
                    <img
                        src="/design/assets/images/bg-testimonials.jpg"
                        className=""
                        alt=""
                    />
                </div>
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
                        href="mailto:tickertactix@gmail.com"
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
