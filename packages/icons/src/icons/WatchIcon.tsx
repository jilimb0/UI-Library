import type { SVGProps } from 'react';

export function WatchIcon(props: SVGProps<SVGSVGElement>) {
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
      <rect x="8" y="7" width="8" height="10" rx="2" />
      <path d="M10 3h4" />
      <path d="M10 21h4" />
    </svg>
  );
}
