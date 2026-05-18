import type { SVGProps } from "react";

export function AvwapDoc(props: SVGProps<SVGSVGElement>) {
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
      <path d="M6 3h9l3 3v15H6V3Z"/><path d="M15 3v4h4"/><path d="M9 10h6"/><path d="M9 14h6"/><path d="M9 18h4"/>
    </svg>
  );
}
