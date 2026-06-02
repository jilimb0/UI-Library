import type { SVGProps } from 'react';

export function RowsIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M4 12h16" />
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  );
}
