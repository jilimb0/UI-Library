import type { SVGProps } from 'react';

export function MaximizeIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M8 3H3v5" />
      <path d="M3 3l7 7" />
      <path d="M16 21h5v-5" />
      <path d="m21 21-7-7" />
      <path d="M21 8V3h-5" />
      <path d="m14 10 7-7" />
      <path d="M3 16v5h5" />
      <path d="m3 21 7-7" />
    </svg>
  );
}
