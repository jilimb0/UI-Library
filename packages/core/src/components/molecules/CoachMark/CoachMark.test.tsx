import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CoachMark } from './CoachMark';

beforeEach(() => {
  localStorage.clear();
});

describe('CoachMark', () => {
  it('renders children', () => {
    render(<CoachMark id="test">Hello</CoachMark>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(
      <CoachMark id="test" title="Tip">
        Content
      </CoachMark>
    );
    expect(screen.getByText('Tip')).toBeInTheDocument();
  });

  it('renders dismiss button with default label', () => {
    render(<CoachMark id="test">Content</CoachMark>);
    expect(screen.getByText('Got it')).toBeInTheDocument();
  });

  it('renders custom dismiss label', () => {
    render(
      <CoachMark id="test" dismissLabel="OK">
        Content
      </CoachMark>
    );
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  it('dismisses and persists', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const { unmount } = render(
      <CoachMark id="persist-test" onDismiss={onDismiss}>
        Content
      </CoachMark>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
    await user.click(screen.getByText('Got it'));
    expect(onDismiss).toHaveBeenCalledWith('persist-test');
    unmount();
    render(<CoachMark id="persist-test">Content</CoachMark>);
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('uses custom storage key', async () => {
    const user = userEvent.setup();
    render(
      <CoachMark id="custom" storageKey="custom-key">
        Content
      </CoachMark>
    );
    await user.click(screen.getByText('Got it'));
    const stored = JSON.parse(localStorage.getItem('custom-key') ?? '[]');
    expect(stored).toContain('custom');
  });
});
