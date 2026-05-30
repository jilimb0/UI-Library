import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders title, description, icon, and action', () => {
    render(
      <EmptyState
        icon={<span>Icon</span>}
        title="Nothing here"
        description="Try again later"
        action={<button type="button">Refresh</button>}
      />
    );

    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
    expect(screen.getByText('Try again later')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument();
  });
});
