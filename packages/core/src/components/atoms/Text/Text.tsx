import { type ElementType, forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';
import { Slot } from '../../../utils/slot';
import { tv, type VariantProps } from '../../../utils/variants';

const textVariants = tv({
  base: 'text',
  variants: {
    size: {
      xs: 'text--xs',
      sm: 'text--sm',
      default: '',
      base: '',
      lg: 'text--lg',
      xl: 'text--xl',
      overline: 'text--overline',
    },
    weight: {
      normal: '',
      medium: '',
      semibold: '',
      bold: '',
    },
  },
  defaultVariants: {
    size: 'default',
    weight: 'normal',
  },
});

export interface TextProps
  extends HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: ElementType;
  /** Render as a child element (Slot pattern). */
  asChild?: boolean;
}

const Text = forwardRef<HTMLElement, TextProps>(
  (
    { as, asChild = false, size, weight, className, style, children, ...props },
    ref
  ) => {
    const textClass = cn(textVariants({ size, weight, className }));
    if (asChild) {
      return (
        <Slot ref={ref} className={textClass} style={style} {...props}>
          {children}
        </Slot>
      );
    }
    const Component = (as ?? 'p') as ElementType;
    return (
      <Component ref={ref} className={textClass} style={style} {...props}>
        {children}
      </Component>
    );
  }
);

Text.displayName = 'Text';

export { Text, textVariants };
