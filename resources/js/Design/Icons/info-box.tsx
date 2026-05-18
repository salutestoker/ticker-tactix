import type { SVGProps } from 'react';

export function InfoBox(props: SVGProps<SVGSVGElement>) {
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
            <rect x="4" y="5" width="16" height="14" rx="2" />
            <path d="M8 9h4" />
            <path d="M8 13h8" />
            <path d="M8 16h6" />
            <circle cx="16.5" cy="9" r=".8" />
        </svg>
    );
}
