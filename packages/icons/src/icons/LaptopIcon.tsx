import type { SVGProps } from 'react';

export function LaptopIcon(props: SVGProps<SVGSVGElement>) {
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
      <rect x="6" y="5" width="12" height="9" rx="1.5" />
      <path d="M3 18h18" />
    </svg>
  );
}
