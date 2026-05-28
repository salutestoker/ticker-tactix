import {
    TRADER_FIT_ANSWERS,
    TRADER_FIT_QUESTION_IDS,
    TRADER_FIT_QUIZ_CONFIG,
} from './traderFitQuizConfig';
import type {
    TraderFitAnswers,
    TraderFitCalculatedResult,
    TraderFitQuestion,
    TraderFitQuizConfig,
    TraderFitResultId,
} from './types';

export function toSelectedAnswerIds(rawAnswer: string | string[] | undefined) {
    if (!rawAnswer) {
        return [];
    }

    if (Array.isArray(rawAnswer)) {
        return rawAnswer;
    }

    return [rawAnswer];
}

function getQuestionScore(
    question: TraderFitQuestion,
    selectedAnswerIds: string[],
): number {
    if (selectedAnswerIds.length === 0) {
        return 0;
    }

    const selectedScores = selectedAnswerIds
        .map((answerId) =>
            question.answers.find((answer) => answer.id === answerId),
        )
        .filter((answer): answer is NonNullable<typeof answer> =>
            Boolean(answer),
        )
        .map((answer) => answer.score);

    if (selectedScores.length === 0) {
        return 0;
    }

    if (
        question.type === 'multi_select' &&
        question.scoringMode === 'highest_selected'
    ) {
        return Math.max(...selectedScores);
    }

    return selectedScores.reduce((total, score) => total + score, 0);
}

function getResultIdFromScore(
    totalScore: number,
    scoreBands: TraderFitQuizConfig['scoreBands'],
): TraderFitResultId {
    const matchingBand = scoreBands.find(
        (band) => totalScore >= band.min && totalScore <= band.max,
    );

    return matchingBand?.resultId ?? 'foundation_path';
}

function hasSelected(
    answers: TraderFitAnswers,
    questionId: string,
    answerId: string,
) {
    return toSelectedAnswerIds(answers[questionId]).includes(answerId);
}

function getScoreForQuestion(
    scoreByQuestionId: Map<string, number>,
    questionId: string,
) {
    return scoreByQuestionId.get(questionId) ?? 0;
}

function resolveOverrideResult(
    answers: TraderFitAnswers,
    totalScore: number,
    scoreByQuestionId: Map<string, number>,
): { reason: string; resultId: TraderFitResultId } | null {
    const highCapital =
        getScoreForQuestion(
            scoreByQuestionId,
            TRADER_FIT_QUESTION_IDS.accountSize,
        ) >= 3;
    const highStructure = hasSelected(
        answers,
        TRADER_FIT_QUESTION_IDS.decisionProcess,
        TRADER_FIT_ANSWERS.decisionProcess.strictSystem,
    );
    const highTime =
        getScoreForQuestion(
            scoreByQuestionId,
            TRADER_FIT_QUESTION_IDS.timeCommitment,
        ) >= 3;
    const highConsistency = hasSelected(
        answers,
        TRADER_FIT_QUESTION_IDS.consistency,
        TRADER_FIT_ANSWERS.consistency.consistentlyProfitable,
    );

    if (
        totalScore >= 36 ||
        (highCapital && highStructure && highTime && highConsistency)
    ) {
        return {
            resultId: 'precision_path',
            reason: 'Override: advanced profile aligned with precision execution.',
        };
    }

    const prefersFlexibility = hasSelected(
        answers,
        TRADER_FIT_QUESTION_IDS.rulesAlignment,
        TRADER_FIT_ANSWERS.rulesAlignment.noFlexibility,
    );

    if (prefersFlexibility && totalScore < 34) {
        return {
            resultId: 'foundation_path',
            reason: 'Override: low rules-alignment favors the foundation path.',
        };
    }

    const midLevelExperience =
        hasSelected(
            answers,
            TRADER_FIT_QUESTION_IDS.tradingDuration,
            TRADER_FIT_ANSWERS.tradingDuration.mid,
        ) ||
        getScoreForQuestion(
            scoreByQuestionId,
            TRADER_FIT_QUESTION_IDS.tradingDuration,
        ) === 1;

    const moderateCapital =
        getScoreForQuestion(
            scoreByQuestionId,
            TRADER_FIT_QUESTION_IDS.accountSize,
        ) >= 2;

    const someStructure = hasSelected(
        answers,
        TRADER_FIT_QUESTION_IDS.decisionProcess,
        TRADER_FIT_ANSWERS.decisionProcess.someStructure,
    );

    const inconsistentSignals =
        hasSelected(
            answers,
            TRADER_FIT_QUESTION_IDS.consistency,
            TRADER_FIT_ANSWERS.consistency.inconsistent,
        ) ||
        hasSelected(
            answers,
            TRADER_FIT_QUESTION_IDS.biggestChallenge,
            'challenge_inconsistent',
        );

    if (
        midLevelExperience &&
        moderateCapital &&
        someStructure &&
        inconsistentSignals
    ) {
        return {
            resultId: 'deployment_path',
            reason: 'Override: transition profile benefits from a deployment framework.',
        };
    }

    const moderateExperience =
        getScoreForQuestion(
            scoreByQuestionId,
            TRADER_FIT_QUESTION_IDS.tradingDuration,
        ) >= 2;
    const systemWillingness =
        getScoreForQuestion(
            scoreByQuestionId,
            TRADER_FIT_QUESTION_IDS.rulesAlignment,
        ) >= 3;

    if (moderateExperience && moderateCapital && systemWillingness) {
        return {
            resultId: 'structure_path',
            reason: 'Override: structure-ready profile favors module alignment.',
        };
    }

    return null;
}

export function calculateTraderFitResult(
    answers: TraderFitAnswers,
    quizConfig: TraderFitQuizConfig = TRADER_FIT_QUIZ_CONFIG,
): TraderFitCalculatedResult {
    const breakdown = quizConfig.questions.map((question) => {
        const selectedAnswerIds = toSelectedAnswerIds(answers[question.id]);

        return {
            questionId: question.id,
            score: getQuestionScore(question, selectedAnswerIds),
        };
    });

    const totalScore = breakdown.reduce((total, item) => total + item.score, 0);
    const scoreByQuestionId = new Map(
        breakdown.map((item) => [item.questionId, item.score]),
    );

    const baseResultId = getResultIdFromScore(
        totalScore,
        quizConfig.scoreBands,
    );
    const override = resolveOverrideResult(
        answers,
        totalScore,
        scoreByQuestionId,
    );
    const resolvedResultId = override?.resultId ?? baseResultId;

    return {
        totalScore,
        baseResultId,
        resultId: resolvedResultId,
        result: quizConfig.results[resolvedResultId],
        maxScore: quizConfig.maxScore,
        breakdown,
        overrideReason: override?.reason,
    };
}
