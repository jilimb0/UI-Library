import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PageTip } from './PageTip';

beforeEach(() => {
  localStorage.clear();
});

describe('PageTip', () => {
  it('renders children', () => {
    render(<PageTip id="test">Tip content</PageTip>);
    expect(screen.getByText('Tip content')).toBeInTheDocument();
  });

  it('renders icon', () => {
    render(
      <PageTip id="test" icon={<span data-testid="icon">i</span>}>
        Content
      </PageTip>
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('dismisses on close button click', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <PageTip id="dismiss-test" onDismiss={onDismiss}>
        Content
      </PageTip>
    );
    await user.click(screen.getByLabelText('Dismiss tip'));
    expect(onDismiss).toHaveBeenCalledWith('dismiss-test');
  });

  it('persists dismissal', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<PageTip id="persist">Content</PageTip>);
    await user.click(screen.getByLabelText('Dismiss tip'));
    unmount();
    render(<PageTip id="persist">Content</PageTip>);
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });
});
