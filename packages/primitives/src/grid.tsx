import {
  type ComponentPropsWithRef,
  type ElementType,
  forwardRef,
} from 'react';

/**
 * Grid — a CSS Grid layout primitive.
 *
 * Renders a grid container with token-aware `columns`, `rows`, `gap`,
 * `columnGap`, and `rowGap` props. Renders a `<div>` by default.
 */
export type GridProps<C extends ElementType = 'div'> = {
  as?: C;
  columns?: string | number;
  rows?: string;
  gap?: string;
  columnGap?: string;
  rowGap?: string;
  areas?: string;
} & Omit<
  ComponentPropsWithRef<C>,
  'as' | 'columns' | 'rows' | 'gap' | 'columnGap' | 'rowGap' | 'areas'
>;

export const Grid = forwardRef<HTMLElement, GridProps<ElementType>>(
  function Grid(
    {
      as: Component = 'div',
      columns,
      rows,
      gap,
      columnGap,
      rowGap,
      areas,
      style,
      ...props
    },
    ref
  ) {
    const templateColumns =
      typeof columns === 'number' ? `repeat(${columns}, 1fr)` : columns;

    const mergedStyle: React.CSSProperties = {
      display: 'grid',
      ...(templateColumns != null && {
        gridTemplateColumns: templateColumns,
      }),
      ...(rows != null && { gridTemplateRows: rows }),
      ...(gap != null && { gap }),
      ...(columnGap != null && { columnGap }),
      ...(rowGap != null && { rowGap }),
      ...(areas != null && { gridTemplateAreas: areas }),
      ...style,
    };

    return <Component ref={ref} style={mergedStyle} {...props} />;
  }
) as <C extends ElementType = 'div'>(props: GridProps<C>) => JSX.Element;
