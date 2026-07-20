import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { KpiGrid } from './KpiGrid';

describe('KpiGrid', () => {
  it('renders children', () => {
    render(
      <KpiGrid>
        <div data-testid="child">A</div>
        <div data-testid="child">B</div>
      </KpiGrid>
    );
    expect(screen.getAllByTestId('child')).toHaveLength(2);
  });

  it('applies custom column count as inline style', () => {
    const { container } = render(
      <KpiGrid columns={3}>
        <div />
      </KpiGrid>
    );
    expect(container.firstChild).toHaveStyle(
      'grid-template-columns: repeat(3, minmax(0, 1fr))'
    );
  });

  it('uses auto-fill grid by default', () => {
    const { container } = render(
      <KpiGrid>
        <div />
      </KpiGrid>
    );
    expect(container.firstChild).not.toHaveAttribute('style');
  });
});
