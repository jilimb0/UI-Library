
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
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const focusable = containerRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const last = focusable[focusable.length - 1];
    last?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      data-testid="modal-overlay"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
        props.onClick?.(e);
      }}
      {...props}
    >
      <div ref={containerRef} className="bg-white rounded-lg p-6 shadow-lg">
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
