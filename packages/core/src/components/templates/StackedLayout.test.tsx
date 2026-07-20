import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StackedLayout } from './StackedLayout';

describe('StackedLayout', () => {
  it('renders children', () => {
    render(
      <StackedLayout>
        <div>Content</div>
      </StackedLayout>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders navbar', () => {
    render(
      <StackedLayout navbar={<nav>Nav</nav>}>
        <div>Content</div>
      </StackedLayout>
    );
    expect(screen.getByText('Nav')).toBeInTheDocument();
  });
});
