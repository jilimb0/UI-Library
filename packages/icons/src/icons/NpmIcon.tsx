import type { SVGProps } from 'react';

export function NpmIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M4 8h16v8H4Z" />
      <path d="M7 16v-5h2l1 2 1-2h2v5" />
      <path d="M15 11h3v5" />
    </svg>
  );
}
