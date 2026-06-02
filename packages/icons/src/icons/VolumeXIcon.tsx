import type { SVGProps } from 'react';

export function VolumeXIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M5 10h4l5-4v12l-5-4H5Z" />
      <path d="m18 9 4 4" />
      <path d="m22 9-4 4" />
    </svg>
  );
}
