import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../../utils/cn';

export interface NavigationProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

export const Navigation = forwardRef<HTMLElement, NavigationProps>(
  ({ children, className, style, ...props }, ref) => {
    return (
      <nav ref={ref} className={cn(className)} style={style} {...props}>
        {children}
      </nav>
    );
  }
);
Navigation.displayName = 'Navigation';
