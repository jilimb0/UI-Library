import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Kanban, type KanbanColumn } from './Kanban';

const initialColumns: KanbanColumn[] = [
  {
    id: 'todo',
    title: 'To do',
    cards: [{ id: 'card-1', title: 'Card 1' }],
  },
  {
    id: 'doing',
    title: 'Doing',
    cards: [{ id: 'card-2', title: 'Card 2' }],
  },
];

afterEach(() => {
  cleanup();
});

describe('Kanban', () => {
  it('moves card across columns with keyboard arrows', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<Kanban columns={initialColumns} onChange={onChange} />);

    const card = screen.getByRole('button', { name: 'Card 1' });
    card.focus();
    await user.keyboard('{ArrowRight}');

    expect(onChange).toHaveBeenCalled();
    const nextColumns = onChange.mock.calls.at(-1)?.[0] as KanbanColumn[];
    expect(nextColumns[1].cards.some((c) => c.id === 'card-1')).toBe(true);
  });

  it('announces movement through live region', async () => {
    const user = userEvent.setup();
    const { container } = render(<Kanban columns={initialColumns} />);

    const card = screen.getByRole('button', { name: 'Card 1' });
    card.focus();
    await user.keyboard('{ArrowRight}');

    const liveRegion = container.querySelector('[aria-live="assertive"]');
    expect(liveRegion?.textContent).toContain('Moved "Card 1" to "Doing"');
  });

  it('renders with empty columns array', () => {
    const { container } = render(<Kanban columns={[]} />);
    expect(container.querySelector('[aria-live="assertive"]')).toBeTruthy();
  });

  it('renders with single column and single card', () => {
    const { getByRole } = render(
      <Kanban
        columns={[
          {
            id: 'solo',
            title: 'Solo',
            cards: [{ id: 'c1', title: 'Only Card' }],
          },
        ]}
      />
    );
    expect(getByRole('button', { name: 'Only Card' })).toBeTruthy();
  });

  it('reorders cards within the same column with ArrowDown', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const cols: KanbanColumn[] = [
      {
        id: 'col',
        title: 'Column',
        cards: [
          { id: 'a', title: 'A Card' },
          { id: 'b', title: 'B Card' },
        ],
      },
    ];

    render(<Kanban columns={cols} onChange={onChange} />);

    const cardA = screen.getByRole('button', { name: 'A Card' });
    cardA.focus();
    await user.keyboard('{ArrowDown}');

    expect(onChange).toHaveBeenCalled();
    const result = onChange.mock.calls.at(-1)?.[0] as KanbanColumn[];
    expect(result[0].cards[0].id).toBe('b');
    expect(result[0].cards[1].id).toBe('a');
  });

  it('renders with renderCard custom renderer', () => {
    const { container } = render(
      <Kanban
        columns={initialColumns}
        renderCard={(card) => (
          <div data-testid={`custom-${card.id}`}>{card.title}</div>
        )}
      />
    );
    expect(
      container.querySelector('[data-testid="custom-card-1"]')
    ).toBeTruthy();
    expect(
      container.querySelector('[data-testid="custom-card-2"]')
    ).toBeTruthy();
  });

  it('renders with renderColumn custom renderer', () => {
    const { container } = render(
      <Kanban
        columns={initialColumns}
        renderColumn={(column, children) => (
          <div data-testid={`custom-col-${column.id}`}>
            <h4>{column.title}</h4>
            {children}
          </div>
        )}
      />
    );
    expect(
      container.querySelector('[data-testid="custom-col-todo"]')
    ).toBeTruthy();
    expect(
      container.querySelector('[data-testid="custom-col-doing"]')
    ).toBeTruthy();
  });

  it('accepts className and style props', () => {
    const { container } = render(
      <Kanban
        columns={initialColumns}
        className="my-board"
        style={{ backgroundColor: 'red' }}
      />
    );
    const board = container.querySelector('.kanban-board');
    expect(board?.classList.contains('my-board')).toBe(true);
    expect(board?.getAttribute('style')).toContain('background-color');
  });
});
