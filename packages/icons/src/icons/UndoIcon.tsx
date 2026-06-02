import type { SVGProps } from 'react';

export function UndoIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M3 7v6h6" />
      <path d="M4 13a8 8 0 0 1 13.7-3" />
    </svg>
  );
}
