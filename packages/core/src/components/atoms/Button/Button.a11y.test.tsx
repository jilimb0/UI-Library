import { describe, it, expect, vi } from 'vitest';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';
import React from 'react';
import '@testing-library/jest-dom';

describe('Button Accessibility', () => {
  it('should have proper ARIA attributes', () => {
    render(<Button aria-label="Custom label">Icon only</Button>);
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Custom label'
    );
  });

  it('should support keyboard navigation', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Test</Button>);

    await user.tab();
    expect(screen.getByRole('button')).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalled();
  });
});
