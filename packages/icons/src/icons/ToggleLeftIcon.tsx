import type { SVGProps } from 'react';

export function ToggleLeftIcon(props: SVGProps<SVGSVGElement>) {
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
      <rect x="3" y="7" width="18" height="10" rx="5" />
      <circle cx="8" cy="12" r="3" />
    </svg>
  );
}
