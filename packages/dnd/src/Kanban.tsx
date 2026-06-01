import type React from 'react';
import { type ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import {
  CSS,
  DndContext,
  type DragEndEvent,
  useDraggable,
  useDroppable,
} from './dnd';

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
  style?: React.CSSProperties;
  renderCard?: (card: KanbanCard) => ReactNode;
  renderColumn?: (column: KanbanColumn, children: ReactNode) => ReactNode;
}

function DraggableCard({
  card,
  onKeyboardMove,
}: {
  card: KanbanCard;
  onKeyboardMove: (
    cardId: string,
    direction: 'left' | 'right' | 'up' | 'down'
  ) => void;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: card.id,
  });
  const style = { transform: CSS.Translate.toString(transform) };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        onKeyboardMove(card.id, 'left');
        break;
      case 'ArrowRight':
        e.preventDefault();
        onKeyboardMove(card.id, 'right');
        break;
      case 'ArrowUp':
        e.preventDefault();
        onKeyboardMove(card.id, 'up');
        break;
      case 'ArrowDown':
        e.preventDefault();
        onKeyboardMove(card.id, 'down');
        break;
    }
  };

  return (
    <li>
      <button
        ref={setNodeRef}
        type="button"
        style={style}
        {...listeners}
        {...attributes}
        className="kanban-card"
        aria-roledescription="draggable card"
        aria-label={card.title}
        onKeyDown={handleKeyDown}
      >
        <div className="kanban-card__title">{card.title}</div>
        {card.description ? (
          <div className="field-hint">{card.description}</div>
        ) : null}
      </button>
    </li>
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
      className={['kanban-column', isOver && 'kanban-column--active']
        .filter(Boolean)
        .join(' ')}
      aria-label={title}
    >
      <h3 className="kanban-column__title">{title}</h3>
      <ul className="kanban-column__cards">{children}</ul>
    </section>
  );
}

export function Kanban({
  columns,
  onChange,
  className,
  style,
  renderCard,
  renderColumn,
}: KanbanProps) {
  const [state, setState] = useState(columns);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  const announce = useCallback((message: string) => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = message;
    }
  }, []);

  const cardToColumn = useMemo(() => {
    const map = new Map<string, string>();
    state.forEach((column) => {
      column.cards.forEach((card) => {
        map.set(card.id, column.id);
      });
    });
    return map;
  }, [state]);

  const moveCard = useCallback(
    (cardId: string, targetColumnId: string) => {
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
      announce(`Moved "${card.title}" to "${target.title}"`);
    },
    [state, cardToColumn, onChange, announce]
  );

  const reorderCard = useCallback(
    (cardId: string, direction: 'up' | 'down') => {
      const columnId = cardToColumn.get(cardId);
      if (!columnId) return;

      const next = state.map((col) => ({ ...col, cards: [...col.cards] }));
      const column = next.find((c) => c.id === columnId);
      if (!column) return;

      const index = column.cards.findIndex((card) => card.id === cardId);
      if (index < 0) return;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= column.cards.length) return;

      // Swap
      [column.cards[index], column.cards[targetIndex]] = [
        column.cards[targetIndex],
        column.cards[index],
      ];

      setState(next);
      onChange?.(next);
      announce(
        `Reordered "${column.cards[targetIndex].title}" ${direction} in "${column.title}"`
      );
    },
    [state, cardToColumn, onChange, announce]
  );

  const handleKeyboardMove = useCallback(
    (cardId: string, direction: 'left' | 'right' | 'up' | 'down') => {
      if (direction === 'up' || direction === 'down') {
        reorderCard(cardId, direction);
        return;
      }

      const currentColumnId = cardToColumn.get(cardId);
      if (!currentColumnId) return;

      const columnIndex = state.findIndex((c) => c.id === currentColumnId);
      const targetIndex =
        direction === 'left' ? columnIndex - 1 : columnIndex + 1;
      if (targetIndex < 0 || targetIndex >= state.length) return;

      moveCard(cardId, state[targetIndex].id);
    },
    [state, cardToColumn, moveCard, reorderCard]
  );

  const onDragEnd = (event: DragEndEvent) => {
    const cardId = String(event.active.id);
    const overId = event.over?.id ? String(event.over.id) : null;
    if (!overId) {
      announce('Dropped outside');
      return;
    }

    const targetColumnId = state.some((column) => column.id === overId)
      ? overId
      : cardToColumn.get(overId);
    if (!targetColumnId) return;

    moveCard(cardId, targetColumnId);
  };

  return (
    <DndContextCompat onDragEnd={onDragEnd}>
      {/* ARIA live region for screen reader announcements */}
      <div
        ref={liveRegionRef}
        aria-live="assertive"
        aria-atomic="true"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      />
      <div
        className={['kanban-board', className].filter(Boolean).join(' ')}
        style={style}
      >
        {state.map((column) => {
          const cards = column.cards.map((card) => (
            <div key={card.id}>
              {renderCard ? (
                renderCard(card)
              ) : (
                <DraggableCard
                  card={card}
                  onKeyboardMove={handleKeyboardMove}
                />
              )}
            </div>
          ));

          if (renderColumn) {
            return <div key={column.id}>{renderColumn(column, cards)}</div>;
          }

          return (
            <DroppableColumn
              key={column.id}
              id={column.id}
              title={column.title}
            >
              {cards}
            </DroppableColumn>
          );
        })}
      </div>
    </DndContextCompat>
  );
}
