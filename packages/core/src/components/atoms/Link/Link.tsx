
import * as React from 'react';
import { cn } from '../../../utils/cn';

const linkVariants = {
  default: 'text-primary underline hover:text-primary/80',
  subtle: 'text-muted-foreground underline hover:text-muted-foreground/80'
};

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: keyof typeof linkVariants;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(({
  variant = 'default',
  className,
  ...props
}, ref) => {
  return (
    <a
      ref={ref}
      className={cn(linkVariants[variant], className)}
      {...props}
    />
  );
});

Link.displayName = 'Link';

export { Link };
