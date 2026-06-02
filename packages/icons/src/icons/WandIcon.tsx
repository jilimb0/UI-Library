import type { SVGProps } from 'react';

export function WandIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="m5 19 14-14" />
      <path d="M7 7h.01" />
      <path d="M11 3h.01" />
      <path d="M17 9h.01" />
      <path d="M21 5h.01" />
      <path d="M15 15h.01" />
    </svg>
  );
}
