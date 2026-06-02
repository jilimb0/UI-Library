import type { SVGProps } from 'react';

export function BluetoothIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="m12 4 5 4-5 4 5 4-5 4V4Z" />
      <path d="m7 8 10 8" />
      <path d="m7 16 10-8" />
    </svg>
  );
}
