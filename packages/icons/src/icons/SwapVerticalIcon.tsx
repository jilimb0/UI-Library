import type { SVGProps } from 'react';

export function SwapVerticalIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M8 7v11" />
      <path d="m4 15 4 4 4-4" />
      <path d="M16 17V6" />
      <path d="m12 9 4-4 4 4" />
    </svg>
  );
}
