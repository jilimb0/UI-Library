import type { SVGProps } from 'react';

export function SortAscIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M7 17V7" />
      <path d="m4 10 3-3 3 3" />
      <path d="M13 17h7" />
      <path d="M13 13h5" />
      <path d="M13 9h3" />
    </svg>
  );
}
