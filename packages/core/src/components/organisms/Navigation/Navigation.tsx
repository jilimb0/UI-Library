
import * as React from 'react';

export interface NavigationProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const Navigation = React.forwardRef<HTMLElement, NavigationProps>(({ children, ...props }, ref) => {
  return (
    <nav ref={ref} {...props}>
      {children}
    </nav>
  );
});
Navigation.displayName = 'Navigation';
