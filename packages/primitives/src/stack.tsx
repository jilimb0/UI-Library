import {
  type ComponentPropsWithRef,
  type ElementType,
  forwardRef,
} from 'react';

export type StackDirection =
  | 'row'
  | 'column'
  | 'row-reverse'
  | 'column-reverse';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify =
  | 'start'
  | 'center'
  | 'end'
  | 'between'
  | 'around'
  | 'evenly';

const JUSTIFY_MAP: Record<StackJustify, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
};

const ALIGN_MAP: Record<StackAlign, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
};

/**
 * Stack — a flexbox layout primitive.
 *
 * Renders a flex container with token-aware `gap`, `direction`, `align`,
 * `justify`, and `wrap` props. Renders a `<div>` by default.
 */
export type StackProps<C extends ElementType = 'div'> = {
  as?: C;
  direction?: StackDirection;
  gap?: string;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: boolean | 'wrap' | 'nowrap' | 'wrap-reverse';
} & Omit<
  ComponentPropsWithRef<C>,
  'as' | 'direction' | 'gap' | 'align' | 'justify' | 'wrap'
>;

export const Stack = forwardRef<HTMLElement, StackProps<ElementType>>(
  function Stack(
    {
      as: Component = 'div',
      direction = 'column',
      gap,
      align,
      justify,
      wrap,
      style,
      ...props
    },
    ref
  ) {
    const wrapValue =
      wrap === true
        ? 'wrap'
        : wrap === false || wrap == null
          ? undefined
          : wrap;

    const mergedStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: direction,
      ...(gap != null && { gap }),
      ...(align != null && { alignItems: ALIGN_MAP[align as StackAlign] }),
      ...(justify != null && {
        justifyContent: JUSTIFY_MAP[justify as StackJustify],
      }),
      ...(wrapValue != null && { flexWrap: wrapValue }),
      ...style,
    };

    return <Component ref={ref} style={mergedStyle} {...props} />;
  }
) as <C extends ElementType = 'div'>(props: StackProps<C>) => JSX.Element;
