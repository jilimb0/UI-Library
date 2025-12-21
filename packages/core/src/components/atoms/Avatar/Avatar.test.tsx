
import {{ render, screen }} from '@testing-library/react';
import {{ axe, toHaveNoViolations }} from 'jest-axe';
import {{ Avatar }} from './{ComponentName}';

expect.extend(toHaveNoViolations);

describe('{ComponentName} component', () => {{
  it('renders without crashing', () => {{
    render(<Avatar>Example</Avatar>);
    expect(screen.getByText('Example')).toBeInTheDocument();
  }});

  it('has no accessibility violations', async () => {{
    const {{ container }} = render(<Avatar>Example</Avatar>);
    const {{ results }} = await axe(container);
    expect(results).toHaveNoViolations();
  }});
}});
