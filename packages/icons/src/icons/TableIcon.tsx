import type { SVGProps } from 'react';

export function TableIcon(props: SVGProps<SVGSVGElement>) {
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
      <rect x="4" y="5" width="16" height="14" rx="1" />
      <path d="M4 10h16" />
      <path d="M4 14h16" />
      <path d="M10 5v14" />
      <path d="M15 5v14" />
    </svg>
  );
}
