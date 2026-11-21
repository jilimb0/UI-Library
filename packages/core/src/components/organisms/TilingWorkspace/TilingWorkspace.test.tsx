import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TilingWorkspace } from './TilingWorkspace';
import type { TilingTileConfig } from './TilingWorkspace.types';

function makeTiles(count: number): TilingTileConfig[] {
  const groups = [
    'green',
    'blue',
    'red',
    'amber',
    'unlinked',
    'green',
  ] as const;
  return Array.from({ length: count }, (_, idx) => ({
    id: `tile-${idx + 1}`,
    title: `Panel ${idx + 1}`,
    linkGroup: groups[idx % groups.length],
    render: ({ isFocused, linkGroup }) => (
      <div data-testid={`content-tile-${idx + 1}`}>
        {`Tile ${idx + 1} (${linkGroup}) ${isFocused ? 'FOCUSED' : 'IDLE'}`}
      </div>
    ),
  }));
}

describe('TilingWorkspace', () => {
  afterEach(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
  });

  it('caps rendered panels at 6 and assigns workspace panel ARIA metadata', () => {
    render(<TilingWorkspace workspaceId="desk-1" tiles={makeTiles(8)} />);

    const panels = screen.getAllByRole('region');
    expect(panels).toHaveLength(6);
    expect(panels[0]).toHaveAttribute(
      'aria-roledescription',
      'workspace panel'
    );
    expect(panels[0]).toHaveAttribute('aria-label', 'Panel 1');
    expect(screen.queryByTestId('content-tile-7')).not.toBeInTheDocument();
  });

  it('focuses tile 2 on Alt+2 and clears focus on Escape', () => {
    const onFocusTile = vi.fn();
    render(
      <TilingWorkspace
        workspaceId="desk-keys"
        tiles={makeTiles(4)}
        onFocusTile={onFocusTile}
      />
    );

    fireEvent.keyDown(window, { key: '2', code: 'Digit2', altKey: true });

    const tile2 = screen.getByRole('region', { name: 'Panel 2' });
    expect(document.activeElement).toBe(tile2);
    expect(tile2).toHaveAttribute('data-focused', 'true');
    expect(screen.getByTestId('content-tile-2')).toHaveTextContent('FOCUSED');
    expect(onFocusTile).toHaveBeenCalledTimes(1);
    expect(onFocusTile).toHaveBeenCalledWith('tile-2');

    fireEvent.keyDown(tile2, { key: 'Escape' });
    expect(tile2).toHaveAttribute('data-focused', 'false');
    expect(screen.getByTestId('content-tile-2')).toHaveTextContent('IDLE');
  });

  it('switches layout presets and persists to localStorage key ucl-tiling', async () => {
    const user = userEvent.setup();
    const onPresetChange = vi.fn();

    window.localStorage.setItem('ucl-tiling:alpha', '1+2');

    const { unmount } = render(
      <TilingWorkspace
        workspaceId="alpha"
        tiles={makeTiles(3)}
        onPresetChange={onPresetChange}
      />
    );

    const grid = screen.getByTestId('tiling-grid-alpha');
    expect(grid).toHaveAttribute('data-preset', '1+2');

    const btn3x2 = screen.getByRole('button', { name: '3x2' });
    await user.click(btn3x2);

    expect(grid).toHaveAttribute('data-preset', '3x2');
    expect(window.localStorage.getItem('ucl-tiling:alpha')).toBe('3x2');
    expect(onPresetChange).toHaveBeenCalledWith('3x2');

    unmount();

    // Ignores corrupted localStorage safely
    window.localStorage.setItem('ucl-tiling:alpha', 'invalid-preset');
    render(<TilingWorkspace workspaceId="alpha" tiles={makeTiles(3)} />);
    expect(screen.getByTestId('tiling-grid-alpha')).toHaveAttribute(
      'data-preset',
      '2x2'
    );
  });

  it('renders loading, empty, error with retry, and default states', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    const { rerender } = render(
      <TilingWorkspace
        workspaceId="states"
        tiles={makeTiles(2)}
        status="loading"
      />
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByTestId('content-tile-1')).not.toBeInTheDocument();

    rerender(
      <TilingWorkspace
        workspaceId="states"
        tiles={makeTiles(2)}
        status="empty"
        emptyMessage="No tiles active"
      />
    );
    expect(screen.getByText('No tiles active')).toBeInTheDocument();

    rerender(
      <TilingWorkspace
        workspaceId="states"
        tiles={makeTiles(2)}
        status="error"
        errorMessage="Layout failed"
        onRetry={onRetry}
      />
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Layout failed');
    await user.click(screen.getByRole('button', { name: /retry/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders cleanly during SSR and passes axe accessibility checks', async () => {
    const html = renderToString(
      <TilingWorkspace workspaceId="ssr" tiles={makeTiles(2)} preset="2x1" />
    );
    expect(html).toContain('Panel 1');

    const { container } = render(
      <TilingWorkspace workspaceId="a11y" tiles={makeTiles(3)} preset="1+2" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
