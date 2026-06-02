import type { SVGProps } from 'react';

export function SlidersHorizontalIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M4 6h6" />
      <path d="M14 6h6" />
      <path d="M10 6a2 2 0 1 0 4 0 2 2 0 1 0-4 0Z" />
      <path d="M4 12h10" />
      <path d="M18 12h2" />
      <path d="M14 12a2 2 0 1 0 4 0 2 2 0 1 0-4 0Z" />
      <path d="M4 18h2" />
      <path d="M10 18h10" />
      <path d="M6 18a2 2 0 1 0 4 0 2 2 0 1 0-4 0Z" />
    </svg>
  );
}
