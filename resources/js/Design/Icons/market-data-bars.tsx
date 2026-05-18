import type { SVGProps } from 'react';

export function MarketDataBars(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            {...props}
        >
            <path d="M4 19h16" />
            <path d="M6 16v-4" />
            <path d="M10 16V8" />
            <path d="M14 16V5" />
            <path d="M18 16v-7" />
            <path d="M5 6h2" />
            <path d="M9 4h2" />
        </svg>
    );
}
