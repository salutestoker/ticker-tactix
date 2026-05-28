import type {
    TraderFitQuestion,
    TraderFitQuizConfig,
    TraderFitResultDefinition,
    TraderFitResultId,
    TraderFitScoreBand,
} from './types';

export const TRADER_FIT_RESULT_INTRO_HEADLINE =
    'Your Trading Profile: {{RESULT_TITLE}}';

export const TRADER_FIT_RESULT_INTRO_SUBTEXT =
    'Based on your experience, capital, and trading behavior, this path gives you the cleanest next step inside the Ticker-Tactix system.';

export const TRADER_FIT_DISCLAIMER_POINTS = [
    'Signal chasing',
    'Hype trading',
    'Get-rich-quick strategies',
] as const;

export const TRADER_FIT_SERIOUS_POINTS = [
    'Consistency',
    'Discipline',
    'Repeatable decision-making',
] as const;

export const TRADER_FIT_QUESTION_IDS = {
    accountSize: 'account_size',
    biggestChallenge: 'biggest_challenge',
    consistency: 'profit_consistency',
    decisionProcess: 'decision_process',
    educationInvestment: 'education_investment',
    markets: 'traded_markets',
    rulesAlignment: 'rules_alignment',
    timeCommitment: 'time_commitment',
    traderType: 'trader_type',
    tradingDuration: 'trading_duration',
    tradingGoal: 'trading_goal',
} as const;

export const TRADER_FIT_ANSWERS = {
    accountSize: {
        highCapital: 'account_25k_100k',
        midCapital: 'account_5k_25k',
    },
    consistency: {
        consistentlyProfitable: 'consistency_consistent',
        inconsistent: 'consistency_some_months',
    },
    decisionProcess: {
        guessing: 'decision_guessing',
        someStructure: 'decision_some_structure',
        strictSystem: 'decision_strict',
    },
    rulesAlignment: {
        absoluteYes: 'rules_absolute',
        noFlexibility: 'rules_no_flex',
        yesIfWorks: 'rules_yes_if_works',
    },
    timeCommitment: {
        highTime: 'time_4_plus',
    },
    tradingDuration: {
        experienced: 'duration_3_plus',
        mid: 'duration_1_3_years',
    },
} as const;

export const TRADER_FIT_QUESTIONS: TraderFitQuestion[] = [
    {
        id: TRADER_FIT_QUESTION_IDS.traderType,
        group: 'Trader Type',
        iconKey: 'spark',
        prompt: 'What kind of trader are you?',
        type: 'single_select',
        answers: [
            {
                id: 'type_brand_new',
                label: 'Brand new, just getting started',
                score: 0,
            },
            {
                id: 'type_learning',
                label: 'Learning, but not consistent yet',
                score: 1,
            },
            {
                id: 'type_active_weekly',
                label: 'Active trader, in and out of markets weekly',
                score: 2,
            },
            {
                id: 'type_experienced',
                label: 'Experienced and disciplined trader',
                score: 3,
            },
            {
                id: 'type_full_time',
                label: 'Full-time or near full-time trader',
                score: 4,
            },
        ],
    },
    {
        id: TRADER_FIT_QUESTION_IDS.tradingDuration,
        group: 'Experience',
        iconKey: 'chart',
        prompt: 'How long have you been trading?',
        type: 'single_select',
        answers: [
            { id: 'duration_0_3_months', label: '0-3 months', score: 0 },
            { id: 'duration_3_12_months', label: '3-12 months', score: 1 },
            { id: 'duration_1_3_years', label: '1-3 years', score: 3 },
            { id: 'duration_3_plus', label: '3+ years', score: 4 },
        ],
    },
    {
        id: TRADER_FIT_QUESTION_IDS.markets,
        group: 'Market',
        iconKey: 'chart',
        prompt: 'Which markets do you trade?',
        type: 'multi_select',
        scoringMode: 'highest_selected',
        answers: [
            { id: 'market_crypto', label: 'Crypto', score: 2 },
            { id: 'market_stocks_etf', label: 'Stocks / ETFs', score: 2 },
            { id: 'market_options', label: 'Options', score: 3 },
            { id: 'market_multiple', label: 'Multiple markets', score: 4 },
        ],
    },
    {
        id: TRADER_FIT_QUESTION_IDS.consistency,
        group: 'Experience',
        iconKey: 'chart',
        prompt: 'How would you describe your consistency?',
        type: 'single_select',
        answers: [
            {
                id: 'consistency_not_profitable',
                label: 'Not profitable yet',
                score: 0,
            },
            { id: 'consistency_break_even', label: 'Break-even', score: 1 },
            {
                id: 'consistency_some_months',
                label: 'Some profitable months',
                score: 3,
            },
            {
                id: 'consistency_consistent',
                label: 'Consistently profitable',
                score: 4,
            },
        ],
    },
    {
        id: TRADER_FIT_QUESTION_IDS.accountSize,
        group: 'Capital',
        iconKey: 'currency',
        prompt: 'What is your current trading account size?',
        type: 'single_select',
        answers: [
            { id: 'account_under_1k', label: 'Under $1,000', score: 0 },
            { id: 'account_1k_5k', label: '$1,000 - $5,000', score: 1 },
            { id: 'account_5k_25k', label: '$5,000 - $25,000', score: 2 },
            { id: 'account_25k_100k', label: '$25,000 - $100,000', score: 3 },
            { id: 'account_100k_plus', label: '$100,000+', score: 4 },
        ],
    },
    {
        id: TRADER_FIT_QUESTION_IDS.timeCommitment,
        group: 'Commitment',
        iconKey: 'clock',
        prompt: 'How much time can you realistically dedicate to trading?',
        type: 'single_select',
        answers: [
            { id: 'time_under_1', label: 'Less than 1 hour/day', score: 0 },
            { id: 'time_1_2', label: '1-2 hours/day', score: 1 },
            { id: 'time_2_4', label: '2-4 hours/day', score: 3 },
            { id: 'time_4_plus', label: '4+ hours/day', score: 4 },
        ],
    },
    {
        id: TRADER_FIT_QUESTION_IDS.tradingGoal,
        group: 'Commitment',
        iconKey: 'rocket',
        prompt: 'What best describes your current goal?',
        type: 'single_select',
        answers: [
            { id: 'goal_learn_basics', label: 'Learn the basics', score: 0 },
            {
                id: 'goal_build_consistency',
                label: 'Build consistency',
                score: 2,
            },
            { id: 'goal_scale_account', label: 'Scale my account', score: 3 },
            {
                id: 'goal_maximize_income',
                label: 'Maximize income / go full-time',
                score: 4,
            },
        ],
    },
    {
        id: TRADER_FIT_QUESTION_IDS.decisionProcess,
        group: 'Behavior',
        iconKey: 'beaker',
        prompt: 'How do you currently make trading decisions?',
        type: 'single_select',
        answers: [
            {
                id: 'decision_guessing',
                label: 'Guessing / gut feeling',
                score: 0,
            },
            {
                id: 'decision_social_media',
                label: 'Social media / alerts',
                score: 1,
            },
            {
                id: 'decision_some_structure',
                label: 'Some structure, but inconsistent',
                score: 2,
            },
            {
                id: 'decision_strict',
                label: 'Strict system / rules-based',
                score: 4,
            },
        ],
    },
    {
        id: TRADER_FIT_QUESTION_IDS.biggestChallenge,
        group: 'Behavior',
        iconKey: 'beaker',
        prompt: "What's your biggest challenge right now?",
        type: 'single_select',
        answers: [
            {
                id: 'challenge_not_knowing',
                label: 'Not knowing what to do',
                score: 0,
            },
            {
                id: 'challenge_overtrading',
                label: 'Overtrading / emotional decisions',
                score: 1,
            },
            {
                id: 'challenge_inconsistent',
                label: 'Inconsistent results',
                score: 2,
            },
            { id: 'challenge_scaling', label: 'Scaling profits', score: 3 },
        ],
    },
    {
        id: TRADER_FIT_QUESTION_IDS.rulesAlignment,
        group: 'Alignment',
        iconKey: 'shield',
        prompt: 'Are you willing to follow a structured system and rules?',
        type: 'single_select',
        answers: [
            {
                id: 'rules_no_flex',
                label: 'No, I prefer flexibility',
                score: 0,
            },
            { id: 'rules_somewhat', label: 'Somewhat', score: 1 },
            { id: 'rules_yes_if_works', label: 'Yes, if it works', score: 3 },
            { id: 'rules_absolute', label: 'Absolutely', score: 4 },
        ],
    },
    {
        id: TRADER_FIT_QUESTION_IDS.educationInvestment,
        group: 'Alignment',
        iconKey: 'cubes',
        prompt: 'Are you currently investing in your trading education/tools?',
        type: 'single_select',
        answers: [
            { id: 'invest_no', label: 'No', score: 0 },
            { id: 'invest_occasionally', label: 'Occasionally', score: 2 },
            { id: 'invest_consistently', label: 'Yes, consistently', score: 4 },
        ],
    },
];

export const TRADER_FIT_SCORE_BANDS: TraderFitScoreBand[] = [
    { min: 0, max: 13, resultId: 'foundation_path' },
    { min: 14, max: 24, resultId: 'structure_path' },
    { min: 25, max: 34, resultId: 'deployment_path' },
    { min: 35, max: 44, resultId: 'precision_path' },
];

export const TRADER_FIT_RESULTS: Record<
    TraderFitResultId,
    TraderFitResultDefinition
> = {
    foundation_path: {
        id: 'foundation_path',
        title: 'Foundation Path',
        resultTitle: 'Foundation Path',
        eyebrow: 'START WITH STRUCTURE',
        headline: "You're building the base layer",
        body: [
            'Your current edge is not more speed. It is a cleaner process.',
            'Start by understanding trader types, markets, and the core modules that organize decision-making.',
        ],
        whatToDoNext: [
            'Review the trader type framework',
            'Study how modules organize market context',
            'Focus on risk, repetition, and emotional control',
        ],
        whatToAvoid: [
            'Jumping into advanced playbooks too early',
            'Following signals without a decision framework',
            'Changing strategies after every losing trade',
        ],
        nextStep:
            'Identify the trader path that matches your current market and pace.',
        ctas: [
            { label: 'Review Trader Types', href: '/trader-types' },
            { label: 'Explore the System', href: '/system', variant: 'secondary' },
        ],
    },
    structure_path: {
        id: 'structure_path',
        title: 'Structure Path',
        resultTitle: 'Structure Path',
        eyebrow: 'MODULE READY',
        headline: "You're ready to organize your market decisions",
        body: [
            'You have enough exposure to trading to benefit from structured market context.',
            'Modules can help you separate useful confirmation from noisy movement before execution is considered.',
        ],
        whatToDoNext: [
            'Use modules to define market context',
            'Match modules to your market and trader type',
            'Build repeatable checks before acting',
        ],
        whyThisMatters:
            'At this stage, consistency improves when the decision process is constrained before the trade is placed.',
        nextStep: 'Start with modules before moving into deployment playbooks.',
        ctas: [
            { label: 'Explore Modules', href: '/modules' },
            { label: 'Review Playbooks', href: '/playbooks', variant: 'secondary' },
        ],
    },
    deployment_path: {
        id: 'deployment_path',
        title: 'Deployment Path',
        resultTitle: 'Deployment Path',
        eyebrow: 'PLAYBOOK READY',
        headline: "You're ready to translate structure into execution",
        body: [
            'You are past random exploration and need an execution framework that fits your market, hold time, and access level.',
            'Playbooks turn module output into a more repeatable deployment process.',
        ],
        whatToDoNext: [
            'Choose a playbook by market',
            'Match your hold time and execution style',
            'Use modules as confirmation before acting',
        ],
        whyThisMatters:
            'At your level, the bottleneck is often deployment discipline, not information.',
        nextStep: 'Review the playbook matrix and choose the closest fit.',
        ctas: [
            { label: 'Explore Playbooks', href: '/playbooks' },
            { label: 'Explore Modules', href: '/modules', variant: 'secondary' },
        ],
    },
    precision_path: {
        id: 'precision_path',
        title: 'Precision Path',
        resultTitle: 'Precision Path',
        eyebrow: 'ADVANCED EXECUTION',
        headline: "You're ready for precision and execution discipline",
        body: [
            'You are operating at a level where structured tools can directly affect execution quality.',
            'The goal is not more inputs. The goal is cleaner timing, tighter context, and a repeatable deployment path.',
        ],
        whatToDoNext: [
            'Use modules for regime, trend, volatility, and participation checks',
            'Pair those signals with the playbook that fits your market',
            'Keep execution tied to rules, not impulse',
        ],
        whyThisMatters:
            'At this stage, precision matters more than novelty. The right framework reduces hesitation and emotional override.',
        nextStep: 'Move from understanding the system to deploying it.',
        ctas: [
            { label: 'Explore Playbooks', href: '/playbooks' },
            { label: 'Explore Modules', href: '/modules', variant: 'secondary' },
        ],
    },
};

export const TRADER_FIT_MAX_SCORE = TRADER_FIT_QUESTIONS.reduce(
    (total, question) =>
        total + Math.max(...question.answers.map((answer) => answer.score)),
    0,
);

export const TRADER_FIT_QUIZ_CONFIG: TraderFitQuizConfig = {
    questions: TRADER_FIT_QUESTIONS,
    scoreBands: TRADER_FIT_SCORE_BANDS,
    results: TRADER_FIT_RESULTS,
    maxScore: TRADER_FIT_MAX_SCORE,
};
