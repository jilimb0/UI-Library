import {
  createContext,
  forwardRef,
  type HTMLAttributes,
  type MutableRefObject,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Portal } from './internal/Portal';
import { Slottable } from './internal/Slottable';
import { useControllableState } from './internal/useControllableState';

type PopoverContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: MutableRefObject<HTMLElement | null>;
};

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopoverContext() {
  const ctx = useContext(PopoverContext);
  if (!ctx)
    throw new Error('Popover components must be used within Popover.Root');
  return ctx;
}

function Root({
  open,
  defaultOpen,
  onOpenChange,
  children,
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}) {
  const [currentOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen ?? false,
    onChange: onOpenChange,
  });
  const triggerRef = useRef<HTMLElement | null>(null);

  return (
    <PopoverContext.Provider
      value={{
        open: Boolean(currentOpen),
        setOpen,
        triggerRef: triggerRef as MutableRefObject<HTMLElement | null>,
      }}
    >
      {children}
    </PopoverContext.Provider>
  );
}

const Trigger = forwardRef<
  HTMLElement,
  HTMLAttributes<HTMLElement> & { asChild?: boolean }
>(function Trigger({ asChild, onClick, ...props }, ref) {
  const { setOpen, triggerRef } = usePopoverContext();

  return (
    <Slottable asChild={asChild}>
      <button
        ref={(node) => {
          triggerRef.current = node;
          if (typeof ref === 'function') ref(node as HTMLElement);
          else if (ref)
            (ref as MutableRefObject<HTMLElement | null>).current = node;
        }}
        type="button"
        aria-haspopup="dialog"
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) setOpen(true);
        }}
        {...props}
      />
    </Slottable>
  );
});

function PortalWrapper({ children }: { children: ReactNode }) {
  const { open } = usePopoverContext();
  if (!open) return null;
  return <Portal>{children}</Portal>;
}

const Content = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & {
    side?: 'top' | 'right' | 'bottom' | 'left';
    sideOffset?: number;
  }
>(function Content({ side = 'bottom', sideOffset = 8, style, ...props }, ref) {
  const { setOpen, triggerRef } = usePopoverContext();
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const offsets = {
      top: { top: rect.top - sideOffset, left: rect.left },
      bottom: { top: rect.bottom + sideOffset, left: rect.left },
      left: { top: rect.top, left: rect.left - sideOffset },
      right: { top: rect.top, left: rect.right + sideOffset },
    };
    setPosition(offsets[side]);
  }, [side, sideOffset, triggerRef]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [setOpen, triggerRef]);

  return (
    <div
      ref={ref}
      role="dialog"
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        zIndex: 50,
        ...style,
      }}
      data-state="open"
      {...props}
    />
  );
});

export const Popover = { Root, Trigger, Portal: PortalWrapper, Content };
