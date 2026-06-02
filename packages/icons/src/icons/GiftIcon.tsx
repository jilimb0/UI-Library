import type { SVGProps } from 'react';

export function GiftIcon(props: SVGProps<SVGSVGElement>) {
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
      <rect x="4" y="10" width="16" height="10" rx="1" />
      <path d="M12 10v10" />
      <path d="M4 10h16" />
      <path d="M12 10s-4-1.5-4-4a2 2 0 1 1 4 0" />
      <path d="M12 10s4-1.5 4-4a2 2 0 1 0-4 0" />
    </svg>
  );
}
