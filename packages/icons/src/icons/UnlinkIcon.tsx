import type { SVGProps } from 'react';

export function UnlinkIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M10 14 8 16a3 3 0 1 1-4-4l2.5-2.5" />
      <path d="M14 10l2-2a3 3 0 1 1 4 4L17.5 14.5" />
      <path d="M9 12h6" />
      <path d="M3 3l18 18" />
    </svg>
  );
}
