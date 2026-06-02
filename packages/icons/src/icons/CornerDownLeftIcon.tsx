import type { SVGProps } from 'react';

export function CornerDownLeftIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="m9 10-5 5 5 5" />
      <path d="M20 4v11H4" />
    </svg>
  );
}
