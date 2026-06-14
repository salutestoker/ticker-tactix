import Checkbox from '@/Components/Checkbox';
import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import {
    AccessBadge,
    EmptyState,
    Eyebrow,
    GradientHeading,
    HudButton,
    HudPanel,
    StatusBadge,
    TaxonomyBadge,
} from '@/Components/UI/Hud';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckCircle2,
    Info,
    LayoutGrid,
    Send,
    Sparkles,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';

const inputClass =
    'mt-2 w-full border-main-blue/35 bg-panel-deep px-4 py-3 text-white outline-none transition focus:border-seafoam-green focus:ring-1 focus:ring-seafoam-green/50';

export default function ComponentIndex() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <AdminLayout>
            <Head title="Component Preview" />

            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="font-heading text-seafoam-green text-xs tracking-[0.22em] uppercase">
                        Utility Surface
                    </p>
                    <h2 className="font-heading mt-2 text-2xl tracking-[0.12em] text-white uppercase">
                        Component Preview
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-white/60">
                        Admin-only reference for shared UI primitives, utility
                        controls, badges, panels, forms, and toast treatments.
                    </p>
                </div>
                <HudButton
                    type="button"
                    tone="blue"
                    onClick={() => setIsModalOpen(true)}
                >
                    <LayoutGrid className="mr-2 h-4 w-4" aria-hidden />
                    Open Modal
                </HudButton>
            </div>

            <div className="grid gap-6">
                <Section
                    eyebrow="Feedback"
                    title="Toast Treatments"
                    description="The live toast is fixed top-center through a document-body portal. These static examples show the current semantic variants."
                >
                    <div className="grid gap-3 lg:grid-cols-2">
                        <ToastSpec
                            tone="success"
                            icon={<CheckCircle2 className="h-4 w-4" />}
                        >
                            Test newsletter email sent to configured recipients.
                        </ToastSpec>
                        <ToastSpec
                            tone="error"
                            icon={<AlertTriangle className="h-4 w-4" />}
                        >
                            Mail delivery failed. Check provider credentials.
                        </ToastSpec>
                        <ToastSpec
                            tone="warning"
                            icon={<AlertTriangle className="h-4 w-4" />}
                        >
                            Queue worker is not running for scheduled delivery.
                        </ToastSpec>
                        <ToastSpec tone="info" icon={<Info className="h-4 w-4" />}>
                            Recipient preview loaded from Stripe.
                        </ToastSpec>
                    </div>
                </Section>

                <Section
                    eyebrow="HUD"
                    title="Buttons And Panels"
                    description="Primary branded admin controls used by catalog and newsletter workflows."
                >
                    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
                        <div className="grid gap-4">
                            <div className="flex flex-wrap gap-3">
                                <HudButton type="button" tone="green">
                                    Green Outline
                                </HudButton>
                                <HudButton type="button" tone="violet">
                                    Violet Outline
                                </HudButton>
                                <HudButton type="button" tone="blue">
                                    Blue Outline
                                </HudButton>
                                <HudButton type="button" tone="gold">
                                    Gold Outline
                                </HudButton>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <HudButton
                                    type="button"
                                    tone="green"
                                    variant="solid"
                                >
                                    Solid Green
                                </HudButton>
                                <HudButton
                                    type="button"
                                    tone="violet"
                                    variant="solid"
                                >
                                    Solid Violet
                                </HudButton>
                                <HudButton type="button" disabled>
                                    Disabled
                                </HudButton>
                                <HudButton
                                    href="https://ticker-tactix.com"
                                    external
                                    tone="blue"
                                >
                                    External Link
                                </HudButton>
                            </div>
                        </div>
                        <HudPanel className="p-5">
                            <h4 className="font-heading text-sm tracking-[0.16em] text-white uppercase">
                                HUD Panel
                            </h4>
                            <p className="mt-3 text-sm leading-6 text-white/60">
                                Dense command-center container with blue border,
                                soft glow, and dark panel background.
                            </p>
                        </HudPanel>
                    </div>
                </Section>

                <Section
                    eyebrow="Typography"
                    title="Headings And Empty States"
                    description="Shared display helpers for branded landing and admin surfaces."
                >
                    <div className="grid gap-5 xl:grid-cols-2">
                        <HudPanel className="p-6 text-center">
                            <Eyebrow>System Online</Eyebrow>
                            <GradientHeading className="mx-auto max-w-xl">
                                Market Command
                            </GradientHeading>
                        </HudPanel>
                        <EmptyState title="No Records Found">
                            Use this state when a filtered admin index or public
                            catalog section has nothing to display.
                        </EmptyState>
                    </div>
                </Section>

                <Section
                    eyebrow="Badges"
                    title="Access, Taxonomy, And Status"
                    description="Small high-density labels used across public catalog cards and admin indexes."
                >
                    <div className="flex flex-wrap gap-3">
                        <AccessBadge access="Daily Newsletter + Discord" />
                        <AccessBadge
                            access="Invite-Only Indicator + Discord"
                            showIcon
                        />
                        <TaxonomyBadge
                            label="Seafoam Trader"
                            color="seafoam-green"
                        />
                        <TaxonomyBadge label="Main Blue" color="main-blue" />
                        <TaxonomyBadge label="Gold" color="gold" />
                        <StatusBadge active published="2026-06-12" />
                        <StatusBadge active />
                        <StatusBadge active={false} />
                    </div>
                </Section>

                <Section
                    eyebrow="Forms"
                    title="Inputs And Legacy Breeze Controls"
                    description="Existing form controls still used in auth/profile flows plus branded admin input treatments."
                >
                    <div className="grid gap-6 xl:grid-cols-2">
                        <HudPanel className="p-5">
                            <div className="grid gap-4">
                                <label className="font-mono-display block text-xs tracking-[0.16em] text-white/80 uppercase">
                                    Admin Text Input
                                    <input
                                        className={`${inputClass} rounded-sm`}
                                        defaultValue="NYSE ETF Environment"
                                    />
                                </label>
                                <label className="font-mono-display block text-xs tracking-[0.16em] text-white/80 uppercase">
                                    Admin Select
                                    <select
                                        className={`${inputClass} rounded-sm`}
                                        defaultValue="scheduled"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="scheduled">
                                            Scheduled
                                        </option>
                                        <option value="sent">Sent</option>
                                    </select>
                                </label>
                                <label className="font-mono-display block text-xs tracking-[0.16em] text-white/80 uppercase">
                                    Admin Textarea
                                    <textarea
                                        className={`${inputClass} min-h-28 rounded-sm`}
                                        defaultValue="Daily market intelligence preview copy."
                                    />
                                </label>
                            </div>
                        </HudPanel>

                        <HudPanel className="p-5">
                            <div className="grid gap-4 rounded-sm bg-white p-5 text-gray-900">
                                <div>
                                    <InputLabel value="Breeze Text Input" />
                                    <TextInput
                                        className="mt-2 w-full"
                                        defaultValue="Legacy auth field"
                                    />
                                    <InputError
                                        className="mt-2"
                                        message="Example validation message."
                                    />
                                </div>
                                <label className="inline-flex items-center gap-2 text-sm">
                                    <Checkbox defaultChecked />
                                    Remember this setting
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    <PrimaryButton type="button">
                                        Primary
                                    </PrimaryButton>
                                    <SecondaryButton type="button">
                                        Secondary
                                    </SecondaryButton>
                                    <DangerButton type="button">
                                        Danger
                                    </DangerButton>
                                </div>
                            </div>
                        </HudPanel>
                    </div>
                </Section>
            </div>

            <Modal
                show={isModalOpen}
                maxWidth="lg"
                onClose={() => setIsModalOpen(false)}
            >
                <div className="bg-panel p-6 text-white">
                    <p className="font-heading text-seafoam-green text-xs tracking-[0.22em] uppercase">
                        Modal Preview
                    </p>
                    <h3 className="font-heading mt-2 text-lg tracking-[0.14em] uppercase">
                        Utility Modal Shell
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-white/65">
                        This is the shared modal component with branded content
                        placed inside its panel.
                    </p>
                    <div className="mt-5 flex justify-end">
                        <HudButton
                            type="button"
                            tone="green"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <Send className="mr-2 h-4 w-4" aria-hidden />
                            Close Preview
                        </HudButton>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}

function Section({
    eyebrow,
    title,
    description,
    children,
}: {
    eyebrow: string;
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <HudPanel className="p-5">
            <div className="border-main-blue/25 border-b pb-4">
                <p className="font-heading text-seafoam-green text-xs tracking-[0.22em] uppercase">
                    {eyebrow}
                </p>
                <h3 className="font-heading mt-2 text-lg tracking-[0.14em] text-white uppercase">
                    {title}
                </h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/55">
                    {description}
                </p>
            </div>
            <div className="mt-5">{children}</div>
        </HudPanel>
    );
}

function ToastSpec({
    tone,
    icon,
    children,
}: {
    tone: 'success' | 'error' | 'warning' | 'info';
    icon: ReactNode;
    children: ReactNode;
}) {
    const className =
        tone === 'error'
            ? 'border-[#ff5a66] bg-[#a91524] text-white'
            : tone === 'warning'
              ? 'border-[#f3bf38] bg-[#b86e00] text-black'
              : tone === 'info'
                ? 'border-main-blue bg-main-blue text-white'
                : 'border-seafoam-green bg-seafoam-green text-black';

    return (
        <div
            className={`inline-flex w-fit max-w-full items-start gap-3 rounded-sm border px-4 py-3 text-sm font-semibold ${className}`}
        >
            <span className="mt-0.5 shrink-0">{icon}</span>
            <span>{children}</span>
        </div>
    );
}
