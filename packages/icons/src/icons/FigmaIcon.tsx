import type { SVGProps } from 'react';

export function FigmaIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M10 4a3 3 0 0 1 0 6H7V7a3 3 0 0 1 3-3Z" />
      <path d="M10 10H7v4h3a3 3 0 1 0 0-4Z" />
      <path d="M10 14H7v3a3 3 0 1 0 3-3Z" />
      <path d="M14 4a3 3 0 1 1 0 6h-4V7a3 3 0 0 1 4-3Z" />
      <circle cx="14" cy="14" r="3" />
    </svg>
  );
}
