import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { default as DatePicker } from './DatePicker';
import '@testing-library/jest-dom';

const DEFAULT_MONTH = new Date(2025, 11, 1); // December 2025

// Helper to render DatePicker with mock callback
const renderDatePicker = (props = {}) => {
  const onChange = vi.fn();
  render(
    <DatePicker
      selectedDate={null}
      onChange={onChange}
      initialMonth={DEFAULT_MONTH}
      {...props}
    />
  );
  return { onChange };
};

describe('DatePicker Integration Tests', () => {
  it('renders calendar with correct month header', () => {
    renderDatePicker();
    expect(screen.getByText('December 2025')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Prev/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument();
  });

  it('renders days of week headers', () => {
    renderDatePicker();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it('navigates to previous month', async () => {
    const user = userEvent.setup();
    renderDatePicker();

    const prevButton = screen.getByRole('button', { name: /Prev/i });
    await user.click(prevButton);

    expect(screen.getByText('November 2025')).toBeInTheDocument();
  });

  it('navigates to next month', async () => {
    const user = userEvent.setup();
    renderDatePicker();

    const nextButton = screen.getByRole('button', { name: /Next/i });
    await user.click(nextButton);

    expect(screen.getByText('January 2026')).toBeInTheDocument();
  });

  it('selects date cell and calls onChange callback', async () => {
    const user = userEvent.setup();
    const { onChange } = renderDatePicker();

    const dateCells = screen.getAllByRole('cell');

    // Pick a day that is guaranteed to be in the current month
    const day15 = dateCells.find(
      (cell) =>
        cell.textContent === '15' &&
        !(cell.className || '').includes('text-gray-400')
    );

    expect(day15).toBeDefined();

    await user.click(day15!);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(expect.any(Date));
  });
});
