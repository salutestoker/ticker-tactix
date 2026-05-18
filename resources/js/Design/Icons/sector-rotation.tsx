import type { SVGProps } from 'react';

export function SectorRotation(props: SVGProps<SVGSVGElement>) {
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
            <circle cx="12" cy="12" r="8" />
            <path d="M12 4v8h8" />
            <path d="M12 12 6.3 17.7" />
            <path d="M12 12h-8" />
        </svg>
    );
}
