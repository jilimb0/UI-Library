import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { StatCard } from './StatCard';

describe('StatCard', () => {
  it('renders metric label, value and positive delta badge', () => {
    render(
      <StatCard
        label="Health Score"
        value="98.4%"
        delta="+14%"
        subtext="Compared to previous sprint"
        tooltip="Healthy code metrics"
      />
    );

    expect(screen.getByText('Health Score')).toBeDefined();
    expect(screen.getByText('98.4%')).toBeDefined();
    expect(screen.getByText(/14%/)).toBeDefined();
    expect(screen.getByText('Compared to previous sprint')).toBeDefined();
  });

  it('renders interactive button when onClick is provided', () => {
    const handleClick = vi.fn();
    render(
      <StatCard
        label="Daily Revenue"
        value="$1,450"
        delta="-3.2%"
        onClick={handleClick}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeDefined();
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalled();
  });
});
