import type { SVGProps } from "react";

export function Rabbit(props: SVGProps<SVGSVGElement>) {
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
      <path d="M7 15c0-3 2.5-5 5.5-5H15a4 4 0 0 1 4 4v2H7Z"/><path d="M10 10 8 4"/><path d="M13 10l2-6"/><path d="M7 15l-2 2"/><path d="M16 16v3"/><path d="M10 16v3"/><circle cx="18.5" cy="13" r=".5"/>
    </svg>
  );
}
