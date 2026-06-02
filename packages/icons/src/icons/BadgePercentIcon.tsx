import type { SVGProps } from 'react';

export function BadgePercentIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="m12 3 2 2.5 3.2-.2.9 3 3 1-.9 3 1.8 2.6-2.6 1.8-.2 3.2-3 1-2-2-2 2-3-1-.2-3.2-2.6-1.8 1.8-2.6-.9-3 3-1 .9-3 3.2.2L12 3Z" />
      <path d="m15.5 8.5-7 7" />
      <circle cx="9" cy="9" r="1" />
      <circle cx="15" cy="15" r="1" />
    </svg>
  );
}
