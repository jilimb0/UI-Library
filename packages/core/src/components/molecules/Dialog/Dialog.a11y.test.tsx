import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Dialog, DialogClose, DialogDescription, DialogTitle } from './Dialog';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';

describe('Dialog Accessibility', () => {
  it('has no accessibility violations when closed', async () => {
    const { container } = render(
      <Dialog trigger={<button type="button">Open</button>}>
        <DialogTitle>Title</DialogTitle>
        <DialogDescription>Description</DialogDescription>
        <DialogClose>Close</DialogClose>
      </Dialog>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations when open', async () => {
    const { container } = render(
      <Dialog trigger={<button type="button">Open</button>} open>
        <DialogTitle>Title</DialogTitle>
        <DialogDescription>Description</DialogDescription>
        <DialogClose>Close</DialogClose>
      </Dialog>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('dialog has role dialog when open', () => {
    render(
      <Dialog trigger={<button type="button">Open</button>} open>
        <DialogTitle>Title</DialogTitle>
      </Dialog>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('trigger opens dialog on click', async () => {
    const user = userEvent.setup();
    render(
      <Dialog trigger={<button type="button">Open</button>}>
        <DialogTitle>Title</DialogTitle>
      </Dialog>
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
