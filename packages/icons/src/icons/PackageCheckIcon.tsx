import type { SVGProps } from 'react';

export function PackageCheckIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="m12 3 8 4-8 4-8-4 8-4Z" />
      <path d="m4 7 8 4 8-4" />
      <path d="M4 7v10l8 4 8-4V7" />
      <path d="m9.5 12.5 2 2 3-3" />
    </svg>
  );
}
