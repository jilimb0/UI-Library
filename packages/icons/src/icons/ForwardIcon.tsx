import type { SVGProps } from 'react';

export function ForwardIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="m15 17 5-5-5-5" />
      <path d="M20 12h-9a7 7 0 0 0-7 7" />
    </svg>
  );
}
