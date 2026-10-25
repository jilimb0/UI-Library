import { forwardRef, type HTMLAttributes } from 'react';
import { cn, tv } from '../../../utils/cn';

const cardVariants = tv({
  base: 'card',
  variants: {
    elevation: {
      flat: 'card--flat',
      raised: 'card--raised',
      glass: 'card--glass',
    },
    interactive: {
      true: 'card--interactive',
    },
  },
  defaultVariants: {
    elevation: 'flat',
  },
});

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual elevation level. */
  elevation?: 'flat' | 'raised' | 'glass';
  /** Whether the card is interactive (clickable). */
  interactive?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, style, elevation = 'flat', interactive, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ elevation, interactive, className }))}
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
