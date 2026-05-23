import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
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

  it('should have no accessibility violations', async () => {
    const onChange = vi.fn();
    const { container } = render(
      <DatePicker
        selectedDate={null}
        onChange={onChange}
        initialMonth={new Date(2025, 11, 1)}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
