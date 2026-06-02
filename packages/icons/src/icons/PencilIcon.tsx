import type { SVGProps } from 'react';

export function PencilIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="m15 5 4 4" />
      <path d="M4 20h4l11-11-4-4L4 16v4Z" />
    </svg>
  );
}
