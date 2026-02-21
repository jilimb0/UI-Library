import { describe, it, expect } from 'vitest';

import { render, screen } from '@testing-library/react';
import { Spinner } from './Spinner';
import { axe } from 'jest-axe';

describe('Spinner component', () => {
  it('renders without crashing', () => {
    render(<Spinner />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Spinner />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
