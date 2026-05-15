import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Modal } from './index';
import '@testing-library/jest-dom';

describe('Modal focus management', () => {
  it('focuses dialog container on open', async () => {
    render(
      <Modal open onOpenChange={() => {}}>
        <Modal.Content aria-describedby={undefined}>
          <Modal.Title>Focus Test</Modal.Title>
          <button type="button">First</button>
          <button type="button">Second</button>
        </Modal.Content>
      </Modal>
    );

    // Radix в jsdom фокусирует dialog-контейнер
    await waitFor(() =>
      expect(screen.getByRole('dialog')).toContainElement(
        document.activeElement as HTMLElement
      )
    );
  });

  it('moves focus between buttons with Tab', async () => {
    const user = userEvent.setup();
    render(
      <Modal open onOpenChange={() => {}}>
        <Modal.Content aria-describedby={undefined}>
          <Modal.Title>Focus Test</Modal.Title>
          <button type="button">First</button>
          <button type="button">Second</button>
        </Modal.Content>
      </Modal>
    );

    await waitFor(() =>
      expect(screen.getByRole('dialog')).toContainElement(
        document.activeElement as HTMLElement
      )
    );

    screen.getByRole('button', { name: 'First' }).focus();
    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: 'Second' })).toHaveFocus();
  });
});
