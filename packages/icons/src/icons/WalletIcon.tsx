import type { SVGProps } from 'react';

export function WalletIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M4 7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v2H6a2 2 0 0 0-2 2Z" />
      <path d="M4 9h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9Z" />
      <path d="M16 14h.01" />
    </svg>
  );
}
