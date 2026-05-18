import type { SVGProps } from "react";

export function MomentumCycles(props: SVGProps<SVGSVGElement>) {
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
      <path d="M4 18h16"/><path d="M5 15l3-4 3 2 4-6 4 3"/><path d="M18 10h2v2"/><circle cx="9" cy="11" r=".8"/><circle cx="15" cy="7" r=".8"/>
    </svg>
  );
}
