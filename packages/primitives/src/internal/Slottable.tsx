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

function composeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref as { current: T | null }).current = node;
      }
    }
  };
}

function composeEventHandlers<E>(
  slotHandler?: (event: E) => void,
  childHandler?: (event: E) => void
) {
  return (event: E) => {
    slotHandler?.(event);
    childHandler?.(event);
  };
}

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

  const childProps = child.props as HTMLAttributes<HTMLElement> & {
    className?: string;
    style?: React.CSSProperties;
    ref?: Ref<HTMLElement>;
  };

  return cloneElement(child as ReactElement<Record<string, unknown>>, {
    ...props,
    ...childProps,
    ref: composeRefs(ref, childProps.ref as Ref<HTMLElement> | undefined),
    onClick: composeEventHandlers(props.onClick, childProps.onClick),
    onMouseDown: composeEventHandlers(
      props.onMouseDown,
      childProps.onMouseDown
    ),
    onMouseUp: composeEventHandlers(props.onMouseUp, childProps.onMouseUp),
    onKeyDown: composeEventHandlers(props.onKeyDown, childProps.onKeyDown),
    onKeyUp: composeEventHandlers(props.onKeyUp, childProps.onKeyUp),
    className:
      [props.className, childProps.className].filter(Boolean).join(' ') ||
      undefined,
    style: {
      ...(props.style ?? {}),
      ...(childProps.style ?? {}),
    },
  });
});
