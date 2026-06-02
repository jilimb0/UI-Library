import type { SVGProps } from 'react';

export function FileJsonIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3v5h5" />
      <path d="M10 11c-1 0-1 1-1 2s0 2-1 2" />
      <path d="M14 11c1 0 1 1 1 2s0 2 1 2" />
    </svg>
  );
}
