import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';
import { forwardRef, HTMLAttributes } from 'react';

const textVariants = cva('text-foreground', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
  },
  defaultVariants: {
    size: 'base',
    weight: 'normal',
  },
});

export interface TextProps
  extends
    HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {}

const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ size, weight, className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(textVariants({ size, weight, className }))}
        {...props}
      />
    );
  }
);
Text.displayName = 'Text';

export { Text, textVariants };
