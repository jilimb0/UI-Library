import type { SVGProps } from 'react';

export function NotificationIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M12 3v9" />
      <path d="M12 16h.01" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}
