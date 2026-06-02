import type { SVGProps } from 'react';

export function EyeOffIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M10.7 5.1A11.4 11.4 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-4.2 4.8" />
      <path d="M6.2 6.2A17.1 17.1 0 0 0 2 12s3.5 7 10 7a11 11 0 0 0 5.8-1.6" />
      <path d="M9.9 9.9A3 3 0 0 0 12 15a3 3 0 0 0 2.1-.9" />
      <path d="M3 3l18 18" />
    </svg>
  );
}
