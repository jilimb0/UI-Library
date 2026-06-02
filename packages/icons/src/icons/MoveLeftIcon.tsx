import type { SVGProps } from 'react';

export function MoveLeftIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M20 12H4" />
      <path d="m9 7-5 5 5 5" />
    </svg>
  );
}
