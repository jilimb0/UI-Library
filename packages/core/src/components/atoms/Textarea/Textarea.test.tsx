
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Textarea } from './Textarea';

expect.extend(toHaveNoViolations);

describe('Textarea component', () => {
  it('renders without crashing', () => {
    render(<Textarea aria-label="Test textarea">Example</Textarea>);
    expect(screen.getByLabelText('Test textarea')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Textarea aria-label="Test textarea">Example</Textarea>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
