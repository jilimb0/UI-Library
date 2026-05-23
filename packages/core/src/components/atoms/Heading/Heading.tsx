import { type ElementType, forwardRef, type HTMLAttributes } from 'react';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  as?: ElementType;
}

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = 1, as, className, children, ...props }, ref) => {
    const Tag = (as ?? `h${level}`) as ElementType;

    return (
      <Tag ref={ref} className={className} {...props}>
        {children}
      </Tag>
    );
  }
);

Heading.displayName = 'Heading';

export { Heading };
