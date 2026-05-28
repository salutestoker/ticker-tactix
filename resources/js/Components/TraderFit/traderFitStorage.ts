import type { TraderFitAnswers } from './types';

export const traderFitStorageKey = 'ticker-tactix:trader-fit';

export type PersistedTraderFitState = {
    answers: TraderFitAnswers;
    completed: boolean;
    currentQuestionIndex: number;
};

export function readPersistedTraderFitState(): PersistedTraderFitState | null {
    try {
        const rawState = window.localStorage.getItem(traderFitStorageKey);

        if (!rawState) {
            return null;
        }

        const parsed = JSON.parse(rawState) as Partial<PersistedTraderFitState>;

        return {
            answers: parsed.answers ?? {},
            completed: Boolean(parsed.completed),
            currentQuestionIndex: Number.isInteger(parsed.currentQuestionIndex)
                ? parsed.currentQuestionIndex ?? 0
                : 0,
        };
    } catch {
        return null;
    }
}

export function persistTraderFitState(state: PersistedTraderFitState) {
    try {
        window.localStorage.setItem(traderFitStorageKey, JSON.stringify(state));
    } catch {
        // Local storage is best-effort. The quiz still works without it.
    }
}

export function clearPersistedTraderFitState() {
    try {
        window.localStorage.removeItem(traderFitStorageKey);
    } catch {
        // Local storage is best-effort. The quiz still works without it.
    }
}
