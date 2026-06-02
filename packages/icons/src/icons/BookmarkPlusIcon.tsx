import type { SVGProps } from 'react';

export function BookmarkPlusIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M6 4h12v16l-6-4-6 4Z" />
      <path d="M12 7v6" />
      <path d="M9 10h6" />
    </svg>
  );
}
