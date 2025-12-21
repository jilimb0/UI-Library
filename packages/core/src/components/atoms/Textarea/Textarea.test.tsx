
import {{ render, screen }} from '@testing-library/react';
import {{ axe, toHaveNoViolations }} from 'jest-axe';
import {{ Textarea }} from './{ComponentName}';

expect.extend(toHaveNoViolations);

describe('{ComponentName} component', () => {{
  it('renders without crashing', () => {{
    render(<Textarea>Example</Textarea>);
    expect(screen.getByText('Example')).toBeInTheDocument();
  }});

  it('has no accessibility violations', async () => {{
    const {{ container }} = render(<Textarea>Example</Textarea>);
    const {{ results }} = await axe(container);
    expect(results).toHaveNoViolations();
  }});
}});
