import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  LinkedPanel,
  useWidgetLinkGroup,
  useWidgetLinkPublisher,
  WidgetLinkProvider,
} from './WidgetLinkBus';
import type { WidgetColorGroup } from './WidgetLinkBus.types';

function SubscriberProbe({
  group,
  widgetId,
}: {
  group: WidgetColorGroup;
  widgetId: string;
}) {
  const { entity, publishEntity } = useWidgetLinkGroup(group);
  const publishQuick = useWidgetLinkPublisher(group, widgetId);

  return (
    <div data-testid={`probe-${widgetId}`}>
      <span data-testid={`value-${widgetId}`}>{entity?.symbol ?? 'NONE'}</span>
      <span data-testid={`tf-${widgetId}`}>{entity?.timeframe ?? ''}</span>
      <button
        type="button"
        onClick={() =>
          publishEntity({
            symbol: 'NVDA',
            entityType: 'ticker',
            timeframe: '1D',
            sourceWidgetId: widgetId,
          })
        }
      >
        Publish-{widgetId}
      </button>
      <button
        type="button"
        onClick={() =>
          publishQuick({
            symbol: 'MSFT',
            entityType: 'ticker',
            timeframe: '1W',
          })
        }
      >
        Quick-{widgetId}
      </button>
    </div>
  );
}

describe('WidgetLinkBus', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '/');
    }
  });

  it('publishes to green group without affecting blue or unlinked subscribers', async () => {
    const user = userEvent.setup();
    render(
      <WidgetLinkProvider syncUrl={false}>
        <SubscriberProbe group="green" widgetId="g1" />
        <SubscriberProbe group="green" widgetId="g2" />
        <SubscriberProbe group="blue" widgetId="b1" />
        <SubscriberProbe group="unlinked" widgetId="u1" />
      </WidgetLinkProvider>
    );

    expect(screen.getByTestId('value-g1')).toHaveTextContent('NONE');
    expect(screen.getByTestId('value-g2')).toHaveTextContent('NONE');
    expect(screen.getByTestId('value-b1')).toHaveTextContent('NONE');
    expect(screen.getByTestId('value-u1')).toHaveTextContent('NONE');

    await user.click(screen.getByRole('button', { name: 'Publish-g1' }));

    expect(screen.getByTestId('value-g1')).toHaveTextContent('NVDA');
    expect(screen.getByTestId('value-g2')).toHaveTextContent('NVDA');
    expect(screen.getByTestId('value-b1')).toHaveTextContent('NONE');
    expect(screen.getByTestId('value-u1')).toHaveTextContent('NONE');

    await user.click(screen.getByRole('button', { name: 'Quick-u1' }));
    expect(screen.getByTestId('value-u1')).toHaveTextContent('NONE');

    await user.click(screen.getByRole('button', { name: 'Quick-g2' }));
    expect(screen.getByTestId('value-g1')).toHaveTextContent('MSFT');
    expect(screen.getByTestId('tf-g1')).toHaveTextContent('1W');
  });

  it('prevents BroadcastChannel echo loops for identical sourceWidgetId and updatedAtMs', async () => {
    const user = userEvent.setup();
    const instances: MockBroadcastChannel[] = [];
    const postSpy = vi.fn();

    class MockBroadcastChannel {
      name: string;
      onmessage: ((event: MessageEvent) => void) | null = null;
      closed = false;

      constructor(name: string) {
        this.name = name;
        instances.push(this);
      }

      postMessage(data: unknown) {
        postSpy(data);
        // Simulate echo back to the sender listener
        this.onmessage?.({ data } as MessageEvent);
      }

      close() {
        this.closed = true;
      }
    }

    vi.stubGlobal('BroadcastChannel', MockBroadcastChannel);
    const onGroupChange = vi.fn();

    const { unmount } = render(
      <WidgetLinkProvider syncUrl={false} onGroupChange={onGroupChange}>
        <SubscriberProbe group="green" widgetId="echo-widget" />
      </WidgetLinkProvider>
    );

    await user.click(
      screen.getByRole('button', { name: 'Publish-echo-widget' })
    );

    // Only one publish notification, no echo loop
    expect(postSpy).toHaveBeenCalledTimes(1);
    expect(onGroupChange).toHaveBeenCalledTimes(1);

    // Delivering the exact same payload again via BroadcastChannel does not trigger re-emit
    const sent = postSpy.mock.calls[0][0];
    act(() => {
      instances[0].onmessage?.({ data: sent } as MessageEvent);
    });
    expect(onGroupChange).toHaveBeenCalledTimes(1);

    // Delivering an update from another tab DOES update local state without re-posting
    act(() => {
      instances[0].onmessage?.({
        data: {
          group: 'green',
          payload: {
            symbol: 'TSLA',
            entityType: 'ticker',
            sourceWidgetId: 'remote-tab',
            updatedAtMs: sent.payload.updatedAtMs + 50,
          },
        },
      } as MessageEvent);
    });
    expect(screen.getByTestId('value-echo-widget')).toHaveTextContent('TSLA');
    expect(postSpy).toHaveBeenCalledTimes(1);
    expect(onGroupChange).toHaveBeenCalledTimes(2);

    unmount();
    expect(instances[0].closed).toBe(true);
  });

  it('hydrates initial groups from ?g_green=AAPL URL query and syncs updates', async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, '', '/?g_green=AAPL&g_blue=BTCUSDT');

    render(
      <WidgetLinkProvider>
        <SubscriberProbe group="green" widgetId="url-g" />
        <SubscriberProbe group="blue" widgetId="url-b" />
      </WidgetLinkProvider>
    );

    expect(screen.getByTestId('value-url-g')).toHaveTextContent('AAPL');
    expect(screen.getByTestId('value-url-b')).toHaveTextContent('BTCUSDT');

    await user.click(screen.getByRole('button', { name: 'Publish-url-g' }));
    expect(window.location.search).toContain('g_green=NVDA');
  });

  it('clears a group across state, URL query params, and BroadcastChannel', async () => {
    const user = userEvent.setup();
    const postSpy = vi.fn();
    const onGroupChange = vi.fn();
    let activeChannel: {
      onmessage: ((event: MessageEvent) => void) | null;
    } | null = null;

    class MockClearChannel {
      onmessage: ((event: MessageEvent) => void) | null = null;
      constructor() {
        activeChannel = this;
      }
      postMessage(data: unknown) {
        postSpy(data);
      }
      close() {}
    }

    vi.stubGlobal('BroadcastChannel', MockClearChannel);
    window.history.replaceState(null, '', '/?g_green=AAPL&g_blue=MSFT');

    function ClearProbe() {
      const { entity, clearGroup } = useWidgetLinkGroup('green');
      return (
        <div>
          <span data-testid="clear-value">{entity?.symbol ?? 'EMPTY'}</span>
          <button type="button" onClick={clearGroup}>
            Clear-Green
          </button>
        </div>
      );
    }

    render(
      <WidgetLinkProvider onGroupChange={onGroupChange}>
        <ClearProbe />
        <SubscriberProbe group="blue" widgetId="b-keep" />
      </WidgetLinkProvider>
    );

    expect(screen.getByTestId('clear-value')).toHaveTextContent('AAPL');

    await user.click(screen.getByRole('button', { name: 'Clear-Green' }));
    expect(screen.getByTestId('clear-value')).toHaveTextContent('EMPTY');
    expect(window.location.search).not.toContain('g_green=');
    expect(window.location.search).toContain('g_blue=MSFT');
    expect(postSpy).toHaveBeenCalledWith({ group: 'green', payload: null });
    expect(onGroupChange).toHaveBeenCalledWith('green', null);

    // Remote null broadcast clears blue group without echoing back
    act(() => {
      activeChannel?.onmessage?.({
        data: { group: 'blue', payload: null },
      } as MessageEvent);
    });
    expect(screen.getByTestId('value-b-keep')).toHaveTextContent('NONE');
    expect(postSpy).toHaveBeenCalledTimes(1);
  });

  it('renders cleanly during SSR with renderToString', () => {
    const html = renderToString(
      <WidgetLinkProvider
        initialGroups={{
          green: {
            symbol: 'AAPL',
            entityType: 'ticker',
            sourceWidgetId: 'ssr',
            updatedAtMs: 1,
          },
        }}
      >
        <LinkedPanel widgetId="p1" title="Chart" defaultGroup="green">
          <div>SSR Content</div>
        </LinkedPanel>
      </WidgetLinkProvider>
    );

    expect(html).toContain('SSR Content');
    expect(html).toContain('AAPL');
  });

  it('supports LinkedPanel radiogroup G/B/R/A/— selection, keyboard arrows, 4 UI states, and axe a11y', async () => {
    const user = userEvent.setup();
    const onGroupChange = vi.fn();
    const onRetry = vi.fn();

    const { container, rerender } = render(
      <WidgetLinkProvider syncUrl={false}>
        <LinkedPanel
          widgetId="panel-1"
          title="Watchlist"
          defaultGroup="green"
          onGroupChange={onGroupChange}
          status="default"
        >
          <div>Panel Body</div>
        </LinkedPanel>
      </WidgetLinkProvider>
    );

    const radiogroup = screen.getByRole('radiogroup', {
      name: /widget link color group/i,
    });
    expect(radiogroup).toBeInTheDocument();

    const greenRadio = screen.getByRole('radio', { name: /green/i });
    const blueRadio = screen.getByRole('radio', { name: /blue/i });
    expect(greenRadio).toHaveAttribute('aria-checked', 'true');
    expect(blueRadio).toHaveAttribute('aria-checked', 'false');

    // Keyboard ArrowRight switches green -> blue
    greenRadio.focus();
    fireEvent.keyDown(greenRadio, { key: 'ArrowRight' });
    expect(blueRadio).toHaveAttribute('aria-checked', 'true');
    expect(onGroupChange).toHaveBeenCalledWith('blue');

    // Axe check in default state
    const results = await axe(container);
    expect(results).toHaveNoViolations();

    // Loading state
    rerender(
      <WidgetLinkProvider syncUrl={false}>
        <LinkedPanel widgetId="panel-1" title="Watchlist" status="loading">
          <div>Panel Body</div>
        </LinkedPanel>
      </WidgetLinkProvider>
    );
    expect(screen.queryByText('Panel Body')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();

    // Empty state
    rerender(
      <WidgetLinkProvider syncUrl={false}>
        <LinkedPanel
          widgetId="panel-1"
          title="Watchlist"
          status="empty"
          emptyMessage="No tickers pinned"
        >
          <div>Panel Body</div>
        </LinkedPanel>
      </WidgetLinkProvider>
    );
    expect(screen.getByText('No tickers pinned')).toBeInTheDocument();

    // Error state with retry
    rerender(
      <WidgetLinkProvider syncUrl={false}>
        <LinkedPanel
          widgetId="panel-1"
          title="Watchlist"
          status="error"
          errorMessage="Feed disconnected"
          onRetry={onRetry}
        >
          <div>Panel Body</div>
        </LinkedPanel>
      </WidgetLinkProvider>
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Feed disconnected');
    await user.click(screen.getByRole('button', { name: /retry/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
