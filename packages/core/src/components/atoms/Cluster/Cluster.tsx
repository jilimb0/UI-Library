import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../../../utils/cn';

export interface ClusterProps {
  children: ReactNode;
  /** Spacing between items. Defaults to 0.5rem. */
  gap?: string | number;
  /** Align items. Defaults to 'center'. */
  align?: CSSProperties['alignItems'];
  /** Justify content. */
  justify?: CSSProperties['justifyContent'];
  className?: string;
  style?: CSSProperties;
}

export function Cluster({
  children,
  gap = '0.5rem',
  align = 'center',
  justify,
  className,
  style,
}: ClusterProps) {
  return (
    <div
      className={cn('inline-cluster', className)}
      style={{
        gap: typeof gap === 'number' ? `${gap}rem` : gap,
        alignItems: align,
        justifyContent: justify,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
