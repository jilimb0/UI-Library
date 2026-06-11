import { createPopoverBehavior } from '@ui-construction-library/behaviors';
import {
  createContext,
  forwardRef,
  type HTMLAttributes,
  type MutableRefObject,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type Ref,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { trapFocus } from './internal/focusTrap';
import { Portal } from './internal/Portal';
import { Slottable } from './internal/Slottable';
import { useControllableState } from './internal/useControllableState';

type PopoverContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  modal: boolean;
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
  modal = false,
  children,
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
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
        modal,
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
>(function Trigger({ asChild, onClick, children, ...props }, ref) {
  const { setOpen, triggerRef } = usePopoverContext();
  const behavior = createPopoverBehavior();

  const mergedRef = (node: HTMLElement | null) => {
    triggerRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as MutableRefObject<HTMLElement | null>).current = node;
  };

  const sharedProps = {
    ...behavior.triggerAttrs,
    'aria-haspopup': behavior.triggerAttrs['aria-haspopup'] as
      | boolean
      | 'dialog'
      | 'true'
      | 'false'
      | 'menu'
      | 'listbox'
      | 'tree'
      | 'grid'
      | undefined,
    onClick: (e: ReactMouseEvent<HTMLElement>) => {
      onClick?.(e as ReactMouseEvent<HTMLElement>);
      if (!e.defaultPrevented) setOpen(true);
    },
    ...props,
  } satisfies HTMLAttributes<HTMLElement>;

  if (asChild) {
    return (
      <Slottable asChild ref={mergedRef} {...sharedProps}>
        {children}
      </Slottable>
    );
  }

  return (
    <button
      ref={mergedRef as Ref<HTMLButtonElement>}
      type="button"
      {...sharedProps}
    >
      {children}
    </button>
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
  const { setOpen, triggerRef, modal, open: popoverOpen } = usePopoverContext();
  const _behavior = createPopoverBehavior({ open: popoverOpen, modal });
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const trigger = triggerRef.current;
    const content = contentRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();

    let top = rect.bottom + sideOffset;
    let left = rect.left;

    if (side === 'top') {
      top = rect.top - sideOffset;
      left = rect.left;
    } else if (side === 'left') {
      top = rect.top;
      left = rect.left - sideOffset;
    } else if (side === 'right') {
      top = rect.top;
      left = rect.right + sideOffset;
    }

    if (content) {
      const contentRect = content.getBoundingClientRect();

      // Horizontal collision protection
      if (left < 4) {
        left = 4;
      } else if (left + contentRect.width > window.innerWidth - 4) {
        left = window.innerWidth - contentRect.width - 4;
      }

      // Vertical collision protection and auto-flipping
      if (
        side === 'bottom' &&
        top + contentRect.height > window.innerHeight - 4
      ) {
        const topFit = rect.top - sideOffset - contentRect.height;
        if (topFit >= 4) {
          top = topFit;
        }
      } else if (side === 'top' && top < 4) {
        const bottomFit = rect.bottom + sideOffset;
        if (bottomFit + contentRect.height <= window.innerHeight - 4) {
          top = bottomFit;
        }
      }
    }

    setPosition({ top, left });
  }, [side, sideOffset, triggerRef]);

  useEffect(() => {
    const node = contentRef.current;
    if (!node || !modal) return;
    return trapFocus(node, () => setOpen(false));
  }, [modal, setOpen]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const target = e.target as Node;
      if (contentRef.current?.contains(target)) return;
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
      ref={(node) => {
        contentRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref)
          (ref as MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      role="dialog"
      aria-modal={modal || undefined}
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
