import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual elevation level. */
  elevation?: 'flat' | 'raised' | 'overlay';
  /** Whether the card is interactive (clickable). */
  interactive?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, style, elevation = 'raised', interactive, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'card',
          `card--${elevation}`,
          interactive && 'card--interactive',
          className
        )}
        style={style}
        data-elevation={elevation}
        data-interactive={interactive || undefined}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

export { Card };
