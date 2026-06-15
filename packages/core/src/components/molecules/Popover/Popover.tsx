import { Popover as PrimitivePopover } from '@ui-construction-library/primitives';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { cn } from '../../../utils/cn';

export const popoverContentVariants = cva('popover', {
  variants: {
    size: {
      sm: 'popover--sm',
      md: 'popover--md',
      lg: 'popover--lg',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface PopoverProps
  extends VariantProps<typeof popoverContentVariants> {
  trigger: ReactNode;
  content: ReactNode;
  /** Preferred side for the popover content. */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Offset in pixels from the trigger element. */
  sideOffset?: number;
  /** Whether the popover is open (controlled). */
  open?: boolean;
  /** Default open state (uncontrolled). */
  defaultOpen?: boolean;
  /** Callback when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Additional class name for the content panel. */
  className?: string;
  /** Inline styles for the content panel. */
  style?: React.CSSProperties;
}

export function Popover({
  trigger,
  content,
  side = 'bottom',
  sideOffset = 8,
  open,
  defaultOpen,
  onOpenChange,
  size,
  className,
  style,
}: PopoverProps) {
  return (
    <PrimitivePopover.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <PrimitivePopover.Trigger asChild>
        {typeof trigger === 'string' || typeof trigger === 'number' ? (
          <button type="button">{trigger}</button>
        ) : (
          trigger
        )}
      </PrimitivePopover.Trigger>
      <PrimitivePopover.Portal>
        <PrimitivePopover.Content
          side={side}
          sideOffset={sideOffset}
          className={cn(popoverContentVariants({ size }), className)}
          style={style}
        >
          {content}
        </PrimitivePopover.Content>
      </PrimitivePopover.Portal>
    </PrimitivePopover.Root>
  );
}
