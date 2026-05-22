import {
  Children,
  cloneElement,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';

export function Slottable({
  asChild,
  children,
  ...props
}: { asChild?: boolean; children: ReactNode } & HTMLAttributes<HTMLElement>) {
  if (!asChild) {
    return <span {...props}>{children}</span>;
  }

  const child = Children.only(children);
  if (!isValidElement(child)) return <span {...props}>{children}</span>;

  return cloneElement(child as ReactElement<Record<string, unknown>>, {
    ...props,
    ...(child.props as object),
    className: [
      props.className,
      (child.props as { className?: string }).className,
    ]
      .filter(Boolean)
      .join(' '),
  });
}
