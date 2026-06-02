import type { SVGProps } from 'react';

export function BellOffIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M10.5 20a2 2 0 0 0 3 0" />
      <path d="M6.2 6.2A7 7 0 0 1 19 11v3l2 2H9" />
      <path d="M3 3l18 18" />
    </svg>
  );
}
