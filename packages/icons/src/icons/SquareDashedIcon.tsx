import type { SVGProps } from 'react';

export function SquareDashedIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M8 4h3" />
      <path d="M13 4h3" />
      <path d="M4 8v3" />
      <path d="M4 13v3" />
      <path d="M8 20h3" />
      <path d="M13 20h3" />
      <path d="M20 8v3" />
      <path d="M20 13v3" />
    </svg>
  );
}
