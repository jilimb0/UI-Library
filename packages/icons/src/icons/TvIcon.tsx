import type { SVGProps } from 'react';

export function TvIcon(props: SVGProps<SVGSVGElement>) {
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
      <rect x="4" y="7" width="16" height="10" rx="2" />
      <path d="m9 3 3 4 3-4" />
    </svg>
  );
}
