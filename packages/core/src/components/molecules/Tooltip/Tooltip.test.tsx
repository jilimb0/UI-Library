import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Tooltip from './Tooltip';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';

describe('Tooltip', () => {
  it('renders without crashing', () => {
    render(<Tooltip content="Example">Example</Tooltip>);
    expect(
      screen.getByText('Example', { selector: '[data-tooltip-trigger]' })
    ).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Tooltip content="Example">Example</Tooltip>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
