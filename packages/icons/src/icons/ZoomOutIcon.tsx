import type { SVGProps } from 'react';

export function ZoomOutIcon(props: SVGProps<SVGSVGElement>) {
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
      <circle cx="11" cy="11" r="6" />
      <path d="M21 21l-4.3-4.3" />
      <path d="M8 11h6" />
    </svg>
  );
}
