import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Popover } from './Popover';
import '@testing-library/jest-dom';

describe('Popover', () => {
  it('renders popover trigger and content', () => {
    render(
      <Popover trigger="Open Popover" content={<div>Popover Content</div>} />
    );

    const trigger = screen.getByRole('button', { name: /Open Popover/i });
    expect(trigger).toBeInTheDocument();

    // Trigger is accessible, content is not open by default
    expect(screen.queryByText('Popover Content')).not.toBeInTheDocument();

    // Click to open
    fireEvent.click(trigger);
    expect(screen.getByText('Popover Content')).toBeInTheDocument();
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <Popover trigger="Open Popover" content={<div>Popover Content</div>} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('supports controlled open state', () => {
    const onOpenChange = vi.fn();
    render(
      <Popover
        trigger="Open Popover"
        content={<div>Popover Content</div>}
        open
        onOpenChange={onOpenChange}
      />
    );
    expect(screen.getByText('Popover Content')).toBeInTheDocument();
  });
});
