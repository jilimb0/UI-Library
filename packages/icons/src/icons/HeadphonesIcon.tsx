import type { SVGProps } from 'react';

export function HeadphonesIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M4 12a8 8 0 0 1 16 0" />
      <rect x="4" y="12" width="4" height="7" rx="1.5" />
      <rect x="16" y="12" width="4" height="7" rx="1.5" />
    </svg>
  );
}
