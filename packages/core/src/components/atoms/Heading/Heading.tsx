import type { ElementType, HTMLAttributes } from 'react';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  as?: ElementType;
}

const Heading = ({
  level = 1,
  as,
  className,
  children,
  ...props
}: HeadingProps) => {
  const Tag = (as ?? `h${level}`) as ElementType;

  return (
    <Tag className={className} {...props}>
      {children}
    </Tag>
  );
};

export { Heading };
