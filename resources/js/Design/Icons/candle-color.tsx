import type { SVGProps } from 'react';

export function CandleColor(props: SVGProps<SVGSVGElement>) {
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
            <path d="M8 4v3" />
            <path d="M8 17v3" />
            <rect x="6" y="7" width="4" height="10" rx="1" />
            <path d="M16 3v4" />
            <path d="M16 15v6" />
            <rect x="14" y="7" width="4" height="8" rx="1" />
        </svg>
    );
}
