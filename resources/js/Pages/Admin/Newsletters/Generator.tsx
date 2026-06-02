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
import { Head } from '@inertiajs/react';
import { toPng } from 'html-to-image';
import { Download, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const priceFieldLabels: Record<PriceFieldKey, string> = {
    price: 'Current Price',
    s2: 'S2',
    s1: 'S1',
    b1: 'B1',
    b2: 'B2',
};

export default function NewsletterGenerator() {
    const exportRef = useRef<HTMLDivElement | null>(null);
    const previewViewportRef = useRef<HTMLDivElement | null>(null);
    const [values, setValues] = useState<NyseNewsletterValues>(() =>
        createDefaultNyseNewsletterValues(),
    );
    const [isExporting, setIsExporting] = useState(false);
    const [exportError, setExportError] = useState<string | null>(null);
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
        setValues(createDefaultNyseNewsletterValues());
        setExportError(null);
    }

    async function downloadNewsletterImage() {
        if (!exportRef.current) {
            return;
        }

        setIsExporting(true);
        setExportError(null);

        try {
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

            const link = document.createElement('a');
            link.download = `ticker-tactix-nyse-market-environment-${values.date || 'draft'}.png`;
            link.href = dataUrl;
            link.click();
            link.remove();
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
                        onClick={downloadNewsletterImage}
                    >
                        <Download className="mr-2 h-4 w-4" aria-hidden />
                        {isExporting ? 'Generating' : 'Generate Image'}
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
                                        {Object.keys(priceFieldLabels).map(
                                            (fieldKey) => (
                                                <Field
                                                    key={fieldKey}
                                                    label={
                                                        priceFieldLabels[
                                                            fieldKey as PriceFieldKey
                                                        ]
                                                    }
                                                >
                                                    <input
                                                        className={input}
                                                        value={
                                                            values.cards[
                                                                card.key
                                                            ][
                                                                fieldKey as PriceFieldKey
                                                            ]
                                                        }
                                                        onChange={(event) =>
                                                            updateCardValue(
                                                                card.key,
                                                                fieldKey as PriceFieldKey,
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                    />
                                                </Field>
                                            ),
                                        )}
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
                            </div>
                            <HudButton
                                type="button"
                                disabled={isExporting}
                                onClick={downloadNewsletterImage}
                            >
                                <Download
                                    className="mr-2 h-4 w-4"
                                    aria-hidden
                                />
                                {isExporting ? 'Generating' : 'Generate Image'}
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
        </AdminLayout>
    );
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
