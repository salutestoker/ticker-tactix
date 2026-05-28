import { Eyebrow, HudButton, HudPanel } from '@/Components/UI/Hud';
import { useMemo, useState } from 'react';

import { useTraderFitModal } from './TraderFitProvider';
import {
    TRADER_FIT_QUESTION_IDS,
    TRADER_FIT_QUESTIONS,
} from './traderFitQuizConfig';

export default function TraderFitSection({
    className = '',
}: {
    className?: string;
}) {
    const { openTraderFitModal } = useTraderFitModal();
    const [selectedTraderType, setSelectedTraderType] = useState('');

    const traderTypeQuestion = useMemo(
        () =>
            TRADER_FIT_QUESTIONS.find(
                (question) =>
                    question.id === TRADER_FIT_QUESTION_IDS.traderType,
            ),
        [],
    );

    function handleContinue() {
        if (!selectedTraderType) {
            openTraderFitModal();
            return;
        }

        openTraderFitModal({
            initialAnswers: {
                [TRADER_FIT_QUESTION_IDS.traderType]: selectedTraderType,
            },
            startQuestionIndex: 1,
        });
    }

    return (
        <section
            className={`relative mx-auto grid max-w-7xl gap-8 overflow-hidden px-0 py-16 md:grid-cols-[minmax(0,1fr)_minmax(320px,42%)] md:items-center md:py-24 ${className}`}
        >
            <div className="relative z-20 px-0 sm:px-6 md:px-0">
                <Eyebrow>Framework Fit</Eyebrow>
                <h2 className="font-heading max-w-3xl text-center text-4xl leading-none font-semibold uppercase sm:text-5xl md:text-left lg:text-6xl">
                    <span className="text-violet-light">What kind of</span>{' '}
                    <span className="text-seafoam-green block">
                        trader are you?
                    </span>
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-center text-lg leading-8 text-white/75 md:mx-0 md:text-left">
                    Answer a short questionnaire to match your current trading
                    profile with the Ticker-Tactix path that best fits your
                    market, pace, and level of execution structure.
                </p>

                <HudPanel className="mx-auto mt-8 max-w-xl p-5 md:mx-0">
                    <label
                        className="font-heading text-xs tracking-[0.16em] text-white/55 uppercase"
                        htmlFor="trader-fit-select"
                    >
                        Select your trader type
                    </label>
                    <div className="relative mt-3">
                        <select
                            className="border-main-blue/35 bg-midnight-blue focus-visible:ring-seafoam-green focus-visible:ring-offset-midnight-blue h-12 w-full appearance-none rounded-sm border px-4 pr-10 text-sm tracking-[0.06em] text-white uppercase focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                            id="trader-fit-select"
                            onChange={(event) =>
                                setSelectedTraderType(event.target.value)
                            }
                            value={selectedTraderType}
                        >
                            <option value="">Start from the beginning</option>
                            {traderTypeQuestion?.answers.map((answer) => (
                                <option key={answer.id} value={answer.id}>
                                    {answer.label}
                                </option>
                            ))}
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white/55">
                            v
                        </span>
                    </div>

                    <div className="mt-5">
                        <HudButton
                            className="w-full"
                            onClick={handleContinue}
                            type="button"
                            variant="solid"
                        >
                            Continue
                        </HudButton>
                    </div>
                </HudPanel>
            </div>
        </section>
    );
}
