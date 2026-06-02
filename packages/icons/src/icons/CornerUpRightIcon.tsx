import type { SVGProps } from 'react';

export function CornerUpRightIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="m15 14 5-5-5-5" />
      <path d="M4 20V9h16" />
    </svg>
  );
}
