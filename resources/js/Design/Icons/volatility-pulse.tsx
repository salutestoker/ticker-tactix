import type { SVGProps } from 'react';

export function VolatilityPulse(props: SVGProps<SVGSVGElement>) {
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
            <path d="M3 12h4l2-6 4 12 2-6h6" />
            <path d="M4 18h16" />
            <path d="M4 6h4" />
        </svg>
    );
}
