import type { SVGProps } from 'react';

export function ActivityIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M3 12h4l2.5-6 5 12 2.5-6H21" />
    </svg>
  );
}
