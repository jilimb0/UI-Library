import {
  CSS,
  DndContext,
  type DragEndEvent,
  useDraggable,
  useDroppable,
} from '@ui-construction-library/dnd';
import type React from 'react';
import { type ReactNode, useMemo, useState } from 'react';
import { cn } from '../../../utils/cn';

const DndContextCompat = DndContext as unknown as React.ComponentType<
  React.ComponentProps<typeof DndContext>
>;

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
}

export interface KanbanProps {
  columns: KanbanColumn[];
  onChange?: (columns: KanbanColumn[]) => void;
  className?: string;
  renderCard?: (card: KanbanCard) => ReactNode;
}

function DraggableCard({ card }: { card: KanbanCard }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: card.id,
  });
  const style = { transform: CSS.Translate.toString(transform) };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab rounded border border-slate-200 bg-white p-3 shadow-sm"
    >
      <div className="text-sm font-medium text-slate-900">{card.title}</div>
      {card.description ? (
        <div className="mt-1 text-xs text-slate-600">{card.description}</div>
      ) : null}
    </div>
  );
}

function DroppableColumn({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <section
      ref={setNodeRef}
      className={cn(
        'min-h-40 rounded-lg border p-3',
        isOver
          ? 'border-blue-400 bg-blue-50/40'
          : 'border-slate-200 bg-slate-50'
      )}
    >
      <h3 className="mb-3 text-sm font-semibold text-slate-900">{title}</h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

export function Kanban({
  columns,
  onChange,
  className,
  renderCard,
}: KanbanProps) {
  const [state, setState] = useState(columns);

  const cardToColumn = useMemo(() => {
    const map = new Map<string, string>();
    state.forEach((column) => {
      column.cards.forEach((card) => {
        map.set(card.id, column.id);
      });
    });
    return map;
  }, [state]);

  const moveCard = (cardId: string, targetColumnId: string) => {
    const sourceColumnId = cardToColumn.get(cardId);
    if (!sourceColumnId || sourceColumnId === targetColumnId) return;

    const next = state.map((col) => ({ ...col, cards: [...col.cards] }));
    const source = next.find((c) => c.id === sourceColumnId);
    const target = next.find((c) => c.id === targetColumnId);
    if (!source || !target) return;

    const index = source.cards.findIndex((card) => card.id === cardId);
    if (index < 0) return;

    const [card] = source.cards.splice(index, 1);
    target.cards.push(card);

    setState(next);
    onChange?.(next);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const cardId = String(event.active.id);
    const overId = event.over?.id ? String(event.over.id) : null;
    if (!overId) return;

    const targetColumnId = state.some((column) => column.id === overId)
      ? overId
      : cardToColumn.get(overId);
    if (!targetColumnId) return;

    moveCard(cardId, targetColumnId);
  };

  return (
    <DndContextCompat onDragEnd={onDragEnd}>
      <div className={cn('grid gap-4 sm:grid-cols-3', className)}>
        {state.map((column) => (
          <DroppableColumn key={column.id} id={column.id} title={column.title}>
            {column.cards.map((card) => (
              <div key={card.id}>
                {renderCard ? renderCard(card) : <DraggableCard card={card} />}
              </div>
            ))}
          </DroppableColumn>
        ))}
      </div>
    </DndContextCompat>
  );
}
