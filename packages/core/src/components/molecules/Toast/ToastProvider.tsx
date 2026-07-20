import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { cn } from '../../../utils/cn';
import { Toast } from './Toast';

export interface ToastMessage {
  id: string;
  message: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  duration?: number;
}

export interface ToastContextValue {
  push: (message: Omit<ToastMessage, 'id'>) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}

let toastCounter = 0;

function generateId(): string {
  toastCounter += 1;
  return `toast-${toastCounter}-${Date.now()}`;
}

export interface ToastProviderProps {
  children: ReactNode;
  /**
   * Maximum number of toasts visible at once.
   * @default 5
   */
  maxToasts?: number;
  /**
   * Position of the toast container.
   * @default 'bottom-right'
   */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export function ToastProvider({
  children,
  maxToasts = 5,
  position = 'bottom-right',
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (input: Omit<ToastMessage, 'id'>): string => {
      const id = generateId();
      const toast: ToastMessage = { id, ...input };

      setToasts((prev) => {
        const next = [...prev, toast];
        return next.length > maxToasts
          ? next.slice(next.length - maxToasts)
          : next;
      });

      return id;
    },
    [maxToasts]
  );

  const dismissAll = useCallback(() => {
    setToasts([]);
    timersRef.current.forEach((timer) => {
      clearTimeout(timer);
    });
    timersRef.current.clear();
  }, []);

  return (
    <ToastContext.Provider value={{ push, dismiss, dismissAll }}>
      {children}
      <div className={cn('toast-provider', `toast-provider--${position}`)}>
        {toasts.map((t) => (
          <Toast
            key={t.id}
            variant={t.variant}
            duration={t.duration}
            onClose={() => dismiss(t.id)}
          >
            {t.message}
          </Toast>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
