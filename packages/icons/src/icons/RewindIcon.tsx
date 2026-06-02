import type { SVGProps } from 'react';

export function RewindIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="m19 6-7 6 7 6V6Z" />
      <path d="m12 6-7 6 7 6V6Z" />
    </svg>
  );
}
