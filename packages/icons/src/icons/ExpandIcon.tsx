import type { SVGProps } from 'react';

export function ExpandIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M15 9h6V3" />
      <path d="M21 3l-7 7" />
      <path d="M9 15H3v6" />
      <path d="M3 21l7-7" />
    </svg>
  );
}
