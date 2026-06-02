import type { SVGProps } from 'react';

export function SignalIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M5 20h2v-3H5v3Z" />
      <path d="M9 20h2v-6H9v6Z" />
      <path d="M13 20h2v-9h-2v9Z" />
      <path d="M17 20h2V8h-2v12Z" />
    </svg>
  );
}
