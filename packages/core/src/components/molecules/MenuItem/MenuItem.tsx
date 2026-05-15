import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';

export interface MenuItemProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean;
}

const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(
  ({ active = false, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'cursor-pointer rounded-md px-3 py-2 text-sm font-medium',
          active ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MenuItem.displayName = 'MenuItem';

export { MenuItem };
