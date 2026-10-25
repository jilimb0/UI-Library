import { type ElementType, forwardRef, type HTMLAttributes } from 'react';
import { Slot } from '../../../utils/slot';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  as?: ElementType;
  /** Render as a child element (Slot pattern). */
  asChild?: boolean;
}

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    { level = 1, as, asChild = false, className, style, children, ...props },
    ref
  ) => {
    if (asChild) {
      return (
        <Slot ref={ref} className={className} style={style} {...props}>
          {children}
        </Slot>
      );
    }
    const Tag = (as ?? `h${level}`) as ElementType;

    return (
      <Tag ref={ref} className={className} style={style} {...props}>
        {children}
      </Tag>
    );
  }
);

Heading.displayName = 'Heading';

export { Heading };
