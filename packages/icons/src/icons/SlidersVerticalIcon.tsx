import type { SVGProps } from 'react';

export function SlidersVerticalIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M6 4v6" />
      <path d="M6 14v6" />
      <path d="M6 10a2 2 0 1 0 0 4 2 2 0 1 0 0-4Z" />
      <path d="M12 4v10" />
      <path d="M12 18v2" />
      <path d="M12 14a2 2 0 1 0 0 4 2 2 0 1 0 0-4Z" />
      <path d="M18 4v2" />
      <path d="M18 10v10" />
      <path d="M18 6a2 2 0 1 0 0 4 2 2 0 1 0 0-4Z" />
    </svg>
  );
}
