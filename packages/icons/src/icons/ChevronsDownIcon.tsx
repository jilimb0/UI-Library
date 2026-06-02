import type { SVGProps } from 'react';

export function ChevronsDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="m7 9 5 5 5-5" />
      <path d="m7 4 5 5 5-5" />
    </svg>
  );
}
