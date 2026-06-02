import type { SVGProps } from 'react';

export function PinOffIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="m15 4 5 5-3 1-2 5" />
      <path d="M12 14v7" />
      <path d="M3 3l18 18" />
    </svg>
  );
}
