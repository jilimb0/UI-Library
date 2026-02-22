import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './index';

describe('Modal focus management', () => {
  it('focuses first focusable element on open and traps tab', async () => {
    const user = userEvent.setup();
    render(
      <Modal isOpen onClose={() => {}}>
        <button type="button">First</button>
        <button type="button">Second</button>
      </Modal>
    );

    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: 'Second' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
  });
});
