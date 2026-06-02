import type { SVGProps } from 'react';

export function CalendarIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M7 3v4" />
      <path d="M17 3v4" />
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M4 10h16" />
    </svg>
  );
}
