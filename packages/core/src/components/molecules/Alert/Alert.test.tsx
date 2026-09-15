import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Alert } from './Alert';

describe('Alert component', () => {
  it('renders without crashing', () => {
    render(<Alert>Example</Alert>);
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Alert>Example</Alert>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it.each([
    ['default', 'alert--default'],
    ['success', 'alert--success'],
    ['warning', 'alert--warning'],
    ['error', 'alert--error'],
    ['info', 'alert--info'],
  ] as const)('applies the %s variant class', (variant, cls) => {
    const { container } = render(<Alert variant={variant}>X</Alert>);
    expect(container.firstChild).toHaveClass(cls);
  });
});
