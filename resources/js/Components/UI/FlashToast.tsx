import type { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type ToastType = 'error' | 'info' | 'success' | 'warning';

type LocalToast = {
    message: string;
    type: ToastType;
};

export default function FlashToast() {
    const { flash } = usePage<PageProps>().props;
    const [isMounted, setIsMounted] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [localToast, setLocalToast] = useState<LocalToast | null>(null);
    const closeTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        function handleToast(event: Event) {
            const detail = (event as CustomEvent<Partial<LocalToast>>).detail;

            if (!detail?.message) {
                return;
            }

            setLocalToast({
                message: detail.message,
                type: detail.type ?? 'info',
            });
        }

        window.addEventListener('ticker-toast', handleToast);

        return () => window.removeEventListener('ticker-toast', handleToast);
    }, []);

    const flashType = flash?.error
        ? 'error'
        : flash?.warning
          ? 'warning'
          : flash?.info
            ? 'info'
            : flash?.success
              ? 'success'
              : null;
    const flashMessage =
        flash?.error || flash?.warning || flash?.info || flash?.success;
    const type = localToast?.type ?? flashType;
    const message = localToast?.message ?? flashMessage;
    const toastKey = useMemo(
        () => (type && message ? `${type}:${message}` : null),
        [message, type],
    );

    const clearCloseTimeout = useCallback(() => {
        if (closeTimeoutRef.current !== null) {
            window.clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
    }, []);

    const dismissToast = useCallback(() => {
        clearCloseTimeout();
        setIsVisible(false);
        closeTimeoutRef.current = window.setTimeout(() => {
            setShouldRender(false);
            setLocalToast(null);
            closeTimeoutRef.current = null;
        }, 300);
    }, [clearCloseTimeout]);

    useEffect(() => {
        if (!toastKey) {
            dismissToast();

            return;
        }

        clearCloseTimeout();
        setShouldRender(true);
        setIsVisible(false);

        const enterFrame = window.requestAnimationFrame(() => {
            setIsVisible(true);
        });
        const dismissTimeout = window.setTimeout(dismissToast, 8000);

        return () => {
            window.cancelAnimationFrame(enterFrame);
            window.clearTimeout(dismissTimeout);
            clearCloseTimeout();
        };
    }, [clearCloseTimeout, dismissToast, toastKey]);

    if (!isMounted || !message || !shouldRender) {
        return null;
    }

    const toastClass =
        type === 'error'
            ? 'border-[#ff5a66] bg-[#a91524] text-white shadow-[0_0_30px_rgba(169,21,36,0.28)]'
            : type === 'warning'
              ? 'border-[#f3bf38] bg-[#b86e00] text-black shadow-[0_0_30px_rgba(184,110,0,0.28)]'
              : type === 'info'
                ? 'border-main-blue bg-main-blue text-white shadow-[0_0_30px_rgba(55,100,245,0.3)]'
                : 'border-seafoam-green bg-seafoam-green text-black shadow-[0_0_30px_rgba(0,250,146,0.32)]';
    const iconClass =
        type === 'error'
            ? 'text-white'
            : type === 'info'
              ? 'text-white'
              : 'text-black';
    const closeClass =
        type === 'error' || type === 'info'
            ? 'border-white/30 text-white/80 hover:border-white/60 hover:bg-white/10 hover:text-white focus-visible:ring-white/60'
            : 'border-black/25 text-black/70 hover:border-black/45 hover:bg-black/10 hover:text-black focus-visible:ring-black/45';

    return createPortal(
        <div
            className={[
                'pointer-events-auto fixed top-4 left-1/2 z-[9999] inline-flex w-fit max-w-[calc(100vw-2rem)] -translate-x-1/2 items-start gap-3 rounded-sm border py-3 pr-3 pl-4 text-sm font-semibold shadow-[0_0_30px_rgba(0,0,0,0.35)] transition-all duration-300 ease-out motion-reduce:transition-none',
                isVisible
                    ? 'translate-y-0 scale-100 opacity-100'
                    : '-translate-y-2 scale-[0.98] opacity-0',
                toastClass,
            ].join(' ')}
            role={type === 'error' ? 'alert' : 'status'}
            aria-live={type === 'error' ? 'assertive' : 'polite'}
        >
            {type === 'error' || type === 'warning' ? (
                <AlertTriangle
                    className={`${iconClass} mt-0.5 h-4 w-4 shrink-0`}
                    aria-hidden
                />
            ) : type === 'info' ? (
                <Info
                    className={`${iconClass} mt-0.5 h-4 w-4 shrink-0`}
                    aria-hidden
                />
            ) : (
                <CheckCircle2
                    className={`${iconClass} mt-0.5 h-4 w-4 shrink-0`}
                    aria-hidden
                />
            )}
            <span className="min-w-0 whitespace-normal">{message}</span>
            <button
                type="button"
                onClick={dismissToast}
                className={[
                    'ml-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none',
                    closeClass,
                ].join(' ')}
                aria-label="Dismiss notification"
            >
                <X className="h-3.5 w-3.5" aria-hidden />
            </button>
        </div>,
        document.body,
    );
}
