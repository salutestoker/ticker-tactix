import {
    Eyebrow,
    GradientHeading,
    HudButton,
    HudPanel,
} from '@/Components/UI/Hud';
import { PublicHeroFrame } from '@/Components/UI/PublicHero';
import AdminLayout from '@/Layouts/AdminLayout';
import PublicLayout from '@/Layouts/PublicLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const { auth } = usePage<PageProps>().props;
    const content = (
        <>
            <Head title="Profile" />
            <div className="mx-auto grid max-w-5xl gap-5">
                <HudPanel className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="font-heading text-seafoam-green text-xs tracking-[0.22em] uppercase">
                                Account Console
                            </p>
                            <h1 className="font-heading mt-1 text-2xl tracking-[0.12em] text-white uppercase">
                                Profile
                            </h1>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <HudButton href={route('dashboard')} tone="blue">
                                Dashboard
                            </HudButton>
                            {auth.user?.is_admin ? (
                                <HudButton
                                    href={route('admin.dashboard')}
                                    tone="violet"
                                >
                                    Admin
                                </HudButton>
                            ) : null}
                        </div>
                    </div>
                </HudPanel>
                <HudPanel className="p-6">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />
                </HudPanel>
                <HudPanel className="p-6">
                    <UpdatePasswordForm />
                </HudPanel>
                <HudPanel className="border-violet-light/40 p-6">
                    <DeleteUserForm />
                </HudPanel>
            </div>
        </>
    );

    if (auth.user?.is_admin) {
        return <AdminLayout>{content}</AdminLayout>;
    }

    return (
        <PublicLayout>
            <PublicHeroFrame className="px-4 pt-32 pb-20 sm:px-6">
                <div className="mx-auto max-w-5xl">
                    <Eyebrow>Account Console</Eyebrow>
                    <GradientHeading className="text-center">
                        Profile
                    </GradientHeading>
                    <div className="mt-10">{content}</div>
                </div>
            </PublicHeroFrame>
        </PublicLayout>
    );
}
