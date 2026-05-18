import type { SVGProps } from "react";

export function GoalPosts(props: SVGProps<SVGSVGElement>) {
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
      <path d="M6 20V5"/><path d="M18 20V5"/><path d="M6 5h12"/><path d="M9 5v5h6V5"/><path d="M4 20h16"/>
    </svg>
  );
}
