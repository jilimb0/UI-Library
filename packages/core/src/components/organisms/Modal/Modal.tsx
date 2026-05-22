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
          <Dialog.Title className="modal-title">{title}</Dialog.Title>
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
  return <div className={cn('modal-header', className)}>{children}</div>;
}

function ModalBody({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn('modal-body', className)}>{children}</div>;
}

function ModalFooter({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn('modal-footer', className)}>{children}</div>;
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
