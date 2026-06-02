import type { SVGProps } from 'react';

export function LayoutListIcon(props: SVGProps<SVGSVGElement>) {
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
      <rect x="5" y="5" width="14" height="3" rx="1" />
      <rect x="5" y="10.5" width="14" height="3" rx="1" />
      <rect x="5" y="16" width="14" height="3" rx="1" />
    </svg>
  );
}
