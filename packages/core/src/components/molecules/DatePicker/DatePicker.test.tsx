import { describe, it, expect, vi } from 'vitest';

import { render, screen, fireEvent } from '@testing-library/react';
import { default as DatePicker } from './DatePicker';
import '@testing-library/jest-dom';

describe('DatePicker', () => {
  it('navigates between months', () => {
    const onChange = vi.fn();

    render(
      <DatePicker
        selectedDate={null}
        onChange={onChange}
        initialMonth={new Date(2025, 11, 1)}
      />
    );

    expect(screen.getByText('December 2025')).toBeInTheDocument();

    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);
    expect(screen.getByText('January 2026')).toBeInTheDocument();

    const prevButton = screen.getByRole('button', { name: /Prev/i });
    fireEvent.click(prevButton);
    expect(screen.getByText('December 2025')).toBeInTheDocument();
  });
});
