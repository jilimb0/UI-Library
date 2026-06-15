import { createButtonBehavior } from '@ui-construction-library/behaviors';
import {
  type ButtonHTMLAttributes,
  type ComponentPropsWithoutRef,
  type ElementType,
  forwardRef,
  type ReactNode,
} from 'react';
import type {
  ButtonBehaviorOptions,
  ButtonSize,
  ButtonVariant,
} from '../../../types/component-types';
import { cn } from '../../../utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  as?: ElementType;
  /** When `as="a"`, pass the link target. */
  href?: string;
  target?: string;
  rel?: string;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = forwardRef<HTMLElement, ButtonProps>(
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
      onClick,
      ...props
    },
    ref
  ) => {
    const {
      attrs,
      className: behaviorClassName,
      handlers,
    } = createButtonBehavior({
      variant,
      size,
      loading,
      disabled,
      onClick,
    } satisfies ButtonBehaviorOptions);
    const Component = (as ?? 'button') as ElementType;

    return (
      <Component
        ref={ref}
        {...attrs}
        {...handlers}
        className={cn(behaviorClassName, className)}
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

export { Button };
