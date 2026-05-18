import type { SVGProps } from 'react';

export function Chat(props: SVGProps<SVGSVGElement>) {
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
            <path d="M5 5h14a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H10l-5 4v-4a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Z" />
            <path d="M8 9h8" />
            <path d="M8 12h5" />
        </svg>
    );
}
