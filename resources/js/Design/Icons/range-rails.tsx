import type { SVGProps } from 'react';

export function RangeRails(props: SVGProps<SVGSVGElement>) {
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
            <path d="M5 6h14" />
            <path d="M5 18h14" />
            <path d="M8 6v12" />
            <path d="M16 6v12" />
            <path d="M8 12h8" />
        </svg>
    );
}
