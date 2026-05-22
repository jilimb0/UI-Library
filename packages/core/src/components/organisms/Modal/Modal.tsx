import { Dialog } from '@ui-construction-library/primitives';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../../utils/cn';

type ModalRootProps = ComponentPropsWithoutRef<typeof Dialog.Root>;
type ModalContentProps = ComponentPropsWithoutRef<typeof Dialog.Content> & {
  title?: string;
};

function ModalRoot(props: ModalRootProps) {
  return <Dialog.Root {...props} />;
}

function ModalTrigger(props: ComponentPropsWithoutRef<typeof Dialog.Trigger>) {
  return <Dialog.Trigger {...props} />;
}

function ModalClose(props: ComponentPropsWithoutRef<typeof Dialog.Close>) {
  return <Dialog.Close {...props} />;
}

function ModalContent({
  className,
  children,
  title,
  ...props
}: ModalContentProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="modal-backdrop" />
      <Dialog.Content
        className={cn('modal-content focus:outline-none', className)}
        {...props}
      >
        {title ? (
          <Dialog.Title className="mb-4 border-b border-slate-200 pb-3 text-lg font-semibold text-slate-900">
            {title}
          </Dialog.Title>
        ) : null}
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
