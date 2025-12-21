
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Navigation } from './Navigation';

expect.extend(toHaveNoViolations);

describe('Navigation component', () => {
  it('renders without crashing', () => {
    render(<Navigation>Example</Navigation>);
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Navigation>Example</Navigation>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
