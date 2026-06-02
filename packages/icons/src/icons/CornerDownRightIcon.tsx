import type { SVGProps } from 'react';

export function CornerDownRightIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="m15 10 5 5-5 5" />
      <path d="M4 4v11h16" />
    </svg>
  );
}
