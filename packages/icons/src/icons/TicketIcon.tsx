import type { SVGProps } from 'react';

export function TicketIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M5 7h14v4a2 2 0 0 0 0 4v4H5v-4a2 2 0 0 0 0-4V7Z" />
      <path d="M12 7v12" />
    </svg>
  );
}
