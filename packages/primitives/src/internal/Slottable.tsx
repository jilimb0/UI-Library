import {
  Children,
  cloneElement,
  forwardRef,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';

export const Slottable = forwardRef<
  HTMLElement,
  { asChild?: boolean; children: ReactNode } & HTMLAttributes<HTMLElement>
>(function Slottable({ asChild, children, ...props }, ref) {
  if (!asChild) {
    return (
      <span ref={ref as Ref<HTMLSpanElement>} {...props}>
        {children}
      </span>
    );
  }

  const child = Children.only(children);
  if (!isValidElement(child)) {
    return (
      <span ref={ref as Ref<HTMLSpanElement>} {...props}>
        {children}
      </span>
    );
  }

  return cloneElement(child as ReactElement<Record<string, unknown>>, {
    ref,
    ...props,
    ...(child.props as object),
    className:
      [props.className, (child.props as { className?: string }).className]
        .filter(Boolean)
        .join(' ') || undefined,
  });
});
