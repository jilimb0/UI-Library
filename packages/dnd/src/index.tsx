import {
  createContext,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

export interface DragEndEvent {
  active: { id: string | number };
  over: { id: string | number } | null;
}

type DndContextValue = {
  activeId: string | number | null;
  setActiveId: (id: string | number | null) => void;
  overId: string | number | null;
  setOverId: (id: string | number | null) => void;
  onDragEnd?: (event: DragEndEvent) => void;
};

const DndContextState = createContext<DndContextValue | null>(null);

export function DndContext({
  children,
  onDragEnd,
}: {
  children: ReactNode;
  onDragEnd?: (event: DragEndEvent) => void;
}) {
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const [overId, setOverId] = useState<string | number | null>(null);

  return (
    <DndContextState.Provider
      value={{ activeId, setActiveId, overId, setOverId, onDragEnd }}
    >
      {children}
    </DndContextState.Provider>
  );
}

export function useDraggable({ id }: { id: string | number }) {
  const ctx = useContext(DndContextState);
  const ref = useRef<HTMLElement | null>(null);
  const [transform, setTransform] = useState<{ x: number; y: number } | null>(
    null
  );

  const onPointerDown = useCallback(
    (event: React.PointerEvent) => {
      if (!ctx) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      ctx.setActiveId(id);
      const startX = event.clientX;
      const startY = event.clientY;

      const onMove = (e: PointerEvent) => {
        setTransform({ x: e.clientX - startX, y: e.clientY - startY });
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const droppable = el?.closest('[data-droppable-id]');
        const over = droppable?.getAttribute('data-droppable-id');
        ctx.setOverId(over ?? null);
      };

      const onUp = (_e: PointerEvent) => {
        ctx.onDragEnd?.({
          active: { id },
          over: ctx.overId ? { id: ctx.overId } : null,
        });
        ctx.setActiveId(null);
        ctx.setOverId(null);
        setTransform(null);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    },
    [ctx, id]
  );

  return {
    attributes: {
      'data-draggable-id': String(id),
      role: 'button',
      tabIndex: 0,
    } as HTMLAttributes<HTMLElement>,
    listeners: { onPointerDown },
    setNodeRef: (node: HTMLElement | null) => {
      ref.current = node;
    },
    transform,
  };
}

export function useDroppable({ id }: { id: string | number }) {
  const ctx = useContext(DndContextState);
  const isOver = ctx?.overId === id || ctx?.overId === String(id);

  return {
    isOver: Boolean(isOver),
    setNodeRef: (node: HTMLElement | null) => {
      if (node) node.setAttribute('data-droppable-id', String(id));
    },
  };
}

export const CSS = {
  Translate: {
    toString(transform: { x: number; y: number } | null): string | undefined {
      if (!transform) return undefined;
      return `translate3d(${transform.x}px, ${transform.y}px, 0)`;
    },
  },
};
