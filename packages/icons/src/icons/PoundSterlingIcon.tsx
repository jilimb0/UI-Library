import type { SVGProps } from 'react';

export function PoundSterlingIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M14 5a4 4 0 0 0-7 3v2h6" />
      <path d="M6 13h8" />
      <path d="M6 19h10" />
      <path d="M9 13c0 3-1 4-3 6" />
    </svg>
  );
}
