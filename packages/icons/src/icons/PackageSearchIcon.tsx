import type { SVGProps } from 'react';

export function PackageSearchIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M4 7v10l8 4 4.5-2.2" />
      <circle cx="18" cy="18" r="3" />
      <path d="m20.2 20.2 1.8 1.8" />
    </svg>
  );
}
