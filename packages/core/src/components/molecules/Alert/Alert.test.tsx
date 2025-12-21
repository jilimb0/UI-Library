
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Alert } from './Alert';

expect.extend(toHaveNoViolations);

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
