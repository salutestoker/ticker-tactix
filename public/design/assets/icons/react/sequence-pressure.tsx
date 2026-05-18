import type { SVGProps } from "react";

export function SequencePressure(props: SVGProps<SVGSVGElement>) {
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
      <path d="M12 4a8 8 0 1 0 8 8"/><path d="M12 4v4"/><path d="M12 12 18 6"/><path d="M4 12h3"/><path d="M12 17v3"/><path d="M8 8l-2-2"/><path d="M17 17l2 2"/>
    </svg>
  );
}
