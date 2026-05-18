import type { SVGProps } from "react";

export function VersionedLayers(props: SVGProps<SVGSVGElement>) {
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
      <path d="M12 3.5 4 7.5l8 4 8-4-8-4Z"/><path d="m4 12 8 4 8-4"/><path d="m4 16.5 8 4 8-4"/>
    </svg>
  );
}
