import type { SVGProps } from 'react';

export function CoinsIcon(props: SVGProps<SVGSVGElement>) {
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
      <circle cx="9" cy="10" r="4" />
      <circle cx="15" cy="14" r="4" />
    </svg>
  );
}
