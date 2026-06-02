import type { SVGProps } from 'react';

export function ListChecksIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M11 7h9" />
      <path d="M11 12h9" />
      <path d="M11 17h9" />
      <path d="m4 7 1.5 1.5L8 6" />
      <path d="m4 12 1.5 1.5L8 11" />
      <path d="m4 17 1.5 1.5L8 16" />
    </svg>
  );
}
