/**
 * Slot — merges props and event handlers onto a single child element.
 *
 * Enables the `asChild` pattern: instead of rendering its own element, the
 * component forwards all props (including className, style, and event
 * handlers) onto the child, composing them rather than overwriting.
 *
 * This is a local copy of the Slottable primitive so core components can use
 * asChild without re-exporting the primitives package internals.
 *
 * @example
 * ```tsx
 * <Button asChild>
 *   <a href="/home">Home</a>
 * </Button>
 * ```
 */
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

function composeHandlers<E>(
  outer?: (event: E) => void,
  inner?: (event: E) => void
) {
  if (!outer && !inner) return undefined;
  return (event: E) => {
    outer?.(event);
    inner?.(event);
  };
}

export interface SlotProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

/**
 * Slot merges its props onto a single child element.
 * Children must be a single valid React element.
 */
export const Slot = forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, ...props },
  ref
) {
  const child = Children.only(children);

  if (!isValidElement(child)) {
    return (
      <span ref={ref as Ref<HTMLSpanElement>} {...props}>
        {children}
      </span>
    );
  }

  const childProps = child.props as HTMLAttributes<HTMLElement> & {
    ref?: Ref<HTMLElement>;
  };

  return cloneElement(child as ReactElement<Record<string, unknown>>, {
    ...props,
    ...childProps,
    ref: composeRefs<HTMLElement>(ref, childProps.ref),
    onClick: composeHandlers(props.onClick, childProps.onClick),
    onMouseDown: composeHandlers(props.onMouseDown, childProps.onMouseDown),
    onMouseUp: composeHandlers(props.onMouseUp, childProps.onMouseUp),
    onKeyDown: composeHandlers(props.onKeyDown, childProps.onKeyDown),
    onKeyUp: composeHandlers(props.onKeyUp, childProps.onKeyUp),
    onFocus: composeHandlers(props.onFocus, childProps.onFocus),
    onBlur: composeHandlers(props.onBlur, childProps.onBlur),
    className:
      [props.className, childProps.className].filter(Boolean).join(' ') ||
      undefined,
    style: {
      ...(props.style ?? {}),
      ...(childProps.style ?? {}),
    },
  });
});
