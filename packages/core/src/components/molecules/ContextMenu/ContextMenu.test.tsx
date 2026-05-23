import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { ContextMenu } from './ContextMenu';

describe('ContextMenu', () => {
  it('opens on context menu and triggers enabled item action', async () => {
    const onOpen = vi.fn();
    const onDelete = vi.fn();
    const user = userEvent.setup();

    render(
      <ContextMenu
        trigger={<button type="button">Open menu</button>}
        items={[
          { id: 'open', label: 'Open', onSelect: onOpen },
          { id: 'delete', label: 'Delete', onSelect: onDelete, disabled: true },
        ]}
      />
    );

    const trigger = screen.getByRole('button', { name: 'Open menu' });
    await user.pointer([{ target: trigger, keys: '[MouseRight]' }]);

    const openItem = await screen.findByRole('menuitem', { name: 'Open' });
    const disabledItem = screen.getByRole('menuitem', { name: 'Delete' });

    await user.click(openItem);
    expect(onOpen).toHaveBeenCalledTimes(1);

    await user.click(disabledItem);
    expect(onDelete).not.toHaveBeenCalled();
    expect(disabledItem).toHaveAttribute('aria-disabled', 'true');
  });

  it('has no accessibility violations when opened', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ContextMenu
        trigger={<button type="button">Open menu</button>}
        items={[{ id: 'open', label: 'Open', onSelect: vi.fn() }]}
      />
    );

    await user.pointer([
      {
        target: screen.getByRole('button', { name: 'Open menu' }),
        keys: '[MouseRight]',
      },
    ]);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
