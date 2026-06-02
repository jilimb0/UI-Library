import type { SVGProps } from 'react';

export function ChevronsRightIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="m9 7 5 5-5 5" />
      <path d="m4 7 5 5-5 5" />
    </svg>
  );
}
