import type { SVGProps } from "react";

export function ParticipationNetwork(props: SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="7" r="3"/><path d="M5.5 19a6.5 6.5 0 0 1 13 0"/><circle cx="5.5" cy="11.5" r="2"/><circle cx="18.5" cy="11.5" r="2"/><path d="M7.2 13.2A7 7 0 0 1 12 12"/><path d="M16.8 13.2A7 7 0 0 0 12 12"/>
    </svg>
  );
}
