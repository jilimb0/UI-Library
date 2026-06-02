import type { SVGProps } from 'react';

export function SkipForwardIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M17 6v12" />
      <path d="m6 6 8 6-8 6V6Z" />
    </svg>
  );
}
