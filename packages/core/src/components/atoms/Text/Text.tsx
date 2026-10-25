import { type ElementType, forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';
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
}

const Text = forwardRef<HTMLElement, TextProps>(
  ({ as, size, weight, className, style, ...props }, ref) => {
    const Component = (as ?? 'p') as ElementType;
    return (
      <Component
        ref={ref}
        className={cn(textVariants({ size, weight, className }))}
        style={style}
        {...props}
      />
    );
  }
);

Text.displayName = 'Text';

export { Text, textVariants };
