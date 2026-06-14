import type { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function FlashToast() {
    const { flash } = usePage<PageProps>().props;
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const type = flash?.error
        ? 'error'
        : flash?.warning
          ? 'warning'
          : flash?.info
            ? 'info'
            : flash?.success
              ? 'success'
              : null;
    const message =
        flash?.error || flash?.warning || flash?.info || flash?.success;

    if (!isMounted || !message) {
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

    return createPortal(
        <div
            className={[
                'pointer-events-auto fixed top-4 left-1/2 z-[9999] inline-flex w-fit max-w-[calc(100vw-2rem)] -translate-x-1/2 items-start gap-3 rounded-sm border px-4 py-3 text-sm font-semibold shadow-[0_0_30px_rgba(0,0,0,0.35)]',
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
        </div>,
        document.body,
    );
}
