import type { SVGProps } from 'react';

export function KanbanIcon(props: SVGProps<SVGSVGElement>) {
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
      <rect x="4" y="6" width="4" height="12" rx="1" />
      <rect x="10" y="6" width="4" height="8" rx="1" />
      <rect x="16" y="6" width="4" height="10" rx="1" />
    </svg>
  );
}
