// @vitest-environment node
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { LinkedPanel, WidgetLinkProvider } from './WidgetLinkBus';

describe('WidgetLinkBus SSR (node environment without window)', () => {
  it('renders cleanly via renderToString when window is undefined', () => {
    expect(typeof window).toBe('undefined');

    const html = renderToString(
      <WidgetLinkProvider
        initialGroups={{
          green: {
            symbol: 'AAPL',
            entityType: 'ticker',
            sourceWidgetId: 'server',
            updatedAtMs: 0,
          },
        }}
      >
        <LinkedPanel widgetId="ssr-panel" title="Overview" defaultGroup="green">
          <span>Server HTML</span>
        </LinkedPanel>
      </WidgetLinkProvider>
    );

    expect(html).toContain('Server HTML');
    expect(html).toContain('AAPL');
  });
});
