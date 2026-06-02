import type { SVGProps } from 'react';

export function MicOffIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M15 9V6a3 3 0 0 0-5.4-1.8" />
      <path d="M9 9v3a3 3 0 0 0 5 2.2" />
      <path d="M19 10a7 7 0 0 1-1.6 4.5" />
      <path d="M5 10a7 7 0 0 0 10.8 5.8" />
      <path d="M12 17v4" />
      <path d="M8 21h8" />
      <path d="M2 2l20 20" />
    </svg>
  );
}
