import type { SVGProps } from 'react';

export function MoveDownIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="m7 15 5 5 5-5" />
    </svg>
  );
}
