import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('card', className)}
        style={style}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

export { Card };
