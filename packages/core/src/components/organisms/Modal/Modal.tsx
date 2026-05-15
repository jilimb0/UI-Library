import * as Dialog from '@radix-ui/react-dialog';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../../utils/cn';

type ModalRootProps = ComponentPropsWithoutRef<typeof Dialog.Root>;
type ModalContentProps = ComponentPropsWithoutRef<typeof Dialog.Content>;

function ModalRoot(props: ModalRootProps) {
  return <Dialog.Root {...props} />;
}

function ModalTrigger(props: ComponentPropsWithoutRef<typeof Dialog.Trigger>) {
  return <Dialog.Trigger {...props} />;
}

function ModalClose(props: ComponentPropsWithoutRef<typeof Dialog.Close>) {
  return <Dialog.Close {...props} />;
}

function ModalContent({ className, children, ...props }: ModalContentProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50" />
      <Dialog.Content
        className={cn(
          'fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl focus:outline-none',
          className
        )}
        {...props}
      >
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}

function ModalHeader({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn('mb-4 border-b border-slate-200 pb-3', className)}>
      {children}
    </div>
  );
}

function ModalBody({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn('py-1', className)}>{children}</div>;
}

function ModalFooter({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn('mt-5 flex items-center justify-end gap-2', className)}>
      {children}
    </div>
  );
}

export const Modal = Object.assign(ModalRoot, {
  Trigger: ModalTrigger,
  Content: ModalContent,
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
  Close: ModalClose,
  Title: Dialog.Title,
  Description: Dialog.Description,
});
