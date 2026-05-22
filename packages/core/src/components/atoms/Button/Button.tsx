import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes, ElementType, ReactNode } from 'react';
import { cn } from '../../../utils/cn';

const buttonVariants = cva('button', {
  variants: {
    variant: {
      default: 'button--default',
      destructive: 'button--destructive',
      outline: 'button--outline',
      secondary: 'button--secondary',
      ghost: 'button--ghost',
      link: 'button--link',
    },
    size: {
      default: '',
      sm: 'button--sm',
      lg: 'button--lg',
      icon: 'button--icon',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  as?: ElementType;
  /** When `as="a"`, pass the link target. */
  href?: string;
  target?: string;
  rel?: string;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

function Button({
  as,
  className,
  variant,
  size,
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Component = (as ?? 'button') as ElementType;
  const isNativeButton = Component === 'button';

  return (
    <Component
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isNativeButton ? disabled || loading : undefined}
      {...props}
    >
      {loading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </Component>
  );
}

export { Button, buttonVariants };
