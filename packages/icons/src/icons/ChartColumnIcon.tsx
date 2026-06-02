import type { SVGProps } from 'react';

export function ChartColumnIcon(props: SVGProps<SVGSVGElement>) {
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
      <rect x="5" y="11" width="3" height="8" rx="1" />
      <rect x="10.5" y="7" width="3" height="12" rx="1" />
      <rect x="16" y="4" width="3" height="15" rx="1" />
    </svg>
  );
}
