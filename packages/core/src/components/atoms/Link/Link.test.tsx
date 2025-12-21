
import {{ render, screen }} from '@testing-library/react';
import {{ axe, toHaveNoViolations }} from 'jest-axe';
import {{ Link }} from './{ComponentName}';

expect.extend(toHaveNoViolations);

describe('{ComponentName} component', () => {{
  it('renders without crashing', () => {{
    render(<Link>Example</Link>);
    expect(screen.getByText('Example')).toBeInTheDocument();
  }});

  it('has no accessibility violations', async () => {{
    const {{ container }} = render(<Link>Example</Link>);
    const {{ results }} = await axe(container);
    expect(results).toHaveNoViolations();
  }});
}});
