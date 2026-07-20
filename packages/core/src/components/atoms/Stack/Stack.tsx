import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../../../utils/cn';

export interface StackProps {
  children: ReactNode;
  /** Spacing between children. Defaults to 1rem. */
  gap?: string | number;
  /** Direction. Defaults to 'vertical'. */
  direction?: 'vertical' | 'horizontal';
  /** Align items. */
  align?: CSSProperties['alignItems'];
  /** Justify content. */
  justify?: CSSProperties['justifyContent'];
  /** Wrap for horizontal direction. */
  wrap?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function Stack({
  children,
  gap = '1rem',
  direction = 'vertical',
  align,
  justify,
  wrap,
  className,
  style,
}: StackProps) {
  return (
    <div
      className={cn(
        direction === 'vertical' ? 'stack-vertical' : 'stack-horizontal',
        className
      )}
      style={{
        gap: typeof gap === 'number' ? `${gap}rem` : gap,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? 'wrap' : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
