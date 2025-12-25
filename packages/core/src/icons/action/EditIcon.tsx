
import * as React from 'react';

export function EditIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M4 20h16v-2H4v2z" fill="currentColor" />
      <path d="M20 4l-6 6-4-4 6-6 4 4z" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}
