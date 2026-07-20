import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CommandPalette } from './CommandPalette';

const groups = [
  {
    heading: 'Actions',
    items: [
      { id: '1', label: 'Go home', onSelect: vi.fn() },
      { id: '2', label: 'Open settings', onSelect: vi.fn() },
    ],
  },
];

describe('CommandPalette', () => {
  it('renders items', () => {
    render(<CommandPalette open onOpenChange={() => {}} groups={groups} />);
    expect(screen.getByText('Go home')).toBeInTheDocument();
  });

  it('filters by query', async () => {
    const user = userEvent.setup();
    render(<CommandPalette open onOpenChange={() => {}} groups={groups} />);
    const input = screen.getByRole('combobox');
    await user.type(input, 'settings');
    expect(screen.queryByText('Go home')).not.toBeInTheDocument();
  });

  it('selects item and closes', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <CommandPalette
        open
        onOpenChange={onOpenChange}
        groups={[
          {
            heading: 'Test',
            items: [{ id: '1', label: 'Select me', onSelect }],
          },
        ]}
      />
    );
    await user.click(screen.getByText('Select me'));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('navigates with arrow keys and selects with enter', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <CommandPalette
        open
        onOpenChange={() => {}}
        groups={[
          {
            heading: 'Items',
            items: [
              { id: 'a', label: 'First', onSelect: vi.fn() },
              { id: 'b', label: 'Second', onSelect },
            ],
          },
        ]}
      />
    );
    const input = screen.getByRole('combobox');
    await user.type(input, '{ArrowDown}{Enter}');
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('renders empty message when no results', async () => {
    const user = userEvent.setup();
    render(
      <CommandPalette
        open
        onOpenChange={() => {}}
        groups={groups}
        emptyMessage="Nothing found"
      />
    );
    const input = screen.getByRole('combobox');
    await user.type(input, 'zzzzzzzzz');
    expect(screen.getByText('Nothing found')).toBeInTheDocument();
  });

  it('renders custom placeholder', () => {
    render(
      <CommandPalette
        open
        onOpenChange={() => {}}
        groups={groups}
        placeholder="Search..."
      />
    );
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('renders multiple groups', () => {
    render(
      <CommandPalette
        open
        onOpenChange={() => {}}
        groups={[
          {
            heading: 'Section A',
            items: [{ id: 'a1', label: 'Item A', onSelect: vi.fn() }],
          },
          {
            heading: 'Section B',
            items: [{ id: 'b1', label: 'Item B', onSelect: vi.fn() }],
          },
        ]}
      />
    );
    expect(screen.getByText('Section A')).toBeInTheDocument();
    expect(screen.getByText('Section B')).toBeInTheDocument();
  });

  it('renders item with icon', () => {
    render(
      <CommandPalette
        open
        onOpenChange={() => {}}
        groups={[
          {
            heading: 'Test',
            items: [
              {
                id: '1',
                label: 'With icon',
                icon: <span data-testid="icon">*</span>,
                onSelect: vi.fn(),
              },
            ],
          },
        ]}
      />
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});
