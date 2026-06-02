import type { SVGProps } from 'react';

export function TerminalIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="m5 7 4 4-4 4" />
      <path d="M11 17h8" />
      <rect x="3" y="4" width="18" height="16" rx="2" />
    </svg>
  );
}
