import type { SVGProps } from 'react';

export function PaintBucketIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="m12 4 6 6-6 6-6-6 6-6Z" />
      <path d="M18 13c2 1 3 2.2 3 3.5S19.7 19 18 19s-3-1.2-3-2.5S16 14 18 13Z" />
    </svg>
  );
}
