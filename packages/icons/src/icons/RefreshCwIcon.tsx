import type { SVGProps } from 'react';

export function RefreshCwIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M20 6v6h-6" />
      <path d="M20 12a8 8 0 1 1-2.3-5.7L20 8" />
    </svg>
  );
}
