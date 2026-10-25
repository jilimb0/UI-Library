import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';
import { Slot } from '../../../utils/slot';

export interface MenuItemProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  /** Render as a child element (Slot pattern). */
  asChild?: boolean;
}

const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(
  (
    { active = false, asChild = false, className, style, children, ...props },
    ref
  ) => {
    const itemClass = cn(
      'menu-item',
      active && 'dropdown-menu__item--active',
      className
    );

    if (asChild) {
      return (
        <Slot
          ref={ref as React.Ref<HTMLElement>}
          className={itemClass}
          style={style}
          {...(props as React.HTMLAttributes<HTMLElement>)}
        >
          {children}
        </Slot>
      );
    }

    return (
      <div ref={ref} className={itemClass} style={style} {...props}>
        {children}
      </div>
    );
  }
);

MenuItem.displayName = 'MenuItem';

export { MenuItem };
