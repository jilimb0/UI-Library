import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Code } from './Code';

describe('Code', () => {
  it('renders code content with the default class', () => {
    render(<Code>const answer = 42;</Code>);

    const code = screen.getByText('const answer = 42;');
    expect(code.tagName).toBe('CODE');
    expect(code).toHaveClass('code');
  });

  it('merges custom class names', () => {
    render(<Code className="custom-code">Example</Code>);

    expect(screen.getByText('Example')).toHaveClass('code', 'custom-code');
  });
});
