import { HudButton, HudPanel } from '@/Components/UI/Hud';
import { useEffect, useRef, useState, type ReactNode } from 'react';

type MobilePurchaseHudProps = {
    price?: string | null;
    actionUrl?: string | null;
    actionChildren?: ReactNode;
    disabledChildren?: ReactNode;
    external?: boolean;
    className?: string;
};

export function MobilePurchaseHud({
    price,
    actionUrl,
    actionChildren = 'Subscribe',
    disabledChildren = 'Coming Soon',
    external = true,
    className = '',
}: MobilePurchaseHudProps) {
    const topPanelRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef<number | null>(null);
    const [showStickyPanel, setShowStickyPanel] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 767px)');

        const updateStickyPanel = () => {
            if (!mediaQuery.matches) {
                setShowStickyPanel(false);
                return;
            }

            const topPanel = topPanelRef.current;

            if (!topPanel) {
                setShowStickyPanel(false);
                return;
            }

            setShowStickyPanel(topPanel.getBoundingClientRect().bottom <= 0);
        };

        const requestUpdate = () => {
            if (frameRef.current !== null) {
                return;
            }

            frameRef.current = window.requestAnimationFrame(() => {
                frameRef.current = null;
                updateStickyPanel();
            });
        };

        updateStickyPanel();
        window.addEventListener('scroll', requestUpdate, { passive: true });
        window.addEventListener('resize', requestUpdate);
        mediaQuery.addEventListener('change', updateStickyPanel);

        return () => {
            window.removeEventListener('scroll', requestUpdate);
            window.removeEventListener('resize', requestUpdate);
            mediaQuery.removeEventListener('change', updateStickyPanel);

            if (frameRef.current !== null) {
                window.cancelAnimationFrame(frameRef.current);
            }
        };
    }, []);

    return (
        <>
            <div ref={topPanelRef} className={`mt-6 md:hidden ${className}`}>
                <HudPanel className="rounded-[14px] p-4">
                    <MobilePurchaseHudContent
                        price={price}
                        actionUrl={actionUrl}
                        actionChildren={actionChildren}
                        disabledChildren={disabledChildren}
                        external={external}
                    />
                </HudPanel>
            </div>

            <div
                className={`fixed inset-x-0 bottom-0 z-50 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] transition duration-300 md:hidden ${
                    showStickyPanel
                        ? 'translate-y-0 opacity-100'
                        : 'pointer-events-none translate-y-4 opacity-0'
                }`}
            >
                <HudPanel className="border-main-blue/55 bg-panel/95 mx-auto max-w-lg rounded-[14px] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_38px_rgba(55,100,245,0.28)] backdrop-blur-xl">
                    <MobilePurchaseHudContent
                        price={price}
                        actionUrl={actionUrl}
                        actionChildren={actionChildren}
                        disabledChildren={disabledChildren}
                        external={external}
                    />
                </HudPanel>
            </div>
        </>
    );
}

function MobilePurchaseHudContent({
    price,
    actionUrl,
    actionChildren,
    disabledChildren,
    external,
}: Required<Pick<MobilePurchaseHudProps, 'external'>> &
    Pick<
        MobilePurchaseHudProps,
        'price' | 'actionUrl' | 'actionChildren' | 'disabledChildren'
    >) {
    return (
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="min-w-0">
                <p className="font-heading text-[0.62rem] tracking-[0.18em] text-white/45 uppercase">
                    Price
                </p>
                <p className="font-heading mt-1 truncate text-xl leading-none text-white">
                    {price || '—'}
                </p>
            </div>

            {actionUrl ? (
                <HudButton
                    href={actionUrl}
                    external={external}
                    className="min-w-[8.5rem] shrink-0 rounded-[10px] px-3 py-2 text-[0.65rem] whitespace-nowrap"
                    variant="solid"
                >
                    {actionChildren}
                </HudButton>
            ) : (
                <HudButton
                    type="button"
                    disabled
                    className="min-w-[8.5rem] shrink-0 rounded-[10px] px-3 py-2 text-[0.65rem] whitespace-nowrap"
                    variant="solid"
                >
                    {disabledChildren}
                </HudButton>
            )}
        </div>
    );
}
