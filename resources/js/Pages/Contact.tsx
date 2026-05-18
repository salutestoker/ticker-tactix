import {
    Eyebrow,
    GradientHeading,
    HudButton,
    HudPanel,
} from '@/Components/UI/Hud';
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
                    <GradientHeading>Open A Channel</GradientHeading>
                    <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/75">
                        Reach out for module access, playbook questions,
                        partnership access, or Discord community support.
                    </p>
                    <HudPanel className="mt-12 p-8">
                        <div className="grid gap-5 sm:grid-cols-3">
                            <HudButton
                                href="https://discord.com"
                                external
                                tone="green"
                            >
                                Discord
                            </HudButton>
                            <HudButton
                                href="mailto:support@tickertactix.test"
                                external
                                tone="blue"
                            >
                                Email
                            </HudButton>
                            <HudButton
                                href={route('playbooks.index')}
                                tone="violet"
                            >
                                Playbooks
                            </HudButton>
                        </div>
                    </HudPanel>
                </div>
            </PublicHeroFrame>
        </PublicLayout>
    );
}
