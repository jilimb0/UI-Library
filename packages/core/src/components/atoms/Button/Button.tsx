import { cva, type VariantProps } from 'class-variance-authority';
import {
  type ButtonHTMLAttributes,
  type ElementType,
  forwardRef,
  type ReactNode,
} from 'react';
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

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      as,
      className,
      variant,
      size,
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const Component = (as ?? 'button') as ElementType;
    const isNativeButton = Component === 'button';

    return (
      <Component
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        style={style}
        disabled={isNativeButton ? disabled || loading : undefined}
        aria-disabled={
          !isNativeButton && (disabled || loading) ? true : undefined
        }
        aria-busy={loading ? true : undefined}
        {...props}
      >
        {loading && <span className="button__spinner" aria-hidden="true" />}
        {leftIcon && <span className="button__icon">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="button__icon">{rightIcon}</span>}
      </Component>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
