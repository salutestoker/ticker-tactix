import {
    Eyebrow,
    GradientHeading,
    HudButton,
    HudPanel,
} from '@/Components/UI/Hud';
import { PublicHeroFrame } from '@/Components/UI/PublicHero';
import PublicLayout from '@/Layouts/PublicLayout';
import type { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { auth } = usePage<PageProps>().props;

    return (
        <PublicLayout>
            <Head title="Dashboard" />
            <PublicHeroFrame>
                <div className="mx-auto max-w-4xl text-center">
                    <Eyebrow>Member Console</Eyebrow>
                    <GradientHeading>
                        Welcome, {auth.user?.name}
                    </GradientHeading>
                    <HudPanel className="mt-10 p-8">
                        <p className="text-white/70">
                            Your Ticker Tactix account is active. Playbook
                            entitlements and Discord role sync can be expanded
                            from this dashboard.
                        </p>
                        <div className="mt-8 flex justify-center gap-4">
                            <HudButton href={route('modules.index')}>
                                Modules
                            </HudButton>
                            <HudButton
                                href={route('playbooks.index')}
                                tone="violet"
                            >
                                Playbooks
                            </HudButton>
                            {auth.user?.is_admin ? (
                                <HudButton
                                    href={route('admin.dashboard')}
                                    tone="blue"
                                >
                                    Admin
                                </HudButton>
                            ) : null}
                        </div>
                    </HudPanel>
                </div>
            </PublicHeroFrame>
        </PublicLayout>
    );
}
