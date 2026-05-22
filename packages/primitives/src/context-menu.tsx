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

function Root({ children }: { children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <ContextMenuContext.Provider
      value={{ open, setOpen, position, setPosition }}
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
      const close = () => setOpen(false);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false);
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
