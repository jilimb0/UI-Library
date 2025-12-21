
import * as React from 'react';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(({
  level = 1,
  className,
  children,
  ...props
}, ref) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag ref={ref} className={className} {...props}>
      {children}
    </Tag>
  );
});

Heading.displayName = 'Heading';

export { Heading };
