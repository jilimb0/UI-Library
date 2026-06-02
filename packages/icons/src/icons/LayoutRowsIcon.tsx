import type { SVGProps } from 'react';

export function LayoutRowsIcon(props: SVGProps<SVGSVGElement>) {
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
      <rect x="4" y="4" width="16" height="5" rx="1" />
      <rect x="4" y="11.5" width="16" height="3.5" rx="1" />
      <rect x="4" y="17" width="16" height="3" rx="1" />
    </svg>
  );
}
