import type { SVGProps } from 'react';

export function CloudOffIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M7 19h10a4 4 0 0 0 1.8-7.6A6 6 0 0 0 8.6 7.2" />
      <path d="m3 3 18 18" />
    </svg>
  );
}
