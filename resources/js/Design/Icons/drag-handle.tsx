import type { SVGProps } from 'react';

export function DragHandle(props: SVGProps<SVGSVGElement>) {
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
            <circle cx="9" cy="7" r="1" />
            <circle cx="15" cy="7" r="1" />
            <circle cx="9" cy="12" r="1" />
            <circle cx="15" cy="12" r="1" />
            <circle cx="9" cy="17" r="1" />
            <circle cx="15" cy="17" r="1" />
        </svg>
    );
}
