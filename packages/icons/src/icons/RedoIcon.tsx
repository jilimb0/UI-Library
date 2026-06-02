import type { SVGProps } from 'react';

export function RedoIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M21 7v6h-6" />
      <path d="M20 13a8 8 0 0 0-13.7-3" />
    </svg>
  );
}
