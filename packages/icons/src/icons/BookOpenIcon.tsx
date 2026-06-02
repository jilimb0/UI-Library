import type { SVGProps } from 'react';

export function BookOpenIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3H11v18H5.5A2.5 2.5 0 0 0 3 23Z" />
      <path d="M21 5.5A2.5 2.5 0 0 0 18.5 3H13v18h5.5A2.5 2.5 0 0 1 21 23Z" />
    </svg>
  );
}
