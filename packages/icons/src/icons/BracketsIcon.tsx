import type { SVGProps } from 'react';

export function BracketsIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M8 4H5v16h3" />
      <path d="M16 4h3v16h-3" />
    </svg>
  );
}
