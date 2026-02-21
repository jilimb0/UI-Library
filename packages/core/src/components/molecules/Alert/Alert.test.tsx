import { describe, it, expect } from 'vitest';

import { render, screen } from '@testing-library/react';
import { Alert } from './Alert';
import { axe } from 'jest-axe';

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
});
