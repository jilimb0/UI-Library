import type { SVGProps } from 'react';

export function SwapHorizontalIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M7 8h11" />
      <path d="m15 4 4 4-4 4" />
      <path d="M17 16H6" />
      <path d="m9 12-4 4 4 4" />
    </svg>
  );
}
