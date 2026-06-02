import type { SVGProps } from 'react';

export function HardDriveIcon(props: SVGProps<SVGSVGElement>) {
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
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="M8 15h8" />
      <path d="M16 10h.01" />
    </svg>
  );
}
