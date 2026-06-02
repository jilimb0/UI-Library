import type { SVGProps } from 'react';

export function SendIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M21 3 3 11l7 2 2 7 9-17Z" />
      <path d="M10 13 21 3" />
    </svg>
  );
}
