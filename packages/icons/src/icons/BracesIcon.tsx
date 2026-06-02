import type { SVGProps } from 'react';

export function BracesIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M9 4c-2 0-3 1-3 3v2c0 1-.5 1.5-1.5 2C5.5 11.5 6 12 6 13v2c0 2 1 3 3 3" />
      <path d="M15 4c2 0 3 1 3 3v2c0 1 .5 1.5 1.5 2-1 .5-1.5 1-1.5 2v2c0 2-1 3-3 3" />
    </svg>
  );
}
