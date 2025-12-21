
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Avatar } from './Avatar';

expect.extend(toHaveNoViolations);

describe('Avatar component', () => {
  it('renders without crashing', () => {
    render(<Avatar />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Avatar />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
