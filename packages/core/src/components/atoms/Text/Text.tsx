import { cva, type VariantProps } from 'class-variance-authority';
import type { ElementType, HTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';

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
  extends HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: ElementType;
}

const Text = ({ as, size, weight, className, ...props }: TextProps) => {
  const Component = (as ?? 'p') as ElementType;
  return (
    <Component
      className={cn(textVariants({ size, weight, className }))}
      {...props}
    />
  );
};

export { Text, textVariants };
