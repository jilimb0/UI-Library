
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Tabs } from './Tabs';

expect.extend(toHaveNoViolations);

describe('Tabs', () => {
  it('renders without crashing', () => {
    const { container } = render(<Tabs>Example</Tabs>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Tabs>Example</Tabs>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
