import { Dialog as PrimitiveDialog } from '@ui-construction-library/primitives';
import { isValidElement, type ReactElement, type ReactNode } from 'react';
import { cn } from '../../../utils/cn';

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Accessible dialog/modal component built on primitives with trigger, overlay, and content slots.
 *
 * @example
 * ```tsx
 * <Dialog
 *   trigger={<button type="button">Open dialog</button>}
 *   onOpenChange={(open) => console.log(open)}
 * >
 *   <DialogTitle>Confirm</DialogTitle>
 *   <DialogDescription>Are you sure?</DialogDescription>
 *   <DialogClose />
 * </Dialog>
 * ```
 */
export function Dialog({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  children,
  className,
}: DialogProps) {
  const triggerElement = trigger ? (
    isValidElement(trigger) ? (
      <PrimitiveDialog.Trigger asChild>
        {trigger as ReactElement}
      </PrimitiveDialog.Trigger>
    ) : (
      <PrimitiveDialog.Trigger>
        <span>{trigger}</span>
      </PrimitiveDialog.Trigger>
    )
  ) : null;

  return (
    <PrimitiveDialog.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      {triggerElement}
      <PrimitiveDialog.Portal>
        <PrimitiveDialog.Overlay className="ucl-dialog-overlay" />
        <PrimitiveDialog.Content
          className={cn('ucl-dialog-content', className)}
        >
          {children}
        </PrimitiveDialog.Content>
      </PrimitiveDialog.Portal>
    </PrimitiveDialog.Root>
  );
}

export const DialogTitle = PrimitiveDialog.Title;
export const DialogDescription = PrimitiveDialog.Description;
export const DialogClose = PrimitiveDialog.Close;
