import type { SVGProps } from 'react';

export function ChartLineIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M4 16 9 11l4 3 7-8" />
      <path d="M4 20h16" />
    </svg>
  );
}
