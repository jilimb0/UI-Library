import type { SVGProps } from 'react';

export function AlertOctagonIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="m9.2 3.6 5.6 0 4 4v5.6l-4 4H9.2l-4-4V7.6l4-4Z" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}
