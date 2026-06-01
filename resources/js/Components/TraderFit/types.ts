export type TraderFitQuestionType = 'single_select' | 'multi_select';

export type TraderFitMultiSelectScoringMode = 'sum' | 'highest_selected';

export type TraderFitResultId =
    | 'foundation_path'
    | 'structure_path'
    | 'deployment_path'
    | 'precision_path';

export type TraderFitRecommendedMarket = 'CRYPTO' | 'NYSE';

export type TraderFitRecommendedLevel = 'BASE' | 'CORE' | 'PRO';

export type TraderFitIconKey =
    | 'spark'
    | 'chart'
    | 'clock'
    | 'shield'
    | 'currency'
    | 'rocket'
    | 'beaker'
    | 'cubes';

export type TraderFitAnswerOption = {
    id: string;
    label: string;
    score: number;
};

export type TraderFitQuestion = {
    answers: TraderFitAnswerOption[];
    group: string;
    iconKey?: TraderFitIconKey;
    id: string;
    prompt: string;
    scoringMode?: TraderFitMultiSelectScoringMode;
    type: TraderFitQuestionType;
};

export type TraderFitResultCta = {
    href: string;
    label: string;
    variant?: 'primary' | 'secondary' | 'ghost';
};

export type TraderFitResultDefinition = {
    body: string[];
    ctas: TraderFitResultCta[];
    eyebrow: string;
    headline: string;
    id: TraderFitResultId;
    nextStep: string;
    resultTitle: string;
    title: string;
    whatToAvoid?: string[];
    whatToDoNext?: string[];
    whyThisMatters?: string;
};

export type TraderFitAnswers = Record<string, string | string[] | undefined>;

export type TraderFitScoreBand = {
    max: number;
    min: number;
    resultId: TraderFitResultId;
};

export type TraderFitScoreBreakdownItem = {
    questionId: string;
    score: number;
};

export type TraderFitCalculatedResult = {
    baseResultId: TraderFitResultId;
    breakdown: TraderFitScoreBreakdownItem[];
    maxScore: number;
    overrideReason?: string;
    recommendedTraderTypeLevel: TraderFitRecommendedLevel;
    recommendedTraderTypeMarket: TraderFitRecommendedMarket;
    recommendedTraderTypeName: string;
    result: TraderFitResultDefinition;
    resultId: TraderFitResultId;
    totalScore: number;
};

export type TraderFitQuizConfig = {
    maxScore: number;
    questions: TraderFitQuestion[];
    results: Record<TraderFitResultId, TraderFitResultDefinition>;
    scoreBands: TraderFitScoreBand[];
};
