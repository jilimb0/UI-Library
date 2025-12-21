
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Form } from './Form';

expect.extend(toHaveNoViolations);

describe('Form', () => {
  it('renders without crashing', () => {
    render(<Form>Example</Form>);
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Form>Example</Form>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
