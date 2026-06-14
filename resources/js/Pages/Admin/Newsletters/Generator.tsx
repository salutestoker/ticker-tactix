import {
    createDefaultNyseNewsletterValues,
    formatBulletinNumber,
    formatNewsletterDate,
    NYSE_NEWSLETTER_HEIGHT,
    NYSE_NEWSLETTER_WIDTH,
    NyseMarketEnvironmentNewsletter,
    probabilityRows,
    tickerCards,
    type NyseNewsletterValues,
    type PriceFieldKey,
    type ProbabilityKey,
    type TickerCardKey,
} from '@/Components/Admin/NewsletterTemplates/NyseMarketEnvironmentNewsletter';
import { HudButton, HudPanel } from '@/Components/UI/Hud';
import AdminLayout from '@/Layouts/AdminLayout';
import type { FormDataConvertible } from '@inertiajs/core';
import { Head, router } from '@inertiajs/react';
import { toPng } from 'html-to-image';
import { Download, Mail, RotateCcw, Send, Users, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type NewsletterGeneratorProps = {
    defaultValues?: NyseNewsletterValues | null;
    defaultGeneratedAt?: string | null;
    deliveryDefaults: {
        stripeProductId?: string | null;
        subscriptionStatuses?: string[];
        subject?: string | null;
        preheader?: string | null;
    };
};

type GeneratedNewsletterEmail = {
    dataUrl: string;
    fileName: string;
    values: NyseNewsletterValues;
};

type RecipientPreview = {
    count: number;
    skippedNoEmail: number;
    stripeProductId: string;
    subscriptionStatuses: string[];
};

const priceFieldLabels: Record<PriceFieldKey, string> = {
    price: 'Current Price',
    s2: 'S2',
    s1: 'S1',
    b1: 'B1',
    b2: 'B2',
};

const priceFieldKeys = Object.keys(priceFieldLabels) as PriceFieldKey[];

export default function NewsletterGenerator({
    defaultValues = null,
    defaultGeneratedAt = null,
    deliveryDefaults,
}: NewsletterGeneratorProps) {
    const exportRef = useRef<HTMLDivElement | null>(null);
    const previewViewportRef = useRef<HTMLDivElement | null>(null);
    const [savedDefaultValues, setSavedDefaultValues] =
        useState<NyseNewsletterValues>(() =>
            createNewsletterValues(defaultValues),
        );
    const [savedDefaultGeneratedAt, setSavedDefaultGeneratedAt] = useState<
        string | null
    >(defaultGeneratedAt);
    const [values, setValues] = useState<NyseNewsletterValues>(() =>
        createNewsletterValues(defaultValues),
    );
    const [isExporting, setIsExporting] = useState(false);
    const [isScheduling, setIsScheduling] = useState(false);
    const [isSendingTest, setIsSendingTest] = useState(false);
    const [isCountingRecipients, setIsCountingRecipients] = useState(false);
    const [exportError, setExportError] = useState<string | null>(null);
    const [deliveryActionError, setDeliveryActionError] = useState<
        string | null
    >(null);
    const [generatedEmail, setGeneratedEmail] =
        useState<GeneratedNewsletterEmail | null>(null);
    const [deliverySubject, setDeliverySubject] = useState(
        deliveryDefaults.subject ?? 'Ticker Tactix NYSE ETF Environment',
    );
    const [deliveryPreheader, setDeliveryPreheader] = useState(
        deliveryDefaults.preheader ??
            'Daily market intelligence from Ticker Tactix.',
    );
    const [scheduledFor, setScheduledFor] = useState(
        createDefaultScheduledFor(),
    );
    const [recipientPreview, setRecipientPreview] =
        useState<RecipientPreview | null>(null);
    const [previewScale, setPreviewScale] = useState(1);

    useEffect(() => {
        const viewport = previewViewportRef.current;

        if (!viewport) {
            return;
        }

        const viewportElement = viewport;

        function updatePreviewScale() {
            setPreviewScale(
                viewportElement.clientWidth / NYSE_NEWSLETTER_WIDTH,
            );
        }

        updatePreviewScale();

        const resizeObserver = new ResizeObserver(updatePreviewScale);
        resizeObserver.observe(viewportElement);

        return () => resizeObserver.disconnect();
    }, []);

    function updateDate(value: string) {
        setValues((current) => ({
            ...current,
            date: value,
        }));
    }

    function updateCardValue(
        cardKey: TickerCardKey,
        fieldKey: PriceFieldKey,
        value: string,
    ) {
        setValues((current) => ({
            ...current,
            cards: {
                ...current.cards,
                [cardKey]: {
                    ...current.cards[cardKey],
                    [fieldKey]: value,
                },
            },
        }));
    }

    function updateProbability(key: ProbabilityKey, value: string) {
        setValues((current) => ({
            ...current,
            probabilities: {
                ...current.probabilities,
                [key]: value,
            },
        }));
    }

    function updateCommentary(value: string) {
        setValues((current) => ({
            ...current,
            marketCommentary: value,
        }));
    }

    function resetValues() {
        setValues(cloneNewsletterValues(savedDefaultValues));
        setExportError(null);
    }

    function saveNewsletterGeneration(nextValues: NyseNewsletterValues) {
        const payload: Record<string, FormDataConvertible> = {
            values: nextValues as unknown as FormDataConvertible,
        };

        return new Promise<void>((resolve, reject) => {
            router.post(route('admin.newsletter-generator.store'), payload, {
                preserveScroll: true,
                preserveState: true,
                replace: true,
                onSuccess: () => {
                    setSavedDefaultValues(cloneNewsletterValues(nextValues));
                    setSavedDefaultGeneratedAt(new Date().toISOString());
                    resolve();
                },
                onError: (errors) => {
                    const message = Object.values(errors).find(Boolean);

                    reject(
                        new Error(
                            typeof message === 'string'
                                ? message
                                : 'The newsletter values could not be saved.',
                        ),
                    );
                },
                onCancel: () => {
                    reject(new Error('The newsletter save was cancelled.'));
                },
            });
        });
    }

    async function generateSubscriptionEmail() {
        if (!exportRef.current) {
            return;
        }

        setIsExporting(true);
        setExportError(null);
        setDeliveryActionError(null);

        try {
            const generatedValues = cloneNewsletterValues(values);

            await document.fonts?.ready;

            const dataUrl = await toPng(exportRef.current, {
                backgroundColor: '#e4d8c2',
                cacheBust: true,
                canvasHeight: NYSE_NEWSLETTER_HEIGHT,
                canvasWidth: NYSE_NEWSLETTER_WIDTH,
                height: NYSE_NEWSLETTER_HEIGHT,
                pixelRatio: 1,
                width: NYSE_NEWSLETTER_WIDTH,
            });

            setGeneratedEmail({
                dataUrl,
                fileName: createNewsletterImageFileName(generatedValues),
                values: generatedValues,
            });
            setDeliverySubject(
                deliveryDefaults.subject ??
                    'Ticker Tactix NYSE ETF Environment',
            );
            setDeliveryPreheader(
                deliveryDefaults.preheader ??
                    'Daily market intelligence from Ticker Tactix.',
            );
            setScheduledFor(createDefaultScheduledFor());
            setRecipientPreview(null);
        } catch (error) {
            setExportError(
                error instanceof Error
                    ? error.message
                    : 'The newsletter image could not be generated.',
            );
        } finally {
            setIsExporting(false);
        }
    }

    async function saveGeneratedImage() {
        if (!generatedEmail) {
            return;
        }

        setDeliveryActionError(null);

        try {
            await saveNewsletterGeneration(generatedEmail.values);

            const link = document.createElement('a');
            link.download = generatedEmail.fileName;
            link.href = generatedEmail.dataUrl;
            link.click();
            link.remove();

            setGeneratedEmail(null);
        } catch (error) {
            setDeliveryActionError(
                error instanceof Error
                    ? error.message
                    : 'The newsletter image could not be saved.',
            );
        }
    }

    async function scheduleEmailDelivery() {
        if (!generatedEmail) {
            return;
        }

        const scheduledDate = new Date(scheduledFor);

        if (!scheduledFor || Number.isNaN(scheduledDate.getTime())) {
            setDeliveryActionError('Choose a valid delivery date and time.');
            return;
        }

        setIsScheduling(true);
        setDeliveryActionError(null);

        try {
            const image = await dataUrlToFile(
                generatedEmail.dataUrl,
                generatedEmail.fileName,
            );
            const payload = createDeliveryPayload(
                generatedEmail,
                image,
                scheduledDate.toISOString(),
            );

            router.post(
                route('admin.newsletter-generator.deliveries.store'),
                payload,
                {
                    forceFormData: true,
                    preserveScroll: true,
                    preserveState: true,
                    replace: true,
                    onSuccess: () => {
                        setSavedDefaultValues(
                            cloneNewsletterValues(generatedEmail.values),
                        );
                        setSavedDefaultGeneratedAt(new Date().toISOString());
                        setGeneratedEmail(null);
                    },
                    onError: (errors) => {
                        setDeliveryActionError(firstError(errors));
                    },
                    onCancel: () => {
                        setDeliveryActionError(
                            'The email schedule request was cancelled.',
                        );
                    },
                    onFinish: () => {
                        setIsScheduling(false);
                    },
                },
            );
        } catch (error) {
            setDeliveryActionError(
                error instanceof Error
                    ? error.message
                    : 'The email could not be scheduled.',
            );
            setIsScheduling(false);
        }
    }

    async function sendTestEmail() {
        if (!generatedEmail) {
            return;
        }

        setIsSendingTest(true);
        setDeliveryActionError(null);

        try {
            const image = await dataUrlToFile(
                generatedEmail.dataUrl,
                generatedEmail.fileName,
            );
            const payload = createDeliveryPayload(generatedEmail, image);

            router.post(route('admin.newsletter-generator.test-email'), payload, {
                forceFormData: true,
                preserveScroll: true,
                preserveState: true,
                replace: true,
                onError: (errors) => {
                    setDeliveryActionError(firstError(errors));
                },
                onCancel: () => {
                    setDeliveryActionError(
                        'The test email request was cancelled.',
                    );
                },
                onFinish: () => {
                    setIsSendingTest(false);
                },
            });
        } catch (error) {
            setDeliveryActionError(
                error instanceof Error
                    ? error.message
                    : 'The test email could not be sent.',
            );
            setIsSendingTest(false);
        }
    }

    async function previewRecipientCount() {
        setIsCountingRecipients(true);
        setDeliveryActionError(null);

        try {
            const response = await fetch(
                route('admin.newsletter-generator.recipient-count'),
                {
                    headers: {
                        Accept: 'application/json',
                    },
                },
            );

            const payload = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    payload?.message ??
                        'The Stripe recipient count could not be loaded.',
                );
            }

            setRecipientPreview(payload as RecipientPreview);
        } catch (error) {
            setDeliveryActionError(
                error instanceof Error
                    ? error.message
                    : 'The Stripe recipient count could not be loaded.',
            );
        } finally {
            setIsCountingRecipients(false);
        }
    }

    function createDeliveryPayload(
        email: GeneratedNewsletterEmail,
        image: File,
        scheduledForIso?: string,
    ) {
        return {
            values: email.values as unknown as FormDataConvertible,
            image: image as unknown as FormDataConvertible,
            subject: deliverySubject,
            preheader: deliveryPreheader,
            ...(scheduledForIso ? { scheduled_for: scheduledForIso } : {}),
        };
    }

    return (
        <AdminLayout>
            <Head title="Newsletter Generator" />
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="font-heading text-seafoam-green text-xs tracking-[0.22em] uppercase">
                        Daily Newsletter
                    </p>
                    <h2 className="font-heading mt-2 text-2xl tracking-[0.12em] text-white uppercase">
                        Newsletter Generator
                    </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                    <HudButton type="button" tone="blue" onClick={resetValues}>
                        <RotateCcw className="mr-2 h-4 w-4" aria-hidden />
                        Reset Fields
                    </HudButton>
                    <HudButton
                        type="button"
                        disabled={isExporting}
                        onClick={generateSubscriptionEmail}
                    >
                        <Mail className="mr-2 h-4 w-4" aria-hidden />
                        {isExporting
                            ? 'Generating'
                            : 'Generate Subscription Email'}
                    </HudButton>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(420px,500px)_minmax(0,1fr)]">
                <div className="grid gap-6">
                    <HudPanel className="p-5">
                        <div className="border-main-blue/25 border-b pb-4">
                            <h3 className="font-heading text-sm tracking-[0.16em] text-white uppercase">
                                Issue
                            </h3>
                        </div>
                        <div className="mt-5 grid gap-5">
                            <Field label="Date">
                                <input
                                    className={input}
                                    type="date"
                                    value={values.date}
                                    onChange={(event) =>
                                        updateDate(event.target.value)
                                    }
                                />
                            </Field>
                            <Readout
                                label="Formatted Date"
                                value={formatNewsletterDate(values.date)}
                            />
                            <Readout
                                label="Bulletin Number"
                                value={formatBulletinNumber(values.date)}
                            />
                        </div>
                    </HudPanel>

                    <HudPanel className="p-5">
                        <div className="border-main-blue/25 border-b pb-4">
                            <h3 className="font-heading text-sm tracking-[0.16em] text-white uppercase">
                                Market Cards
                            </h3>
                        </div>
                        <div className="mt-5 grid gap-5">
                            {tickerCards.map((card) => (
                                <div
                                    key={card.key}
                                    className="border-main-blue/25 bg-panel-deep/55 rounded-sm border p-4"
                                >
                                    <h4 className="font-heading text-seafoam-green text-xs tracking-[0.18em] uppercase">
                                        {card.symbol}
                                    </h4>
                                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                        {priceFieldKeys.map((fieldKey) => (
                                            <Field
                                                key={fieldKey}
                                                label={
                                                    priceFieldLabels[fieldKey]
                                                }
                                            >
                                                <input
                                                    className={input}
                                                    value={
                                                        values.cards[card.key][
                                                            fieldKey
                                                        ]
                                                    }
                                                    onChange={(event) =>
                                                        updateCardValue(
                                                            card.key,
                                                            fieldKey,
                                                            event.target.value,
                                                        )
                                                    }
                                                />
                                            </Field>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </HudPanel>

                    <HudPanel className="p-5">
                        <div className="border-main-blue/25 border-b pb-4">
                            <h3 className="font-heading text-sm tracking-[0.16em] text-white uppercase">
                                Directional Probability
                            </h3>
                        </div>
                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            {probabilityRows.map((row) => (
                                <Field key={row.key} label={row.symbol}>
                                    <input
                                        className={input}
                                        value={values.probabilities[row.key]}
                                        onChange={(event) =>
                                            updateProbability(
                                                row.key,
                                                event.target.value,
                                            )
                                        }
                                    />
                                </Field>
                            ))}
                        </div>
                    </HudPanel>

                    <HudPanel className="p-5">
                        <div className="border-main-blue/25 border-b pb-4">
                            <h3 className="font-heading text-sm tracking-[0.16em] text-white uppercase">
                                Market Commentary
                            </h3>
                        </div>
                        <div className="mt-5">
                            <Field label="Market Commentary">
                                <textarea
                                    className={textarea}
                                    value={values.marketCommentary}
                                    onChange={(event) =>
                                        updateCommentary(event.target.value)
                                    }
                                />
                            </Field>
                        </div>
                    </HudPanel>

                    <HudPanel className="p-5">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <p className="font-heading text-xs tracking-[0.16em] text-white/50 uppercase">
                                    Output Size
                                </p>
                                <p className="font-mono-display text-seafoam-green mt-1 text-sm">
                                    {NYSE_NEWSLETTER_WIDTH} x{' '}
                                    {NYSE_NEWSLETTER_HEIGHT} PNG
                                </p>
                                <p className="font-mono-display mt-2 text-xs text-white/45">
                                    Reset target:{' '}
                                    {formatGeneratedAt(
                                        savedDefaultGeneratedAt,
                                    )}
                                </p>
                            </div>
                            <HudButton
                                type="button"
                                disabled={isExporting}
                                onClick={generateSubscriptionEmail}
                            >
                                <Mail className="mr-2 h-4 w-4" aria-hidden />
                                {isExporting
                                    ? 'Generating'
                                    : 'Generate Subscription Email'}
                            </HudButton>
                        </div>
                        {exportError ? (
                            <p className="text-violet-light mt-4 text-sm">
                                {exportError}
                            </p>
                        ) : null}
                    </HudPanel>
                </div>

                <HudPanel className="overflow-hidden xl:sticky xl:top-28 xl:max-h-[calc(100vh-8rem)] xl:self-start">
                    <div className="border-main-blue/25 flex flex-wrap items-center justify-between gap-3 border-b p-5">
                        <div>
                            <h3 className="font-heading text-sm tracking-[0.16em] text-white uppercase">
                                Live Preview
                            </h3>
                            <p className="mt-1 text-xs text-white/50">
                                NYSE Market Environment
                            </p>
                        </div>
                        <p className="font-mono-display text-xs text-white/45">
                            {formatBulletinNumber(values.date)}
                        </p>
                    </div>
                    <div className="bg-panel-deep/70 overflow-auto p-4 xl:max-h-[calc(100vh-14.5rem)]">
                        <div ref={previewViewportRef} className="min-w-0">
                            <div
                                style={{
                                    height:
                                        NYSE_NEWSLETTER_HEIGHT * previewScale,
                                    width: '100%',
                                }}
                            >
                                <div
                                    style={{
                                        transform: `scale(${previewScale})`,
                                        transformOrigin: 'top left',
                                        width: NYSE_NEWSLETTER_WIDTH,
                                    }}
                                >
                                    <div ref={exportRef}>
                                        <NyseMarketEnvironmentNewsletter
                                            values={values}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </HudPanel>
            </div>

            {generatedEmail ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
                    <div className="border-main-blue/40 bg-panel-deep max-h-[90vh] w-full max-w-3xl overflow-auto rounded-sm border shadow-[0_0_40px_rgba(44,180,255,0.2)]">
                        <div className="border-main-blue/25 flex items-start justify-between gap-4 border-b p-5">
                            <div>
                                <p className="font-heading text-seafoam-green text-xs tracking-[0.22em] uppercase">
                                    Generated Output
                                </p>
                                <h3 className="font-heading mt-2 text-lg tracking-[0.14em] text-white uppercase">
                                    Subscription Email Ready
                                </h3>
                            </div>
                            <button
                                type="button"
                                className="text-white/55 transition hover:text-white"
                                onClick={() => setGeneratedEmail(null)}
                                aria-label="Close generated email actions"
                            >
                                <X className="h-5 w-5" aria-hidden />
                            </button>
                        </div>

                        <div className="grid gap-5 p-5 lg:grid-cols-[220px_minmax(0,1fr)]">
                            <div className="border-main-blue/25 bg-black/20 rounded-sm border p-3">
                                <img
                                    src={generatedEmail.dataUrl}
                                    alt="Generated newsletter preview"
                                    className="block w-full rounded-sm"
                                />
                                <p className="font-mono-display mt-3 break-all text-xs text-white/45">
                                    {generatedEmail.fileName}
                                </p>
                            </div>

                            <div className="grid gap-5">
                                <HudPanel className="p-5">
                                    <div className="grid gap-4">
                                        <Field label="Email Subject">
                                            <input
                                                className={input}
                                                value={deliverySubject}
                                                onChange={(event) =>
                                                    setDeliverySubject(
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                        </Field>
                                        <Field label="Preheader">
                                            <input
                                                className={input}
                                                value={deliveryPreheader}
                                                onChange={(event) =>
                                                    setDeliveryPreheader(
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                        </Field>
                                        <Field label="Schedule Delivery">
                                            <input
                                                className={input}
                                                type="datetime-local"
                                                value={scheduledFor}
                                                onChange={(event) =>
                                                    setScheduledFor(
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                        </Field>
                                    </div>
                                </HudPanel>

                                <HudPanel className="p-5">
                                    <div className="flex flex-wrap gap-2">
                                        <HudButton
                                            type="button"
                                            tone="blue"
                                            onClick={saveGeneratedImage}
                                        >
                                            <Download
                                                className="mr-2 h-4 w-4"
                                                aria-hidden
                                            />
                                            Save as Image
                                        </HudButton>
                                        <HudButton
                                            type="button"
                                            tone="blue"
                                            disabled={isSendingTest}
                                            onClick={sendTestEmail}
                                        >
                                            <Mail
                                                className="mr-2 h-4 w-4"
                                                aria-hidden
                                            />
                                            {isSendingTest
                                                ? 'Sending Test'
                                                : 'Send Test Email'}
                                        </HudButton>
                                        <HudButton
                                            type="button"
                                            tone="blue"
                                            disabled={isCountingRecipients}
                                            onClick={previewRecipientCount}
                                        >
                                            <Users
                                                className="mr-2 h-4 w-4"
                                                aria-hidden
                                            />
                                            {isCountingRecipients
                                                ? 'Counting'
                                                : 'Preview Recipients'}
                                        </HudButton>
                                        <HudButton
                                            type="button"
                                            disabled={isScheduling}
                                            onClick={scheduleEmailDelivery}
                                        >
                                            <Send
                                                className="mr-2 h-4 w-4"
                                                aria-hidden
                                            />
                                            {isScheduling
                                                ? 'Scheduling'
                                                : 'Schedule Email Delivery'}
                                        </HudButton>
                                    </div>

                                    <div className="mt-4 grid gap-2 text-sm">
                                        <p className="font-mono-display text-white/50">
                                            Stripe product:{' '}
                                            <span className="text-seafoam-green">
                                                {deliveryDefaults.stripeProductId ||
                                                    'not configured'}
                                            </span>
                                        </p>
                                        <p className="font-mono-display text-white/50">
                                            Statuses:{' '}
                                            <span className="text-seafoam-green">
                                                {(
                                                    deliveryDefaults.subscriptionStatuses ??
                                                    []
                                                ).join(', ') || 'none'}
                                            </span>
                                        </p>
                                        {recipientPreview ? (
                                            <p className="font-mono-display text-white/50">
                                                Current Stripe recipients:{' '}
                                                <span className="text-seafoam-green">
                                                    {recipientPreview.count}
                                                </span>
                                                {recipientPreview.skippedNoEmail >
                                                0
                                                    ? ` (${recipientPreview.skippedNoEmail} skipped without email)`
                                                    : ''}
                                            </p>
                                        ) : null}
                                    </div>

                                    {deliveryActionError ? (
                                        <p className="text-violet-light mt-4 text-sm">
                                            {deliveryActionError}
                                        </p>
                                    ) : null}
                                </HudPanel>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </AdminLayout>
    );
}

function createNewsletterValues(
    defaultValues?: NyseNewsletterValues | null,
): NyseNewsletterValues {
    const fallback = createDefaultNyseNewsletterValues();
    const source = defaultValues ?? fallback;

    return {
        date: source.date ?? fallback.date,
        cards: tickerCards.reduce((accumulator, card) => {
            const sourceCard = source.cards?.[card.key];

            accumulator[card.key] = priceFieldKeys.reduce(
                (fieldAccumulator, fieldKey) => ({
                    ...fieldAccumulator,
                    [fieldKey]:
                        sourceCard?.[fieldKey] ??
                        fallback.cards[card.key][fieldKey],
                }),
                {} as Record<PriceFieldKey, string>,
            );

            return accumulator;
        }, {} as NyseNewsletterValues['cards']),
        probabilities: probabilityRows.reduce((accumulator, row) => {
            accumulator[row.key] =
                source.probabilities?.[row.key] ??
                fallback.probabilities[row.key];

            return accumulator;
        }, {} as NyseNewsletterValues['probabilities']),
        marketCommentary:
            source.marketCommentary ?? fallback.marketCommentary,
    };
}

function cloneNewsletterValues(
    values: NyseNewsletterValues,
): NyseNewsletterValues {
    return createNewsletterValues(values);
}

function createNewsletterImageFileName(values: NyseNewsletterValues) {
    return `ticker-tactix-nyse-market-environment-${values.date || 'draft'}.png`;
}

function createDefaultScheduledFor() {
    const date = new Date(Date.now() + 15 * 60 * 1000);
    date.setSeconds(0, 0);

    return formatDateTimeLocalValue(date);
}

function formatDateTimeLocalValue(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

async function dataUrlToFile(dataUrl: string, fileName: string) {
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    return new File([blob], fileName, { type: 'image/png' });
}

function firstError(errors: Record<string, string>) {
    return (
        Object.values(errors).find((message) => message.length > 0) ??
        'The newsletter email request could not be completed.'
    );
}

function formatGeneratedAt(value: string | null) {
    if (!value) {
        return 'factory defaults';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'latest generated image';
    }

    return date.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
}

const input =
    'mt-2 w-full rounded-sm border border-main-blue/35 bg-panel-deep px-4 py-3 text-white outline-none transition focus:border-seafoam-green focus:ring-1 focus:ring-seafoam-green/50';
const textarea = `${input} min-h-72 resize-y leading-6`;

function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <label className="font-mono-display block text-xs tracking-[0.16em] text-white/80 uppercase">
            <span>{label}</span>
            {children}
        </label>
    );
}

function Readout({ label, value }: { label: string; value: string }) {
    return (
        <div className="border-main-blue/25 bg-panel-deep/55 rounded-sm border px-4 py-3">
            <p className="font-mono-display text-xs tracking-[0.16em] text-white/45 uppercase">
                {label}
            </p>
            <p className="font-heading text-seafoam-green mt-2 text-sm tracking-[0.14em] uppercase">
                {value || 'Pending'}
            </p>
        </div>
    );
}
