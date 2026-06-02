import type { SVGProps } from 'react';

export function CartIcon(props: SVGProps<SVGSVGElement>) {
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
      <circle cx="9" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
      <path d="M3 5h2l2.2 9.5a2 2 0 0 0 2 1.5h7.8a2 2 0 0 0 2-1.6L21 8H7" />
    </svg>
  );
}
