import type { SVGProps } from 'react';

export function MessageCircleIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M7 18l-3 3v-5a8 8 0 1 1 3 2" />
      <path d="M8 10h8" />
      <path d="M8 14h5" />
    </svg>
  );
}
