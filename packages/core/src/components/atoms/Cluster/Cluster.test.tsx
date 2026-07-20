import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Cluster } from './Cluster';

describe('Cluster', () => {
  it('renders children', () => {
    render(
      <Cluster>
        <div data-testid="child" />
      </Cluster>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('has inline-cluster class', () => {
    const { container } = render(
      <Cluster>
        <div />
      </Cluster>
    );
    expect(container.firstChild).toHaveClass('inline-cluster');
  });

  it('applies custom gap', () => {
    const { container } = render(
      <Cluster gap="1rem">
        <div />
      </Cluster>
    );
    expect(container.firstChild).toHaveStyle('gap: 1rem');
  });

  it('centers items by default', () => {
    const { container } = render(
      <Cluster>
        <div />
      </Cluster>
    );
    expect(container.firstChild).toHaveStyle('align-items: center');
  });
});
