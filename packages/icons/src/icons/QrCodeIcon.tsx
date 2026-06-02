import type { SVGProps } from 'react';

export function QrCodeIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M4 4h6v6H4Z" />
      <path d="M14 4h6v6h-6Z" />
      <path d="M4 14h6v6H4Z" />
      <path d="M15 15h1" />
      <path d="M18 15h2" />
      <path d="M15 18h5" />
      <path d="M18 12v2" />
    </svg>
  );
}
