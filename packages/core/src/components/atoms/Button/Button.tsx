import { createButtonBehavior } from '@ui-construction-library/behaviors';
import {
  type ButtonHTMLAttributes,
  type ComponentPropsWithoutRef,
  type ElementType,
  forwardRef,
  type ReactNode,
} from 'react';
import type { ButtonBehaviorOptions } from '../../../types/component-types';
import { cn, tv, type VariantProps } from '../../../utils/cn';
import { Slot } from '../../../utils/slot';

const buttonVariants = tv({
  base: 'ucl-button',
  variants: {
    variant: {
      default: 'ucl-button--default',
      secondary: 'ucl-button--secondary',
      destructive: 'ucl-button--destructive',
      ghost: 'ucl-button--ghost',
      outline: 'ucl-button--outline',
      link: 'ucl-button--link',
      success: 'ucl-button--success',
      warning: 'ucl-button--warning',
      info: 'ucl-button--info',
    },
    size: {
      sm: 'ucl-button--sm',
      md: 'ucl-button--md',
      lg: 'ucl-button--lg',
      icon: 'ucl-button--icon',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
  compoundVariants: [
    {
      variant: 'destructive',
      size: 'icon',
      class: 'ucl-button--destructive-icon',
    },
  ],
});

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  as?: ElementType;
  /** Render as a child element (Slot pattern — merges props onto child). */
  asChild?: boolean;
  /** When `as="a"`, pass the link target. */
  href?: string;
  target?: string;
  rel?: string;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

/**
 * Primary button component with support for variants, sizes, icons, and loading state.
 *
 * @example
 * ```tsx
 * <Button variant="primary" onClick={() => console.log('clicked')}>
 *   Click me
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * <Button variant="secondary" size="sm" leftIcon={<Icon name="plus" />}>
 *   Add item
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * <Button as="a" href="/docs" variant="ghost">
 *   Documentation
 * </Button>
 * ```
 */
const Button = forwardRef<HTMLElement, ButtonProps>(
  (
    {
      as,
      asChild = false,
      className,
      variant,
      size,
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      style,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const { attrs, handlers } = createButtonBehavior({
      variant,
      size,
      loading,
      disabled,
      onClick,
    } satisfies ButtonBehaviorOptions);

    const buttonClass = cn(buttonVariants({ variant, size, className }));

    // asChild: merge button behaviour onto the child element via Slottable
    if (asChild) {
      return (
        <Slot
          ref={ref as React.Ref<HTMLElement>}
          className={buttonClass}
          style={style}
          {...(attrs as React.HTMLAttributes<HTMLElement>)}
          {...(handlers as React.HTMLAttributes<HTMLElement>)}
          {...(props as React.HTMLAttributes<HTMLElement>)}
        >
          {children}
        </Slot>
      );
    }

    const Component = (as ?? 'button') as ElementType;

    return (
      <Component
        ref={ref}
        {...attrs}
        {...handlers}
        className={buttonClass}
        style={style}
        {...(props as ComponentPropsWithoutRef<typeof Component>)}
      >
        {loading && <span className="ucl-button__spinner" aria-hidden="true" />}
        {leftIcon && <span className="ucl-button__icon">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ucl-button__icon">{rightIcon}</span>}
      </Component>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
