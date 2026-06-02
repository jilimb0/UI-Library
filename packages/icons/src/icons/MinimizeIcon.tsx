import type { SVGProps } from 'react';

export function MinimizeIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="m8 3-5 5" />
      <path d="M3 8V3h5" />
      <path d="m16 21 5-5" />
      <path d="M21 16v5h-5" />
      <path d="m21 8-5-5" />
      <path d="M16 3h5v5" />
      <path d="m3 16 5 5" />
      <path d="M8 21H3v-5" />
    </svg>
  );
}
