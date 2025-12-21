
import {{ render, screen }} from '@testing-library/react';
import {{ axe, toHaveNoViolations }} from 'jest-axe';
import {{ Tabs }} from './{ComponentName}';

expect.extend(toHaveNoViolations);

describe('{ComponentName} component', () => {{
  it('renders without crashing', () => {{
    render(<Tabs>Example</Tabs>);
    expect(screen.getByText('Example')).toBeInTheDocument();
  }});

  it('has no accessibility violations', async () => {{
    const {{ container }} = render(<Tabs>Example</Tabs>);
    const {{ results }} = await axe(container);
    expect(results).toHaveNoViolations();
  }});
}});
