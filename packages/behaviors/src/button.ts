/**
 * Button behavior — framework-agnostic ARIA, className, and handlers.
 */

import { cx } from './cx';

export type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonBehaviorOptions {
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: (e?: Event) => void;
}

export function createButtonBehavior(opts?: ButtonBehaviorOptions) {
  const disabled = opts?.disabled || opts?.loading || false;
  const loading = opts?.loading || false;
  const variant = opts?.variant ?? 'default';
  const size = opts?.size ?? 'default';
  const onClick = opts?.onClick;

  const className = cx(
    'ucl-button',
    `ucl-button--${variant}`,
    size !== 'default' && `ucl-button--${size}`
  );

  return {
    attrs: {
      role: 'button' as const,
      'aria-disabled': disabled || undefined,
      'aria-busy': loading || undefined,
      'data-disabled': disabled || undefined,
      'data-loading': loading || undefined,
      'data-variant': variant,
      'data-size': size,
    },
    className,
    handlers: {
      onClick: (e: Event) => {
        if (disabled || loading) {
          e.preventDefault();
          return;
        }
        onClick?.(e);
      },
      onKeyDown: (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (disabled || loading) return;
          onClick?.(e);
        }
      },
    },
  };
}
