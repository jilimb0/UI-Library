import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  LinkedPanel,
  useWidgetLinkGroup,
  WidgetLinkProvider,
} from './WidgetLinkBus';

const meta: Meta<typeof WidgetLinkProvider> = {
  title: 'Components/Organisms/WidgetLinkBus',
  component: WidgetLinkProvider,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof WidgetLinkProvider>;

function TickerButtons() {
  const { publishEntity } = useWidgetLinkGroup('green');
  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      {['AAPL', 'NVDA', 'MSFT'].map((sym) => (
        <button
          key={sym}
          type="button"
          onClick={() =>
            publishEntity({
              symbol: sym,
              entityType: 'ticker',
              sourceWidgetId: 'story-watchlist',
            })
          }
        >
          {sym}
        </button>
      ))}
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <WidgetLinkProvider
      syncUrl={false}
      initialGroups={{
        green: {
          symbol: 'AAPL',
          entityType: 'ticker',
          sourceWidgetId: 'story-init',
          updatedAtMs: 1,
        },
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '0.75rem',
        }}
      >
        <LinkedPanel
          widgetId="watchlist"
          title="Watchlist"
          defaultGroup="green"
        >
          <TickerButtons />
        </LinkedPanel>
        <LinkedPanel
          widgetId="fundamentals"
          title="Financial Analysis"
          defaultGroup="green"
        >
          <p>Synchronized panel linked to Green group.</p>
        </LinkedPanel>
      </div>
    </WidgetLinkProvider>
  ),
};

export const States: Story = {
  render: () => (
    <WidgetLinkProvider syncUrl={false}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: '0.75rem',
        }}
      >
        <LinkedPanel widgetId="loading" title="Loading" status="loading">
          <div />
        </LinkedPanel>
        <LinkedPanel
          widgetId="empty"
          title="Empty"
          status="empty"
          emptyMessage="No security selected"
        >
          <div />
        </LinkedPanel>
        <LinkedPanel
          widgetId="error"
          title="Error"
          status="error"
          errorMessage="Feed timeout"
          onRetry={() => {}}
        >
          <div />
        </LinkedPanel>
      </div>
    </WidgetLinkProvider>
  ),
};
