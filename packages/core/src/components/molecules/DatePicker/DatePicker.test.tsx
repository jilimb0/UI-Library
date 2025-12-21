
import { render, screen, fireEvent } from '@testing-library/react';
import { DatePicker } from './DatePicker';

describe('DatePicker', () => {
  it('renders calendar interface', () => {
    render(<DatePicker selectedDate={null} onChange={jest.fn()} />);
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('handles date selection', () => {
    const onChange = jest.fn();
    render(<DatePicker selectedDate={null} onChange={onChange} />);

    const dateButton = screen.getByText('15');
    fireEvent.click(dateButton);

    expect(onChange).toHaveBeenCalledWith(expect.any(Date));
  });

  it('navigates between months', () => {
    render(<DatePicker selectedDate={new Date(2025, 0, 1)} onChange={jest.fn()} />);

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(screen.getByText('February 2025')).toBeInTheDocument();
  });
});
