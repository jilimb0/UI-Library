import type { SVGProps } from 'react';

export function LogOutIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M9 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3" />
      <path d="m14 17 5-5-5-5" />
      <path d="M19 12H8" />
    </svg>
  );
}
