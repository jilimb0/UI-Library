
import * as React from 'react';
import { createPortal } from 'react-dom';

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(({
  isOpen,
  onClose,
  children,
  ...props
}, ref) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      data-testid="modal-overlay"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      {...props}
    >
      <div className="bg-white rounded-lg p-6 shadow-lg">
        {children}
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
          Close
        </button>
      </div>
    </div>,
    document.body
  );
});
Modal.displayName = 'Modal';
