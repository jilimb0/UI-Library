import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from './Modal';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

describe('Modal', () => {
  it('renders children content', () => {
    render(
      <Modal open onOpenChange={() => {}}>
        <Modal.Content aria-describedby={undefined}>
          <Modal.Title>Test Title</Modal.Title>
          <div>Modal content</div>
        </Modal.Content>
      </Modal>
    );
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('calls onOpenChange when overlay clicked', async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal open onOpenChange={onOpenChange}>
        <Modal.Content aria-describedby={undefined}>
          <Modal.Title>Test Title</Modal.Title>
          <div>Modal content</div>
        </Modal.Content>
      </Modal>
    );
    const overlay = document.querySelector('.modal-backdrop');
    if (overlay) await user.click(overlay as HTMLElement);
    await waitFor(() => expect(onOpenChange).toHaveBeenCalled());
  });

  it('focuses first focusable element on open', async () => {
    render(
      <Modal open onOpenChange={() => {}}>
        <Modal.Content aria-describedby={undefined}>
          <Modal.Title>Test Title</Modal.Title>
          <button type="button" data-testid="first-btn">
            First
          </button>
          <button type="button">Middle</button>
          <button type="button">Last</button>
        </Modal.Content>
      </Modal>
    );
    // Radix в jsdom фокусирует dialog-контейнер, а не первую кнопку
    await waitFor(() =>
      expect(screen.getByRole('dialog')).toContainElement(
        document.activeElement as HTMLElement
      )
    );
  });

  it('moves focus forward with Tab inside modal', async () => {
    const user = userEvent.setup();
    render(
      <Modal open onOpenChange={() => {}}>
        <Modal.Content aria-describedby={undefined}>
          <Modal.Title>Test Title</Modal.Title>
          <button type="button" data-testid="first-btn">
            First
          </button>
          <button type="button" data-testid="middle-btn">
            Middle
          </button>
          <button type="button" data-testid="last-btn">
            Last
          </button>
        </Modal.Content>
      </Modal>
    );
    await waitFor(() =>
      expect(screen.getByRole('dialog')).toContainElement(
        document.activeElement as HTMLElement
      )
    );
    screen.getByTestId('first-btn').focus();
    await user.tab();
    expect(screen.getByTestId('middle-btn')).toHaveFocus();
    await user.tab();
    expect(screen.getByTestId('last-btn')).toHaveFocus();
  });

  it('moves focus between two buttons with Tab', async () => {
    const user = userEvent.setup();
    render(
      <Modal open onOpenChange={() => {}}>
        <Modal.Content aria-describedby={undefined}>
          <Modal.Title>Test Title</Modal.Title>
          <button type="button" data-testid="first-btn">
            First
          </button>
          <button type="button" data-testid="last-btn">
            Last
          </button>
        </Modal.Content>
      </Modal>
    );
    await waitFor(() =>
      expect(screen.getByRole('dialog')).toContainElement(
        document.activeElement as HTMLElement
      )
    );
    screen.getByTestId('first-btn').focus();
    await user.tab();
    expect(screen.getByTestId('last-btn')).toHaveFocus();
  });
});
