import type { SVGProps } from 'react';

export function FlagOffIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M5 4v16" />
      <path d="M5 4h10l-2 4 2 4H8" />
      <path d="M2 2l20 20" />
    </svg>
  );
}
