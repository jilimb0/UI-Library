import { Dialog } from '@ui-construction-library/primitives';
import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../../../utils/cn';

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: 'left' | 'right' | 'bottom';
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Drawer({
  open,
  onOpenChange,
  side = 'right',
  title,
  description,
  children,
  className,
  style,
}: DrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-backdrop" />
        <Dialog.Content
          className={cn(
            'drawer-content',
            side === 'left' && 'drawer-content--left',
            side === 'right' && 'drawer-content--right',
            side === 'bottom' && 'drawer-content--bottom',
            className
          )}
          style={style}
        >
          {(title || description) && (
            <div className="drawer-header">
              {title ? (
                <Dialog.Title className="drawer-title">{title}</Dialog.Title>
              ) : null}
              {description ? (
                <Dialog.Description className="drawer-description">
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
