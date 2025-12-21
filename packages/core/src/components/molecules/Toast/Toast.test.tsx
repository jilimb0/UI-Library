
import { render, screen, fireEvent } from '@testing-library/react';
import { Toast } from './Toast';

describe('Toast', () => {
  it('renders toast message', () => {
    render(<Toast message="Hello" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('auto hides after duration', () => {
    jest.useFakeTimers();
    render(<Toast message="Hide me" duration={3000} />);
    jest.advanceTimersByTime(3000);
    expect(screen.queryByText('Hide me')).not.toBeInTheDocument();
  });
});
