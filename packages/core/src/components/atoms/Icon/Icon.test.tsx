
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Icon } from './Icon';

expect.extend(toHaveNoViolations);

describe('Icon', () => {
  it('renders without crashing', () => {
    render(<Icon name="CheckIcon" />);
    expect(screen.getByTestId('icon-svg')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Icon name="CheckIcon" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
