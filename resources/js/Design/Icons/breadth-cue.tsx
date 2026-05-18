import type { SVGProps } from 'react';

export function BreadthCue(props: SVGProps<SVGSVGElement>) {
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
            <path d="M6 16v-3" />
            <path d="M10 16V9" />
            <path d="M14 16v-6" />
            <path d="M18 16V5" />
            <path d="m5 8 3-3 3 2 4-3 4 2" />
        </svg>
    );
}
