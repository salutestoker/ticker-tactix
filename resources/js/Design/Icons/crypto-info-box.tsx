import type { SVGProps } from 'react';

export function CryptoInfoBox(props: SVGProps<SVGSVGElement>) {
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
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <path d="M8 8h8" />
            <path d="M8 12h4" />
            <path d="M8 16h7" />
            <path d="M16 11l2 2-2 2" />
        </svg>
    );
}
