import { describe, it, expect } from 'vitest';

import { render, screen } from '@testing-library/react';
import { Icon } from './Icon';
import { axe } from 'jest-axe';

describe('Icon', () => {
  it('renders without crashing', () => {
    render(<Icon name="Check" />);
    expect(screen.getByTestId('icon-svg')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Icon name="Check" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
