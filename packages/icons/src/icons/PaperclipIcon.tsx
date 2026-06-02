import type { SVGProps } from 'react';

export function PaperclipIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="m9 17 6-6a3 3 0 1 0-4.2-4.2L4.6 13a5 5 0 0 0 7.1 7.1L18 13.8" />
    </svg>
  );
}
