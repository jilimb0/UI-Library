import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Spinner } from './Spinner';

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
