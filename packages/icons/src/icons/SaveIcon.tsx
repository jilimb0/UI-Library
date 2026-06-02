import type { SVGProps } from 'react';

export function SaveIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M5 4h11l3 3v13H5Z" />
      <path d="M8 4v6h8V4" />
      <path d="M8 20v-6h8v6" />
    </svg>
  );
}
