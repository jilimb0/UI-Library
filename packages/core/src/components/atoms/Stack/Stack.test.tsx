import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Stack } from './Stack';

describe('Stack', () => {
  it('renders children', () => {
    render(
      <Stack>
        <div data-testid="child" />
      </Stack>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('uses vertical class by default', () => {
    const { container } = render(
      <Stack>
        <div />
      </Stack>
    );
    expect(container.firstChild).toHaveClass('stack-vertical');
  });

  it('uses horizontal class when direction is horizontal', () => {
    const { container } = render(
      <Stack direction="horizontal">
        <div />
      </Stack>
    );
    expect(container.firstChild).toHaveClass('stack-horizontal');
  });

  it('applies custom gap', () => {
    const { container } = render(
      <Stack gap="2rem">
        <div />
      </Stack>
    );
    expect(container.firstChild).toHaveStyle('gap: 2rem');
  });

  it('applies numeric gap as rem', () => {
    const { container } = render(
      <Stack gap={2}>
        <div />
      </Stack>
    );
    expect(container.firstChild).toHaveStyle('gap: 2rem');
  });

  it('applies align and justify', () => {
    const { container } = render(
      <Stack align="center" justify="space-between">
        <div />
      </Stack>
    );
    expect(container.firstChild).toHaveStyle('align-items: center');
    expect(container.firstChild).toHaveStyle('justify-content: space-between');
  });
});
