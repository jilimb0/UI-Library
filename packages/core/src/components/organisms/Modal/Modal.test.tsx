
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renders children content', () => {
    render(<Modal isOpen={true}><div>Modal content</div></Modal>);
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('calls onClose when overlay clicked', () => {
    const onClose = jest.fn();
    render(<Modal isOpen={true} onClose={onClose}><div>Modal content</div></Modal>);
    fireEvent.click(screen.getByTestId('modal-overlay'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
