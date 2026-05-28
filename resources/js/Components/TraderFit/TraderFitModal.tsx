import { IconRenderer } from '@/Components/Icons/IconRenderer';
import { HudButton } from '@/Components/UI/Hud';
import type { PageProps, TraderType } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { TraderFitModalLaunchOptions } from './TraderFitProvider';
import {
    TRADER_FIT_DISCLAIMER_POINTS,
    TRADER_FIT_QUESTIONS,
    TRADER_FIT_QUIZ_CONFIG,
    TRADER_FIT_RESULT_INTRO_HEADLINE,
    TRADER_FIT_RESULT_INTRO_SUBTEXT,
    TRADER_FIT_SERIOUS_POINTS,
} from './traderFitQuizConfig';
import {
    calculateTraderFitResult,
    toSelectedAnswerIds,
} from './traderFitScoring';
import {
    clearPersistedTraderFitState,
    persistTraderFitState,
    readPersistedTraderFitState,
    type PersistedTraderFitState,
} from './traderFitStorage';
import type {
    TraderFitAnswers,
    TraderFitCalculatedResult,
    TraderFitQuestion,
    TraderFitResultCta,
    TraderFitResultDefinition,
} from './types';

type TraderFitModalProps = {
    isOpen: boolean;
    launchOptions: TraderFitModalLaunchOptions | null;
    onClose: () => void;
    onStateChange: () => void;
};

const iconMap = {
    spark: 'pulse',
    chart: 'market-data-bars',
    clock: 'trend-tracer',
    shield: 'lock',
    currency: 'liquidity-scanner',
    rocket: 'direction-target',
    beaker: 'backtest-validator',
    cubes: 'command-cube',
} as const;

export default function TraderFitModal({
    isOpen,
    launchOptions,
    onClose,
    onStateChange,
}: TraderFitModalProps) {
    const { traderFitTraderTypes = [] } = usePage<PageProps>().props;
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<TraderFitAnswers>({});
    const [result, setResult] = useState<TraderFitCalculatedResult | null>(
        null,
    );
    const dialogRef = useRef<HTMLDivElement | null>(null);
    const hydratedRef = useRef(false);
    const wasOpenRef = useRef(false);

    const currentQuestion = TRADER_FIT_QUESTIONS[currentQuestionIndex];
    const totalQuestions = TRADER_FIT_QUESTIONS.length;

    const selectedAnswerIds = useMemo(
        () => toSelectedAnswerIds(answers[currentQuestion.id]),
        [answers, currentQuestion.id],
    );

    const progressPercent = useMemo(
        () => ((currentQuestionIndex + 1) / totalQuestions) * 100,
        [currentQuestionIndex, totalQuestions],
    );

    const applyFlowState = useCallback(
        ({
            answers: nextAnswers,
            completed,
            currentQuestionIndex: requestedStartIndex,
        }: PersistedTraderFitState) => {
            const boundedStartIndex = Math.max(
                0,
                Math.min(requestedStartIndex, totalQuestions - 1),
            );

            setAnswers(nextAnswers);
            setCurrentQuestionIndex(boundedStartIndex);
            setResult(
                completed
                    ? calculateTraderFitResult(
                          nextAnswers,
                          TRADER_FIT_QUIZ_CONFIG,
                      )
                    : null,
            );
        },
        [totalQuestions],
    );

    const resetFlow = useCallback(
        (nextLaunchOptions?: TraderFitModalLaunchOptions | null) => {
            const nextAnswers = nextLaunchOptions?.initialAnswers ?? {};
            const requestedStartIndex =
                nextLaunchOptions?.startQuestionIndex ?? 0;

            applyFlowState({
                answers: nextAnswers,
                completed: false,
                currentQuestionIndex: requestedStartIndex,
            });
        },
        [applyFlowState],
    );

    useEffect(() => {
        if (isOpen && !wasOpenRef.current) {
            hydratedRef.current = false;
            const nextState = launchOptions
                ? {
                      answers: launchOptions.initialAnswers ?? {},
                      completed: false,
                      currentQuestionIndex:
                          launchOptions.startQuestionIndex ?? 0,
                  }
                : (readPersistedTraderFitState() ?? {
                      answers: {},
                      completed: false,
                      currentQuestionIndex: 0,
                  });

            if (launchOptions) {
                resetFlow(launchOptions);
            } else {
                applyFlowState(nextState);
            }

            window.setTimeout(() => {
                hydratedRef.current = true;

                if (launchOptions) {
                    persistTraderFitState(nextState);
                    onStateChange();
                }
            }, 0);
        }

        wasOpenRef.current = isOpen;
    }, [applyFlowState, isOpen, launchOptions, onStateChange, resetFlow]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        if (!hydratedRef.current) {
            return;
        }

        persistTraderFitState({
            answers,
            completed: Boolean(result),
            currentQuestionIndex,
        });
        onStateChange();
    }, [answers, currentQuestionIndex, isOpen, onStateChange, result]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const animationFrame = requestAnimationFrame(() => {
            dialogRef.current?.focus();
        });

        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const originalOverflow = document.body.style.overflow;
        const originalPaddingRight = document.body.style.paddingRight;
        const scrollbarWidth =
            window.innerWidth - document.documentElement.clientWidth;

        document.body.style.overflow = 'hidden';

        if (scrollbarWidth > 0) {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        }

        return () => {
            document.body.style.overflow = originalOverflow;
            document.body.style.paddingRight = originalPaddingRight;
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
            }
        };

        window.addEventListener('keydown', handleEscape);

        return () => {
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    const handleSelectAnswer = useCallback(
        (answerId: string) => {
            setAnswers((previousAnswers) => {
                const currentValue = previousAnswers[currentQuestion.id];

                if (currentQuestion.type === 'multi_select') {
                    const selectedIds = new Set(
                        toSelectedAnswerIds(currentValue),
                    );

                    if (selectedIds.has(answerId)) {
                        selectedIds.delete(answerId);
                    } else {
                        selectedIds.add(answerId);
                    }

                    return {
                        ...previousAnswers,
                        [currentQuestion.id]: Array.from(selectedIds),
                    };
                }

                return {
                    ...previousAnswers,
                    [currentQuestion.id]: answerId,
                };
            });
        },
        [currentQuestion.id, currentQuestion.type],
    );

    const canContinue = selectedAnswerIds.length > 0;
    const isFirstQuestion = currentQuestionIndex === 0;
    const nextButtonLabel =
        currentQuestionIndex === totalQuestions - 1
            ? 'See My Result'
            : 'Next Question';

    const handleNext = useCallback(() => {
        if (!canContinue) {
            return;
        }

        if (currentQuestionIndex === totalQuestions - 1) {
            setResult(
                calculateTraderFitResult(answers, TRADER_FIT_QUIZ_CONFIG),
            );
            return;
        }

        setCurrentQuestionIndex((index) => index + 1);
    }, [answers, canContinue, currentQuestionIndex, totalQuestions]);

    const handleBack = useCallback(() => {
        if (result) {
            setResult(null);
            return;
        }

        setCurrentQuestionIndex((index) => Math.max(0, index - 1));
    }, [result]);

    const handleRestart = useCallback(() => {
        clearPersistedTraderFitState();
        onStateChange();
        hydratedRef.current = false;
        resetFlow(null);

        window.setTimeout(() => {
            hydratedRef.current = true;
        }, 0);
    }, [onStateChange, resetFlow]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[120] bg-black/86 backdrop-blur-[5px]">
            <div className="flex h-full w-full items-center justify-center">
                <div
                    aria-labelledby="trader-fit-modal-title"
                    aria-modal="true"
                    className="border-main-blue/35 bg-panel-deep relative flex h-full w-full flex-col overflow-hidden border shadow-[0_52px_140px_-52px_rgba(0,0,0,0.98)] sm:h-[95vh] sm:w-[96vw] sm:rounded-[14px] md:max-w-[1300px]"
                    ref={dialogRef}
                    role="dialog"
                    tabIndex={-1}
                >
                    <h1 className="sr-only" id="trader-fit-modal-title">
                        Trader Fit Questionnaire
                    </h1>
                    <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(90deg,rgba(55,100,245,0.11)_1px,transparent_1px),linear-gradient(0deg,rgba(0,250,146,0.08)_1px,transparent_1px)] [background-size:34px_34px] opacity-25" />
                    <button
                        aria-label="Close trader fit questionnaire"
                        className="border-violet-light/35 bg-panel hover:border-violet-light focus-visible:ring-violet-light focus-visible:ring-offset-midnight-blue absolute top-4 right-4 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full border text-white/75 transition hover:text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                        onClick={onClose}
                        type="button"
                    >
                        <X className="h-5 w-5" aria-hidden />
                    </button>

                    <div className="relative z-10 grid h-full grid-cols-1 md:grid-cols-[minmax(320px,38%)_minmax(0,1fr)]">
                        <aside className="border-main-blue/22 bg-midnight-blue/85 hidden h-full border-r p-8 md:flex md:flex-col">
                            <span className="font-heading text-seafoam-green inline-flex items-center gap-2 text-xs tracking-[0.12em] uppercase">
                                <IconRenderer
                                    name="pulse"
                                    className="h-4 w-4"
                                />
                                Ticker-Tactix
                            </span>
                            <h1 className="font-heading mt-4 text-3xl leading-[1.15] text-white uppercase">
                                Trader Fit Questionnaire
                            </h1>
                            <p className="mt-4 max-w-sm leading-7 text-white/68">
                                Eleven focused questions designed to match your
                                current trading profile to the clearest system
                                path.
                            </p>

                            <div className="border-main-blue/25 bg-panel/75 mt-8 rounded-[12px] border p-5">
                                <p className="font-heading text-xs tracking-[0.08em] text-white/70 uppercase">
                                    What this evaluates
                                </p>
                                <ul className="mt-3 space-y-2 text-sm leading-6 text-white/78">
                                    <SidebarPoint label="Experience and execution maturity" />
                                    <SidebarPoint label="Capital and scalability readiness" />
                                    <SidebarPoint label="Rules alignment and discipline" />
                                </ul>
                            </div>

                            <div className="border-seafoam-green/30 bg-seafoam-green/8 text-seafoam-green mt-auto rounded-[12px] border p-4 text-sm leading-6">
                                Structured, rules-based trading beats random
                                execution over time.
                            </div>
                        </aside>

                        <div className="flex h-full flex-col overflow-hidden p-4 pt-16 sm:p-6 sm:pt-16 md:p-8 md:pt-12">
                            {result ? (
                                <TraderFitResult
                                    maxScore={result.maxScore}
                                    onClose={onClose}
                                    onRestart={handleRestart}
                                    overrideReason={result.overrideReason}
                                    result={result.result}
                                    suggestedTraderType={suggestTraderType(
                                        result.resultId,
                                        answers,
                                        traderFitTraderTypes,
                                    )}
                                    totalScore={result.totalScore}
                                />
                            ) : (
                                <>
                                    <TraderFitProgress
                                        currentQuestion={currentQuestion}
                                        currentStep={currentQuestionIndex + 1}
                                        progressPercent={progressPercent}
                                        totalSteps={totalQuestions}
                                    />

                                    <div className="min-h-0 flex-1 overflow-y-auto pt-5 pb-3">
                                        <TraderFitQuestionCard
                                            onSelect={handleSelectAnswer}
                                            question={currentQuestion}
                                            selectedAnswerIds={
                                                selectedAnswerIds
                                            }
                                        />
                                    </div>

                                    <div className="border-main-blue/20 mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4 sm:mt-6 sm:pt-5">
                                        <HudButton
                                            disabled={isFirstQuestion}
                                            onClick={handleBack}
                                            tone="blue"
                                            type="button"
                                        >
                                            Back
                                        </HudButton>

                                        <HudButton
                                            disabled={!canContinue}
                                            onClick={handleNext}
                                            type="button"
                                            variant="solid"
                                        >
                                            {nextButtonLabel}
                                        </HudButton>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SidebarPoint({ label }: { label: string }) {
    return (
        <li className="flex items-start gap-2">
            <IconRenderer
                name="chevron-right"
                className="text-seafoam-green mt-1 h-4 w-4 shrink-0"
            />
            <span>{label}</span>
        </li>
    );
}

function TraderFitProgress({
    currentQuestion,
    currentStep,
    progressPercent,
    totalSteps,
}: {
    currentQuestion: TraderFitQuestion;
    currentStep: number;
    progressPercent: number;
    totalSteps: number;
}) {
    const iconName = currentQuestion.iconKey
        ? iconMap[currentQuestion.iconKey]
        : 'command-cube';

    return (
        <div className="border-main-blue/25 bg-panel/70 rounded-[12px] border p-4 shadow-[0_22px_60px_-34px_rgba(55,100,245,0.72)] backdrop-blur-sm sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="border-violet-light/45 bg-violet-light/10 text-violet-light inline-flex h-9 w-9 items-center justify-center rounded-[10px] border">
                        <IconRenderer name={iconName} className="h-5 w-5" />
                    </span>
                    <div>
                        <p className="font-heading text-violet-light text-sm tracking-[0.08em] uppercase">
                            {currentQuestion.group}
                        </p>
                        <p className="text-xs text-white/55 sm:text-sm">
                            Question {currentStep} of {totalSteps}
                        </p>
                    </div>
                </div>
                <p className="font-heading text-xs tracking-[0.08em] text-white/65 uppercase">
                    {Math.round(progressPercent)}% complete
                </p>
            </div>

            <div className="bg-midnight-blue mt-4 h-2 w-full overflow-hidden rounded-full">
                <div
                    className="from-violet-light via-main-blue to-seafoam-green h-full rounded-full bg-linear-to-r transition-[width] duration-500"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>
        </div>
    );
}

function TraderFitQuestionCard({
    onSelect,
    question,
    selectedAnswerIds,
}: {
    onSelect: (answerId: string) => void;
    question: TraderFitQuestion;
    selectedAnswerIds: string[];
}) {
    const isMultiSelect = question.type === 'multi_select';

    return (
        <div className="border-main-blue/30 bg-panel/90 relative overflow-hidden rounded-[14px] border p-5 shadow-[0_28px_80px_-40px_rgba(55,100,245,0.8)] sm:p-7">
            <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(90deg,rgba(55,100,245,0.13)_1px,transparent_1px),linear-gradient(0deg,rgba(181,67,215,0.12)_1px,transparent_1px)] [background-size:28px_28px] opacity-20" />
            <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="border-violet-light/40 bg-violet-light/10 text-violet-light font-heading inline-flex items-center gap-1 rounded-sm border px-3 py-1 text-[0.67rem] tracking-[0.08em] uppercase">
                        <IconRenderer name="pulse" className="h-3.5 w-3.5" />
                        {question.group}
                    </span>
                    {isMultiSelect ? (
                        <span className="border-seafoam-green/40 bg-seafoam-green/10 text-seafoam-green font-heading inline-flex rounded-sm border px-3 py-1 text-[0.67rem] tracking-[0.08em] uppercase">
                            Select all that apply
                        </span>
                    ) : null}
                </div>

                <h2 className="font-heading mt-4 text-2xl leading-[1.2] text-white uppercase sm:text-3xl">
                    {question.prompt}
                </h2>

                <div className="mt-6 grid gap-3">
                    {question.answers.map((answer) => {
                        const selected = selectedAnswerIds.includes(answer.id);

                        return (
                            <button
                                aria-pressed={selected}
                                className={`group relative flex w-full items-start gap-3 rounded-[10px] border p-4 text-left transition sm:p-[18px] ${
                                    selected
                                        ? 'border-seafoam-green/70 bg-seafoam-green/10 text-white shadow-[0_16px_42px_-28px_rgba(0,250,146,0.95)]'
                                        : 'hover:border-main-blue/45 hover:bg-main-blue/10 border-white/12 bg-white/[0.04] text-white/75'
                                }`}
                                key={answer.id}
                                onClick={() => onSelect(answer.id)}
                                type="button"
                            >
                                <span
                                    className={`mt-0.5 inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border ${
                                        selected
                                            ? 'border-seafoam-green bg-seafoam-green/20 text-seafoam-green'
                                            : 'border-white/25 text-transparent group-hover:text-white/65'
                                    }`}
                                >
                                    {selected ? (
                                        <IconRenderer
                                            name="chevron-right"
                                            className="h-4 w-4"
                                        />
                                    ) : (
                                        <span className="h-2 w-2 rounded-full bg-current" />
                                    )}
                                </span>
                                <span className="text-[0.98rem] leading-[1.5] sm:text-[1.03rem]">
                                    {answer.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function TraderFitResult({
    maxScore,
    onClose,
    onRestart,
    overrideReason,
    result,
    suggestedTraderType,
    totalScore,
}: {
    maxScore: number;
    onClose: () => void;
    onRestart: () => void;
    overrideReason?: string;
    result: TraderFitResultDefinition;
    suggestedTraderType?: TraderType | null;
    totalScore: number;
}) {
    const introHeadline = TRADER_FIT_RESULT_INTRO_HEADLINE.replace(
        '{{RESULT_TITLE}}',
        result.resultTitle,
    );

    return (
        <div className="border-violet-light/35 bg-panel/95 relative overflow-hidden rounded-[14px] border p-5 shadow-[0_35px_110px_-45px_rgba(181,67,215,0.95)] sm:p-8">
            <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(90deg,rgba(55,100,245,0.12)_1px,transparent_1px),linear-gradient(0deg,rgba(0,250,146,0.1)_1px,transparent_1px)] [background-size:28px_28px] opacity-20" />

            <div className="relative z-10 max-h-[70vh] overflow-y-auto pr-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <p className="font-heading text-violet-light text-[0.72rem] tracking-[0.1em] uppercase">
                            {result.eyebrow}
                        </p>
                        <h2 className="font-heading mt-2 text-2xl leading-[1.2] text-white uppercase sm:text-3xl">
                            {introHeadline}
                        </h2>
                        <p className="mt-2 max-w-3xl leading-7 text-white/68">
                            {TRADER_FIT_RESULT_INTRO_SUBTEXT}
                        </p>
                    </div>
                    <span className="border-seafoam-green/35 bg-seafoam-green/10 text-seafoam-green inline-flex items-center gap-2 rounded-sm border px-3 py-1.5 text-[0.72rem]">
                        <IconRenderer name="pulse" className="h-4 w-4" />
                        Score {totalScore}/{maxScore}
                    </span>
                </div>

                <h3 className="font-heading mt-6 text-xl text-white uppercase sm:text-2xl">
                    {result.headline}
                </h3>

                <div className="mt-4 space-y-3 leading-7 text-white/78">
                    {result.body.map((line) => (
                        <p key={line}>{line}</p>
                    ))}
                </div>

                <ResultList
                    title="What to do next"
                    items={result.whatToDoNext}
                />
                <ResultList title="What to avoid" items={result.whatToAvoid} />

                {result.whyThisMatters ? (
                    <div className="border-main-blue/25 bg-midnight-blue/55 mt-6 rounded-[12px] border p-4">
                        <p className="font-heading text-xs tracking-[0.08em] text-white/60 uppercase">
                            Why this matters
                        </p>
                        <p className="mt-2 leading-7 text-white/75">
                            {result.whyThisMatters}
                        </p>
                    </div>
                ) : null}

                <div className="border-violet-light/32 bg-violet-light/10 mt-6 rounded-[12px] border p-4">
                    <p className="font-heading text-xs tracking-[0.08em] text-white/60 uppercase">
                        Next step
                    </p>
                    <p className="mt-2 leading-7 text-white/82">
                        {result.nextStep}
                    </p>
                </div>

                {overrideReason ? (
                    <p className="mt-4 text-sm text-white/45">
                        {overrideReason}
                    </p>
                ) : null}

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {result.ctas.map((cta) => (
                        <ResultCta cta={cta} key={cta.label} />
                    ))}
                </div>

                {suggestedTraderType ? (
                    <SuggestedTraderTypeCard traderType={suggestedTraderType} />
                ) : null}

                <div className="border-main-blue/20 bg-midnight-blue/45 mt-7 rounded-[12px] border p-4 text-sm leading-6 text-white/68">
                    <p className="font-heading text-xs tracking-[0.08em] text-white/60 uppercase">
                        Disclaimer
                    </p>
                    <p className="mt-3">
                        Ticker-Tactix is designed for structured, rules-based
                        traders.
                    </p>
                    <p className="mt-3 text-white/55">This is not:</p>
                    <ul className="mt-2 space-y-1">
                        {TRADER_FIT_DISCLAIMER_POINTS.map((item) => (
                            <li key={item}>- {item}</li>
                        ))}
                    </ul>
                    <p className="mt-3 text-white/55">
                        This is for traders who are serious about:
                    </p>
                    <ul className="mt-2 space-y-1">
                        {TRADER_FIT_SERIOUS_POINTS.map((item) => (
                            <li key={item}>- {item}</li>
                        ))}
                    </ul>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                    <HudButton onClick={onRestart} tone="blue" type="button">
                        Start Over
                    </HudButton>
                    <HudButton onClick={onClose} tone="violet" type="button">
                        Close
                    </HudButton>
                </div>
            </div>
        </div>
    );
}

function SuggestedTraderTypeCard({
    traderType,
}: {
    traderType: TraderType;
}) {
    return (
        <Link
            className="group mt-7 block"
            href={route('trader-types.show', traderType.slug)}
        >
            <div className="border-seafoam-green/35 bg-seafoam-green/8 hover:border-seafoam-green/70 rounded-[12px] border p-4 transition hover:shadow-[0_0_32px_rgba(0,250,146,0.14)]">
                <p className="font-heading text-seafoam-green text-xs tracking-[0.14em] uppercase">
                    Suggested Trader Type
                </p>
                <div className="mt-4 flex items-start gap-4">
                    <span className="border-seafoam-green/45 bg-midnight-blue text-seafoam-green flex h-12 w-12 shrink-0 items-center justify-center rounded-full border">
                        <IconRenderer
                            name={traderType.icon}
                            className="h-7 w-7"
                        />
                    </span>
                    <div>
                        <h3 className="font-heading text-lg tracking-[0.08em] text-white uppercase">
                            {traderType.name}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-white/68">
                            {traderType.description ||
                                'Review this trader path to compare the modules and playbooks that fit your quiz result.'}
                        </p>
                        <span className="font-heading text-seafoam-green mt-3 inline-flex items-center gap-1 text-xs tracking-[0.14em] uppercase">
                            View Trader Type
                            <IconRenderer
                                name="chevron-right"
                                className="h-4 w-4 transition group-hover:translate-x-1"
                            />
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

function ResultList({ items, title }: { items?: string[]; title: string }) {
    if (!items?.length) {
        return null;
    }

    return (
        <div className="mt-6">
            <p className="font-heading text-xs tracking-[0.08em] text-white/60 uppercase">
                {title}
            </p>
            <ul className="mt-3 space-y-2 text-white/75">
                {items.map((item) => (
                    <li className="flex items-start gap-2" key={item}>
                        <IconRenderer
                            name="chevron-right"
                            className="text-seafoam-green mt-0.5 h-4 w-4 shrink-0"
                        />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ResultCta({ cta }: { cta: TraderFitResultCta }) {
    const classes =
        cta.variant === 'secondary'
            ? 'border-violet-light/55 bg-violet-light/10 text-violet-light shadow-[0_0_24px_rgba(181,67,215,0.18)]'
            : 'border-seafoam-green bg-seafoam-green text-midnight-blue shadow-[0_0_28px_rgba(0,250,146,0.32)]';

    return (
        <Link
            className={`font-heading focus-visible:ring-seafoam-green focus-visible:ring-offset-midnight-blue inline-flex min-h-11 items-center justify-center rounded-sm border px-5 py-3 text-xs font-semibold tracking-[0.14em] uppercase transition hover:brightness-125 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${classes}`}
            href={cta.href}
        >
            {cta.label}
        </Link>
    );
}

function suggestTraderType(
    resultId: TraderFitCalculatedResult['resultId'],
    answers: TraderFitAnswers,
    traderTypes: TraderType[],
) {
    if (!traderTypes.length) {
        return null;
    }

    const market = preferredMarket(answers);
    const level =
        resultId === 'precision_path'
            ? 'PRO'
            : resultId === 'deployment_path' || resultId === 'structure_path'
              ? 'CORE'
              : 'BASE';

    return (
        traderTypes.find((traderType) =>
            traderType.name.toUpperCase().includes(`${market} ${level}`),
        ) ??
        traderTypes.find((traderType) =>
            traderType.name.toUpperCase().includes(level),
        ) ??
        traderTypes[0]
    );
}

function preferredMarket(answers: TraderFitAnswers) {
    const selectedMarkets = toSelectedAnswerIds(answers.traded_markets);

    if (selectedMarkets.includes('market_crypto')) {
        return 'CRYPTO';
    }

    return 'NYSE';
}
