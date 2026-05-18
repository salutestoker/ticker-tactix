import type { SVGProps } from 'react';

export function SentimentTracker(props: SVGProps<SVGSVGElement>) {
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
            <circle cx="7" cy="8" r="1.2" />
            <circle cx="12" cy="6" r="1.2" />
            <circle cx="17" cy="8" r="1.2" />
            <circle cx="8.5" cy="15" r="1.2" />
            <circle cx="15.5" cy="15" r="1.2" />
            <path d="M7 8 12 6l5 2" />
            <path d="M8.5 15 12 6l3.5 9" />
        </svg>
    );
}
