import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Calendar } from './Calendar';

describe('Calendar', () => {
  it('renders a month grid and event labels', () => {
    render(
      <Calendar events={[{ id: '1', date: new Date(), title: 'Standup' }]} />
    );

    expect(screen.getByRole('button', { name: 'Prev' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(screen.getByText('Standup')).toBeInTheDocument();
  });

  it('navigates to the next month', () => {
    render(<Calendar />);

    const initialHeading = screen.getByRole('heading', {
      level: 3,
    }).textContent;
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByRole('heading', { level: 3 }).textContent).not.toBe(
      initialHeading
    );
  });
});
