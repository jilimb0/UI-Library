import type { SVGProps } from 'react';

export function BatteryIcon(props: SVGProps<SVGSVGElement>) {
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
      <rect x="4" y="8" width="16" height="8" rx="2" />
      <path d="M20 10h1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-1" />
    </svg>
  );
}
