import type { SVGProps } from 'react';

export function FolderGitIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M4 6h5l2 2h9v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
      <circle cx="9" cy="12" r="1" />
      <circle cx="14" cy="10" r="1" />
      <circle cx="14" cy="15" r="1" />
      <path d="M10 12h3v-1" />
      <path d="M10 12h3v3" />
    </svg>
  );
}
