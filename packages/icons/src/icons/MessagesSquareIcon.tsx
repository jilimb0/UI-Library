import type { SVGProps } from 'react';

export function MessagesSquareIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M7 7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2v4l-4-4H9a2 2 0 0 1-2-2V7Z" />
      <path d="M3 5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}
