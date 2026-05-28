import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type PropsWithChildren,
} from 'react';

import TraderFitModal from './TraderFitModal';
import { readPersistedTraderFitState } from './traderFitStorage';
import type { TraderFitAnswers } from './types';

export type TraderFitModalLaunchOptions = {
    initialAnswers?: TraderFitAnswers;
    startQuestionIndex?: number;
};

type TraderFitContextValue = {
    closeTraderFitModal: () => void;
    hasCompletedTraderFit: boolean;
    isTraderFitModalOpen: boolean;
    openTraderFitModal: (launchOptions?: TraderFitModalLaunchOptions) => void;
    refreshTraderFitState: () => void;
};

const TraderFitContext = createContext<TraderFitContextValue | null>(null);

export default function TraderFitProvider({ children }: PropsWithChildren) {
    const [isTraderFitModalOpen, setIsTraderFitModalOpen] = useState(false);
    const [hasCompletedTraderFit, setHasCompletedTraderFit] = useState(false);
    const [launchOptions, setLaunchOptions] =
        useState<TraderFitModalLaunchOptions | null>(null);

    const refreshTraderFitState = useCallback(() => {
        setHasCompletedTraderFit(
            Boolean(readPersistedTraderFitState()?.completed),
        );
    }, []);

    useEffect(() => {
        refreshTraderFitState();

        window.addEventListener('storage', refreshTraderFitState);

        return () => {
            window.removeEventListener('storage', refreshTraderFitState);
        };
    }, [refreshTraderFitState]);

    const openTraderFitModal = useCallback(
        (nextLaunchOptions?: TraderFitModalLaunchOptions) => {
            setLaunchOptions(nextLaunchOptions ?? null);
            setIsTraderFitModalOpen(true);
        },
        [],
    );

    const closeTraderFitModal = useCallback(() => {
        setLaunchOptions(null);
        setIsTraderFitModalOpen(false);
    }, []);

    const contextValue = useMemo(
        () => ({
            openTraderFitModal,
            closeTraderFitModal,
            hasCompletedTraderFit,
            isTraderFitModalOpen,
            refreshTraderFitState,
        }),
        [
            closeTraderFitModal,
            hasCompletedTraderFit,
            isTraderFitModalOpen,
            openTraderFitModal,
            refreshTraderFitState,
        ],
    );

    return (
        <TraderFitContext.Provider value={contextValue}>
            {children}
            <TraderFitModal
                isOpen={isTraderFitModalOpen}
                launchOptions={launchOptions}
                onClose={closeTraderFitModal}
                onStateChange={refreshTraderFitState}
            />
        </TraderFitContext.Provider>
    );
}

export function useTraderFitModal() {
    const context = useContext(TraderFitContext);

    if (!context) {
        throw new Error(
            'useTraderFitModal must be used within a TraderFitProvider.',
        );
    }

    return context;
}
