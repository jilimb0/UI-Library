import type { SVGProps } from 'react';

export function StickyNoteIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M6 4h12a2 2 0 0 1 2 2v9l-6 5H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
      <path d="M14 20v-5h5" />
    </svg>
  );
}
