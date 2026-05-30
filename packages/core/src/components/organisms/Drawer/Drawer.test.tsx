import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Drawer } from './Drawer';

describe('Drawer', () => {
  it('renders title, description, and content in a dialog', () => {
    const onOpenChange = vi.fn();

    render(
      <Drawer
        open
        onOpenChange={onOpenChange}
        title="Settings"
        description="Manage preferences"
      >
        <div>Drawer body</div>
      </Drawer>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Manage preferences')).toBeInTheDocument();
    expect(screen.getByText('Drawer body')).toBeInTheDocument();
  });

  it('applies the selected side class', () => {
    render(
      <Drawer open onOpenChange={() => {}} side="left">
        <div>Content</div>
      </Drawer>
    );

    expect(screen.getByRole('dialog')).toHaveClass('drawer-content--left');
  });
});
