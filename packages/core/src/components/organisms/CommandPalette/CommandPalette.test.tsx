import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CommandPalette } from './CommandPalette';

describe('CommandPalette', () => {
  const groups = [
    {
      heading: 'Navigation',
      items: [
        {
          id: 'home',
          label: 'Go home',
          keywords: ['dashboard', 'root'],
          onSelect: vi.fn(),
        },
        {
          id: 'settings',
          label: 'Open settings',
          keywords: ['preferences'],
          onSelect: vi.fn(),
        },
      ],
    },
  ];

  it('renders items and filters by query', () => {
    const onOpenChange = vi.fn();
    render(<CommandPalette open onOpenChange={onOpenChange} groups={groups} />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Go home' })).toBeInTheDocument();

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'settings' },
    });

    expect(
      screen.queryByRole('option', { name: 'Go home' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Open settings' })
    ).toBeInTheDocument();
  });

  it('selects an item and closes the palette', () => {
    const onSelect = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <CommandPalette
        open
        onOpenChange={onOpenChange}
        groups={[
          {
            heading: 'Navigation',
            items: [{ id: 'home', label: 'Go home', onSelect }],
          },
        ]}
      />
    );

    fireEvent.click(screen.getByRole('option', { name: 'Go home' }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
