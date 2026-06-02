import type { SVGProps } from 'react';

export function WifiIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M5 10a11 11 0 0 1 14 0" />
      <path d="M8 13a7 7 0 0 1 8 0" />
      <path d="M11 16a3 3 0 0 1 2 0" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}
