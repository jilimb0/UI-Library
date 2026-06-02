import type { SVGProps } from 'react';

export function Grid3x3Icon(props: SVGProps<SVGSVGElement>) {
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
      <rect x="4" y="4" width="4" height="4" rx=".8" />
      <rect x="10" y="4" width="4" height="4" rx=".8" />
      <rect x="16" y="4" width="4" height="4" rx=".8" />
      <rect x="4" y="10" width="4" height="4" rx=".8" />
      <rect x="10" y="10" width="4" height="4" rx=".8" />
      <rect x="16" y="10" width="4" height="4" rx=".8" />
      <rect x="4" y="16" width="4" height="4" rx=".8" />
      <rect x="10" y="16" width="4" height="4" rx=".8" />
      <rect x="16" y="16" width="4" height="4" rx=".8" />
    </svg>
  );
}
