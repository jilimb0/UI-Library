import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders without crashing', () => {
    render(<Badge>Example</Badge>);
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Badge>Example</Badge>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it.each([
    ['default', 'badge--default'],
    ['success', 'badge--success'],
    ['warning', 'badge--warning'],
    ['error', 'badge--error'],
    ['info', 'badge--info'],
  ] as const)('applies the %s variant class', (variant, cls) => {
    const { container } = render(<Badge variant={variant}>X</Badge>);
    expect(container.firstChild).toHaveClass(cls);
  });
});
