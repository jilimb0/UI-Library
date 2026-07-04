import {
  createContext,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Portal } from './internal/Portal';
import { Slottable } from './internal/Slottable';
import { useControllableState } from './internal/useControllableState';

type ContextMenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  position: { x: number; y: number };
  setPosition: (pos: { x: number; y: number }) => void;
};

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);

function useContextMenu() {
  const ctx = useContext(ContextMenuContext);
  if (!ctx) throw new Error('ContextMenu must be used within ContextMenu.Root');
  return ctx;
}

export interface ContextMenuRootProps {
  /** Controlled open state. */
  open?: boolean;
  /** Default open state for uncontrolled usage. */
  defaultOpen?: boolean;
  /** Callback fired when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

function Root({
  open,
  defaultOpen,
  onOpenChange,
  children,
}: ContextMenuRootProps) {
  const [currentOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen ?? false,
    onChange: onOpenChange,
  });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <ContextMenuContext.Provider
      value={{
        open: Boolean(currentOpen),
        setOpen,
        position,
        setPosition,
      }}
    >
      {children}
    </ContextMenuContext.Provider>
  );
}

const Trigger = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(function Trigger({ asChild, onContextMenu, children, ...props }, ref) {
  const { setOpen, setPosition } = useContextMenu();

  return (
    <Slottable asChild={asChild}>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: context menu trigger surface */}
      <div
        ref={ref}
        role="presentation"
        onContextMenu={(e) => {
          onContextMenu?.(e);
          e.preventDefault();
          setPosition({ x: e.clientX, y: e.clientY });
          setOpen(true);
        }}
        {...props}
      >
        {children}
      </div>
    </Slottable>
  );
});

function PortalWrapper({ children }: { children: ReactNode }) {
  const { open } = useContextMenu();
  if (!open) return null;
  return <Portal>{children}</Portal>;
}

const Content = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function Content({ style, ...props }, ref) {
    const { setOpen, position } = useContextMenu();

    useEffect(() => {
      const timer = setTimeout(() => {
        const firstItem = document.querySelector(
          '[role="menuitem"]'
        ) as HTMLElement;
        firstItem?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
      const close = () => setOpen(false);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setOpen(false);
          return;
        }

        const items = Array.from(
          document.querySelectorAll('[role="menuitem"]')
        ) as HTMLElement[];
        if (items.length === 0) return;
        const currentIndex = items.indexOf(
          document.activeElement as HTMLElement
        );

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % items.length;
          items[nextIndex]?.focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIndex = (currentIndex - 1 + items.length) % items.length;
          items[prevIndex]?.focus();
        }
      };
      window.addEventListener('click', close);
      window.addEventListener('keydown', onKey);
      return () => {
        window.removeEventListener('click', close);
        window.removeEventListener('keydown', onKey);
      };
    }, [setOpen]);

    return (
      <div
        ref={ref}
        role="menu"
        style={{
          position: 'fixed',
          top: position.y,
          left: position.x,
          zIndex: 50,
          ...style,
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        {...props}
      />
    );
  }
);

const Item = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { onSelect?: () => void }
>(function Item({ onSelect, onClick, ...props }, ref) {
  const { setOpen } = useContextMenu();

  return (
    <div
      ref={ref}
      role="menuitem"
      tabIndex={0}
      onClick={(e) => {
        onClick?.(e);
        onSelect?.();
        setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.();
          setOpen(false);
        }
      }}
      {...props}
    />
  );
});

export const ContextMenu = {
  Root,
  Trigger,
  Portal: PortalWrapper,
  Content,
  Item,
};
