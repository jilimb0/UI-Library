import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Icon } from './Icon';

describe('Icon', () => {
  it('renders without crashing', () => {
    render(<Icon name="check" />);
    expect(screen.getByTestId('icon-svg')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Icon name="check" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
