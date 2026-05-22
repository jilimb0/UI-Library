import { Dialog } from '@ui-construction-library/primitives';
import type { ReactNode } from 'react';
import { cn } from '../../../utils/cn';

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: 'left' | 'right' | 'bottom';
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Drawer({
  open,
  onOpenChange,
  side = 'right',
  title,
  description,
  children,
  className,
}: DrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <Dialog.Content
          className={cn(
            'fixed z-50 bg-white p-4 shadow-xl focus:outline-none',
            side === 'left' && 'inset-y-0 left-0 h-full w-full max-w-md',
            side === 'right' && 'inset-y-0 right-0 h-full w-full max-w-md',
            side === 'bottom' &&
              'bottom-0 left-0 right-0 max-h-[80vh] w-full rounded-t-xl',
            className
          )}
        >
          {(title || description) && (
            <div className="mb-4 border-b border-slate-200 pb-3">
              {title ? (
                <Dialog.Title className="text-lg font-semibold text-slate-900">
                  {title}
                </Dialog.Title>
              ) : null}
              {description ? (
                <Dialog.Description className="mt-1 text-sm text-slate-600">
                  {description}
                </Dialog.Description>
              ) : null}
            </div>
          )}

          <div>{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
