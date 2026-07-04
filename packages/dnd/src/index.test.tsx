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

  it('formats CSS transform with zero coordinates', () => {
    expect(CSS.Translate.toString({ x: 0, y: 0 })).toBe(
      'translate3d(0px, 0px, 0)'
    );
  });

  it('renders children inside DndContext wrapper', () => {
    const { container } = render(
      <DndContext>
        <div data-testid="child">content</div>
      </DndContext>
    );
    expect(container.querySelector('[data-testid="child"]')).toBeTruthy();
  });

  it('renders with fragment children', () => {
    const { container } = render(
      <DndContext>
        <span data-testid="a">A</span>
        <span data-testid="b">B</span>
      </DndContext>
    );
    expect(container.querySelector('[data-testid="a"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="b"]')).toBeTruthy();
  });

  it('useDraggable returns correct attributes structure', () => {
    function Probe() {
      const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: 'test-1',
      });
      expect(attributes).toHaveProperty('data-draggable-id', 'test-1');
      expect(attributes).toHaveProperty('role', 'button');
      expect(attributes).toHaveProperty('tabIndex', 0);
      expect(typeof listeners.onPointerDown).toBe('function');
      expect(typeof setNodeRef).toBe('function');
      expect(transform).toBeNull();
      return null;
    }
    render(
      <DndContext>
        <Probe />
      </DndContext>
    );
  });

  it('useDroppable returns default isOver as false', () => {
    function Probe() {
      const { isOver, setNodeRef } = useDroppable({ id: 'col-1' });
      expect(isOver).toBe(false);
      expect(typeof setNodeRef).toBe('function');
      return null;
    }
    render(
      <DndContext>
        <Probe />
      </DndContext>
    );
  });

  it('useDraggable and useDroppable accept numeric ids', () => {
    function Probe() {
      const draggable = useDraggable({ id: 42 });
      const droppable = useDroppable({ id: 99 });
      expect(
        (draggable.attributes as Record<string, unknown>)['data-draggable-id']
      ).toBe('42');
      expect(droppable.isOver).toBe(false);
      return null;
    }
    render(
      <DndContext>
        <Probe />
      </DndContext>
    );
  });
});
