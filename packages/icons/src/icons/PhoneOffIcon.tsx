import type { SVGProps } from 'react';

export function PhoneOffIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M14.5 19a14.8 14.8 0 0 1-9.5-9.5l3-2 2 2-1.5 1.5a11.2 11.2 0 0 0 4.5 4.5L14.5 14l2 2-2 3Z" />
      <path d="M22 2 2 22" />
    </svg>
  );
}
