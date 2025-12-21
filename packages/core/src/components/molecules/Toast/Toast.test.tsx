
import { render, screen } from '@testing-library/react';
import { Toast } from './Toast';

describe('Toast', () => {
  it('renders toast message', () => {
    render(<Toast>Hello</Toast>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('auto hides after duration callback', () => {
    jest.useFakeTimers();
    const onHide = jest.fn();

    render(
      <Toast duration={3000} onAnimationEnd={onHide}>
        Hide me
      </Toast>
    );

    jest.advanceTimersByTime(3000);
    expect(onHide).toHaveBeenCalled();
  });
});
