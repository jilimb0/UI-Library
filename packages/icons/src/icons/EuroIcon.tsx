import type { SVGProps } from 'react';

export function EuroIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M15 6a6 6 0 1 0 0 12" />
      <path d="M7 10h7" />
      <path d="M7 14h7" />
    </svg>
  );
}
