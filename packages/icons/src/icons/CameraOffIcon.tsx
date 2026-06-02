import type { SVGProps } from 'react';

export function CameraOffIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M5 7h3l2-2h4l2 2h3a2 2 0 0 1 2 2v8a2 2 0 0 1-.4 1.2" />
      <path d="M3.3 3.3 20.7 20.7" />
      <path d="M9.8 9.8A3.5 3.5 0 0 0 14.2 14.2" />
      <path d="M3 10v7a2 2 0 0 0 2 2h7" />
    </svg>
  );
}
