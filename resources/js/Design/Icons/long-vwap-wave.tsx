import type { SVGProps } from 'react';

export function LongVwapWave(props: SVGProps<SVGSVGElement>) {
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
            <path d="M3 12c2.2-4 4.4-4 6.6 0s4.4 4 6.6 0S20 8 21 9" />
            <path d="M3 17c2.2-4 4.4-4 6.6 0s4.4 4 6.6 0S20 13 21 14" />
        </svg>
    );
}
