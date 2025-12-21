
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Heading } from './Heading';

expect.extend(toHaveNoViolations);

describe('Heading component', () => {
  it('renders without crashing', () => {
    render(<Heading>Example</Heading>);
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Heading>Example</Heading>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
