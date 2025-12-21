
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Text } from './Text';

expect.extend(toHaveNoViolations);

describe('Text', () => {
  it('renders without crashing', () => {
    render(<Text>Example</Text>);
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Text>Example</Text>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
