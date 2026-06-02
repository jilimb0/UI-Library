import type { SVGProps } from 'react';

export function TrendingDownIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M4 8 10 14l4-4 6 8" />
      <path d="M14 18h6v-6" />
    </svg>
  );
}
