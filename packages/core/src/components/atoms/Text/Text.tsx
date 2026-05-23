import { cva, type VariantProps } from 'class-variance-authority';
import { type ElementType, forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';

const textVariants = cva('text', {
  variants: {
    size: {
      xs: 'text--xs',
      sm: 'text--sm',
      default: '',
      base: '',
      lg: 'text--lg',
      xl: 'text--xl',
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
  ({ as, size, weight, className, ...props }, ref) => {
    const Component = (as ?? 'p') as ElementType;
    return (
      <Component
        ref={ref}
        className={cn(textVariants({ size, weight, className }))}
        {...props}
      />
    );
  }
);

Text.displayName = 'Text';

export { Text, textVariants };
