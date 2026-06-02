import type { SVGProps } from 'react';

export function LinkIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M10 14 8 16a3 3 0 1 1-4-4l3-3a3 3 0 0 1 4 0" />
      <path d="M14 10l2-2a3 3 0 1 1 4 4l-3 3a3 3 0 0 1-4 0" />
      <path d="M9 12h6" />
    </svg>
  );
}
