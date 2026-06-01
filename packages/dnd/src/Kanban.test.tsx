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
});
