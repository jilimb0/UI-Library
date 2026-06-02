import type { SVGProps } from 'react';

export function PercentIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="m18 6-12 12" />
      <circle cx="7.5" cy="7.5" r="1.5" />
      <circle cx="16.5" cy="16.5" r="1.5" />
    </svg>
  );
}
