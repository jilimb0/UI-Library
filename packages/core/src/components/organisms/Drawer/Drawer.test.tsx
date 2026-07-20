import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Drawer } from './Drawer';

describe('Drawer', () => {
  it('renders with default props', () => {
    render(
      <Drawer open onOpenChange={() => {}}>
        Content
      </Drawer>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders with correct side class', () => {
    render(
      <Drawer open onOpenChange={() => {}} side="left">
        Content
      </Drawer>
    );
    const content = document.querySelector('.drawer-content');
    expect(content).toHaveClass('drawer-content--left');
  });

  it('renders title and description', () => {
    render(
      <Drawer
        open
        onOpenChange={() => {}}
        title="Settings"
        description="Configure your preferences"
      >
        Content
      </Drawer>
    );
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Configure your preferences')).toBeInTheDocument();
  });

  it('renders close button via Drawer.Close', () => {
    render(
      <Drawer open onOpenChange={() => {}}>
        <Drawer.Close />
      </Drawer>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onOpenChange when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Drawer open onOpenChange={onOpenChange}>
        Content
      </Drawer>
    );
    const backdrop = document.querySelector('.drawer-backdrop');
    if (backdrop) await user.click(backdrop);
    await waitFor(() => expect(onOpenChange).toHaveBeenCalled());
  });
});
