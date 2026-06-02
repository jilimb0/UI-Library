import type { SVGProps } from 'react';

export function ShrinkIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M15 3h6v6" />
      <path d="m21 9-7-7" />
      <path d="M9 21H3v-6" />
      <path d="m3 15 7 7" />
    </svg>
  );
}
