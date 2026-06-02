import type { SVGProps } from 'react';

export function ReplyIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="m9 17-5-5 5-5" />
      <path d="M4 12h9a7 7 0 0 1 7 7" />
    </svg>
  );
}
