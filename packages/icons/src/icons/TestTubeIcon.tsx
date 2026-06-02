import type { SVGProps } from 'react';

export function TestTubeIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M10 4v6.5l-4.5 7a2 2 0 0 0 1.7 3h9.6a2 2 0 0 0 1.7-3l-4.5-7V4" />
      <path d="M9 4h6" />
      <path d="M8 14h8" />
    </svg>
  );
}
