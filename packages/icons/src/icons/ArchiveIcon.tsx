import type { SVGProps } from 'react';

export function ArchiveIcon(props: SVGProps<SVGSVGElement>) {
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
      <rect x="4" y="5" width="16" height="4" rx="1" />
      <path d="M5 9h14v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9Z" />
      <path d="M10 13h4" />
    </svg>
  );
}
