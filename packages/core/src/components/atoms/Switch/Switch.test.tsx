import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from './Switch';

describe('Switch', () => {
  it('renders with an accessible label and description', () => {
    render(<Switch label="Notifications" description="Email and push" />);

    const control = screen.getByRole('switch', {
      name: 'Notifications Email and push',
    });
    expect(control).toBeInTheDocument();
    expect(screen.getByText('Email and push')).toBeInTheDocument();
  });

  it('forwards checked state changes', () => {
    const onCheckedChange = vi.fn();
    render(
      <Switch
        label="Notifications"
        checked={false}
        onCheckedChange={onCheckedChange}
      />
    );

    fireEvent.click(screen.getByRole('switch', { name: 'Notifications' }));

    expect(onCheckedChange).toHaveBeenCalled();
  });
});
