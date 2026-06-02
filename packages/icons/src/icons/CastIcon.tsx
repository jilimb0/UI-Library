import type { SVGProps } from 'react';

export function CastIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M4 7h16v10H4Z" />
      <path d="M7 20a3 3 0 0 0-3-3" />
      <path d="M7 16a7 7 0 0 0-7-7" />
    </svg>
  );
}
