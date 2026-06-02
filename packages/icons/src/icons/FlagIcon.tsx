import type { SVGProps } from 'react';

export function FlagIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M5 4v16" />
      <path d="M5 4h10l-2 4 2 4H5" />
    </svg>
  );
}
