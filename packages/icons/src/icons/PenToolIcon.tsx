import type { SVGProps } from 'react';

export function PenToolIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M12 19l7-7-4-4-7 7" />
      <path d="m15 8 2-2a2 2 0 1 0-3-3l-2 2" />
      <path d="m5 19 4-1-3-3-1 4Z" />
    </svg>
  );
}
