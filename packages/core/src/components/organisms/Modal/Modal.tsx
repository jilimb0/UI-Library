import { Dialog } from '@ui-construction-library/primitives';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../../utils/cn';

export const modalContentVariants = cva('modal-content focus:outline-none', {
  variants: {
    size: {
      sm: 'modal-content--sm',
      md: 'modal-content--md',
      lg: 'modal-content--lg',
      full: 'modal-content--full',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

type ModalRootProps = ComponentPropsWithoutRef<typeof Dialog.Root>;
type ModalContentProps = ComponentPropsWithoutRef<typeof Dialog.Content> &
  VariantProps<typeof modalContentVariants> & {
    title?: string;
  };

/**
 * Composable modal dialog with Header, Body, Footer, and size variants.
 *
 * @example
 * ```tsx
 * <Modal>
 *   <Modal.Trigger asChild>
 *     <button type="button">Open modal</button>
 *   </Modal.Trigger>
 *   <Modal.Content size="md" title="Settings">
 *     <Modal.Body>Your content here.</Modal.Body>
 *     <Modal.Footer>
 *       <Modal.Close />
 *     </Modal.Footer>
 *   </Modal.Content>
 * </Modal>
 * ```
 */
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
  style,
  children,
  title,
  size,
  ...props
}: ModalContentProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="modal-backdrop" />
      <Dialog.Content
        className={cn(modalContentVariants({ size }), className)}
        style={style}
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
