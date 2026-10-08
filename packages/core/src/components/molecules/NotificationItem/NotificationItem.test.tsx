import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { NotificationItem } from './NotificationItem';

describe('NotificationItem', () => {
  it('renders notification title, timestamp, and entity name', () => {
    render(
      <NotificationItem
        title="Deployment Succeeded"
        description="Version 0.19.0 deployed to production cluster"
        timestamp="2m ago"
        entityName="RepoRadar"
        unread={true}
      />
    );

    expect(screen.getByText('Deployment Succeeded')).toBeDefined();
    expect(
      screen.getByText('Version 0.19.0 deployed to production cluster')
    ).toBeDefined();
    expect(screen.getByText('2m ago')).toBeDefined();
    expect(screen.getByText('RepoRadar')).toBeDefined();
  });

  it('triggers onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(
      <NotificationItem
        title="New Stars payment received"
        timestamp="Just now"
        onClick={handleClick}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalled();
  });
});
