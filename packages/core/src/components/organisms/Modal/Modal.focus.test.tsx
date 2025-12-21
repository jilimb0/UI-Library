
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

describe('Modal Focus Management', () => {
  it('traps focus within modal when open', async () => {
    const user = userEvent.setup();

    render(
      <Modal isOpen={true} onClose={() => {}}>
        <button>First</button>
        <button>Last</button>
      </Modal>
    );

    await user.tab();
    expect(screen.getByText('First')).toHaveFocus();

    await user.keyboard('{Shift>}{Tab}');
    expect(screen.getByText('Last')).toHaveFocus();
  });
});
