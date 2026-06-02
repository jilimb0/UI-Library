import type { SVGProps } from 'react';

export function FolderOpenIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M3 9a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v1" />
      <path d="M3 12h18l-2 6a2 2 0 0 1-2 1H5a2 2 0 0 1-2-2v-5Z" />
    </svg>
  );
}
