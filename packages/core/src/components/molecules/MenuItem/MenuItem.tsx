import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';

export interface MenuItemProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean;
}

const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(
  ({ active = false, className, style, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'menu-item',
          active && 'dropdown-menu__item--active',
          className
        )}
        style={style}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MenuItem.displayName = 'MenuItem';

export { MenuItem };
