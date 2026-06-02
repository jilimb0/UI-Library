import type { SVGProps } from 'react';

export function ArrowUpDownIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M12 4v16" />
      <path d="m8 8 4-4 4 4" />
      <path d="m8 16 4 4 4-4" />
    </svg>
  );
}
