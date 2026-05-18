import type { SVGProps } from "react";

export function TrendTracer(props: SVGProps<SVGSVGElement>) {
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
      <path d="M12 3 5 6.5v11L12 21l7-3.5v-11L12 3Z"/><path d="M5 6.5 12 10l7-3.5"/><path d="M12 10v11"/><path d="M7.5 14.5 12 12l4.5 2.5"/>
    </svg>
  );
}
