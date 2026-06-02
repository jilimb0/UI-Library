import type { SVGProps } from 'react';

export function Code2Icon(props: SVGProps<SVGSVGElement>) {
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
      <path d="m8 17-5-5 5-5" />
      <path d="m16 7 5 5-5 5" />
      <path d="m13 4-2 16" />
    </svg>
  );
}
