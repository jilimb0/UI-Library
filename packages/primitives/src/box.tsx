import {
  type ComponentPropsWithRef,
  type ElementType,
  forwardRef,
} from 'react';

/**
 * Polymorphic Box — a minimal container primitive.
 *
 * Renders a `<div>` by default. Use the `as` prop to change the element type.
 * All spacing props accept CSS values or token variable references.
 */
export type BoxProps<C extends ElementType = 'div'> = {
  as?: C;
  padding?: string;
  paddingX?: string;
  paddingY?: string;
  margin?: string;
} & Omit<
  ComponentPropsWithRef<C>,
  'as' | 'padding' | 'paddingX' | 'paddingY' | 'margin'
>;

export const Box = forwardRef<HTMLElement, BoxProps<ElementType>>(function Box(
  {
    as: Component = 'div',
    padding,
    paddingX,
    paddingY,
    margin,
    style,
    ...props
  },
  ref
) {
  const mergedStyle: React.CSSProperties = {
    ...(padding != null && { padding }),
    ...(paddingX != null && { paddingLeft: paddingX, paddingRight: paddingX }),
    ...(paddingY != null && { paddingTop: paddingY, paddingBottom: paddingY }),
    ...(margin != null && { margin }),
    ...style,
  };

  return <Component ref={ref} style={mergedStyle} {...props} />;
}) as <C extends ElementType = 'div'>(props: BoxProps<C>) => JSX.Element;
