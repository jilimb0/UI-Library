import type { SVGProps } from 'react';

export function PinIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="m15 4 5 5-3 1-3 8-2-6-6-2 9-6Z" />
      <path d="M12 14v7" />
    </svg>
  );
}
