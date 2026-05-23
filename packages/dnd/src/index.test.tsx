import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CSS, DndContext, useDraggable, useDroppable } from './index';

function Harness() {
  const draggable = useDraggable({ id: 'card-1' });
  const droppable = useDroppable({ id: 'column-1' });

  return (
    <div>
      <div ref={droppable.setNodeRef} data-testid="drop-zone">
        zone:{String(droppable.isOver)}
      </div>
      <button ref={draggable.setNodeRef} {...draggable.attributes}>
        drag
      </button>
    </div>
  );
}

describe('@ui-construction-library/dnd', () => {
  it('renders draggable/droppable hooks inside context', () => {
    const { getByTestId, getByRole } = render(
      <DndContext>
        <Harness />
      </DndContext>
    );

    expect(getByTestId('drop-zone')).toBeTruthy();
    expect(getByRole('button', { name: 'drag' })).toBeTruthy();
  });

  it('formats CSS transforms', () => {
    expect(CSS.Translate.toString({ x: 12, y: -4 })).toBe(
      'translate3d(12px, -4px, 0)'
    );
    expect(CSS.Translate.toString(null)).toBeUndefined();
  });
});
