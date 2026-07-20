import { Dialog } from '@ui-construction-library/primitives';
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';
import { cn } from '../../../utils/cn';

export interface DrawerProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange: (open: boolean) => void;
  side?: 'left' | 'right' | 'bottom';
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

function DrawerRoot({
  open,
  defaultOpen,
  onOpenChange,
  side = 'right',
  title,
  description,
  children,
  className,
  style,
}: DrawerProps) {
  return (
    <Dialog.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="drawer-backdrop" />
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

          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function DrawerClose(props: ComponentPropsWithoutRef<typeof Dialog.Close>) {
  return <Dialog.Close {...props} />;
}

export const Drawer = Object.assign(DrawerRoot, {
  Close: DrawerClose,
  Title: Dialog.Title,
  Description: Dialog.Description,
});
