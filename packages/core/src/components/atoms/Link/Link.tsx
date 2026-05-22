import { type AnchorHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../../utils/cn';

const linkVariants = {
  default: 'link',
  subtle: 'link link--subtle',
};

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: keyof typeof linkVariants;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ variant = 'default', className, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(linkVariants[variant], className)}
        {...props}
      />
    );
  }
);

Link.displayName = 'Link';

export { Link };
