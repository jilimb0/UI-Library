import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import {
  useWidgetLinkGroup,
  WidgetLinkProvider,
} from '../WidgetLinkBus/WidgetLinkBus';
import { SynchronizedChartGrid } from './SynchronizedChartGrid';
import type { SynchronizedChartPanelData } from './SynchronizedChartGrid.types';

const SAMPLE_PANELS: SynchronizedChartPanelData[] = [
  {
    id: 'price-panel',
    title: 'Price',
    domain: 'price',
    unitLabel: 'USD',
    linkGroup: 'green',
    series: [
      {
        timestampMs: 1_700_000_000_000,
        label: 'Q1',
        valueScaled: 18500,
        scaleDecimals: 2,
        formattedValue: '$185.00',
      },
      {
        timestampMs: 1_700_100_000_000,
        label: 'Q2',
        valueScaled: 19250,
        scaleDecimals: 2,
        formattedValue: '$192.50',
      },
      {
        timestampMs: 1_700_200_000_000,
        label: 'Q3',
        valueScaled: 21000,
        scaleDecimals: 2,
        formattedValue: '$210.00',
      },
    ],
    thresholdLines: [{ label: 'Target', valueScaled: 20000, tone: 'warning' }],
  },
  {
    id: 'pe-panel',
    title: 'Forward P/E',
    domain: 'valuation_multiple',
    unitLabel: 'x',
    linkGroup: 'green',
    series: [
      {
        timestampMs: 1_700_000_000_000,
        label: 'Q1',
        valueScaled: 2450,
        scaleDecimals: 2,
        formattedValue: '24.50x',
      },
      {
        timestampMs: 1_700_100_000_000,
        label: 'Q2',
        valueScaled: 2610,
        scaleDecimals: 2,
        formattedValue: '26.10x',
      },
      {
        timestampMs: 1_700_200_000_000,
        label: 'Q3',
        valueScaled: 2890,
        scaleDecimals: 2,
        formattedValue: '28.90x',
      },
    ],
  },
];

function GreenGroupObserver() {
  const { entity } = useWidgetLinkGroup('green');
  return (
    <div data-testid="bus-observer">
      {entity ? `${entity.symbol}:${entity.timeframe ?? ''}` : 'EMPTY'}
    </div>
  );
}

describe('SynchronizedChartGrid', () => {
  it('synchronizes crosshair across all panels on hover and emits onActiveIndexChange', () => {
    const onActiveIndexChange = vi.fn();
    render(
      <SynchronizedChartGrid
        panels={SAMPLE_PANELS}
        onActiveIndexChange={onActiveIndexChange}
      />
    );

    const hitTarget = screen.getByTestId('chart-hit-price-panel-1');
    fireEvent.mouseEnter(hitTarget);

    expect(onActiveIndexChange).toHaveBeenCalledWith(1, 1_700_100_000_000);
    expect(screen.getByTestId('chart-panel-price-panel')).toHaveAttribute(
      'data-active-index',
      '1'
    );
    expect(screen.getByTestId('chart-panel-pe-panel')).toHaveAttribute(
      'data-active-index',
      '1'
    );
    expect(
      screen.getByTestId('chart-active-value-price-panel')
    ).toHaveTextContent('$192.50');
    expect(screen.getByTestId('chart-active-value-pe-panel')).toHaveTextContent(
      '26.10x'
    );
    expect(
      screen.getByTestId('crosshair-line-price-panel')
    ).toBeInTheDocument();
    expect(screen.getByTestId('crosshair-line-pe-panel')).toBeInTheDocument();
  });

  it('synchronizes crosshair with ArrowRight/ArrowLeft and publishes to WidgetLinkBus', () => {
    render(
      <WidgetLinkProvider
        syncUrl={false}
        initialGroups={{
          green: {
            symbol: 'AAPL',
            entityType: 'ticker',
            sourceWidgetId: 'init',
            updatedAtMs: 1,
          },
        }}
      >
        <GreenGroupObserver />
        <SynchronizedChartGrid panels={SAMPLE_PANELS} />
      </WidgetLinkProvider>
    );

    const slider = screen.getByRole('slider', { name: /price crosshair/i });
    slider.focus();
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(screen.getByTestId('chart-panel-pe-panel')).toHaveAttribute(
      'data-active-index',
      '0'
    );
    expect(screen.getByTestId('bus-observer')).toHaveTextContent('AAPL:Q1');

    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(screen.getByTestId('chart-panel-pe-panel')).toHaveAttribute(
      'data-active-index',
      '1'
    );
    expect(screen.getByTestId('bus-observer')).toHaveTextContent('AAPL:Q2');

    fireEvent.keyDown(slider, { key: 'ArrowLeft' });
    expect(screen.getByTestId('chart-panel-pe-panel')).toHaveAttribute(
      'data-active-index',
      '0'
    );

    fireEvent.keyDown(slider, { key: 'End' });
    expect(screen.getByTestId('chart-panel-pe-panel')).toHaveAttribute(
      'data-active-index',
      '2'
    );

    fireEvent.keyDown(slider, { key: 'Home' });
    expect(screen.getByTestId('chart-panel-pe-panel')).toHaveAttribute(
      'data-active-index',
      '0'
    );

    fireEvent.keyDown(slider, { key: 'Escape' });
    expect(screen.getByTestId('chart-panel-pe-panel')).toHaveAttribute(
      'data-active-index',
      ''
    );
  });

  it('guards against non-finite valueScaled without throwing or emitting NaN', () => {
    const badPanels: SynchronizedChartPanelData[] = [
      {
        id: 'bad-panel',
        title: 'Malformed',
        domain: 'spread_zscore',
        unitLabel: 'z',
        series: [
          {
            timestampMs: 1,
            label: 'T1',
            valueScaled: Number.NaN,
            scaleDecimals: 2,
            formattedValue: '0.00',
          },
          {
            timestampMs: 2,
            label: 'T2',
            valueScaled: 150,
            scaleDecimals: 2,
            formattedValue: '1.50',
          },
        ],
      },
    ];

    const { container } = render(<SynchronizedChartGrid panels={badPanels} />);
    expect(container.innerHTML).not.toContain('NaN');
  });

  it('handles flat/single-point series and empty panel series cleanly without NaN', () => {
    const edgePanels: SynchronizedChartPanelData[] = [
      {
        id: 'flat',
        title: 'Flat',
        domain: 'macro',
        unitLabel: '%',
        series: [
          {
            timestampMs: 1,
            label: 'Jan',
            valueScaled: 500,
            scaleDecimals: 2,
            formattedValue: '5.00%',
          },
        ],
      },
      {
        id: 'empty-series',
        title: 'Empty Series',
        domain: 'spread_zscore',
        unitLabel: 'z',
        series: [],
      },
    ];

    const { container } = render(<SynchronizedChartGrid panels={edgePanels} />);
    expect(container.innerHTML).not.toContain('NaN');
    expect(screen.getByText('No series data')).toBeInTheDocument();
  });

  it('supports loading, empty, and error states with retry callback', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    const { rerender } = render(
      <SynchronizedChartGrid panels={SAMPLE_PANELS} status="loading" />
    );
    expect(screen.getByRole('status')).toBeInTheDocument();

    rerender(
      <SynchronizedChartGrid
        panels={SAMPLE_PANELS}
        status="empty"
        emptyMessage="No chart feeds"
      />
    );
    expect(screen.getByText('No chart feeds')).toBeInTheDocument();

    rerender(
      <SynchronizedChartGrid
        panels={SAMPLE_PANELS}
        status="error"
        errorMessage="Market stream down"
        onRetry={onRetry}
      />
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Market stream down');
    await user.click(screen.getByRole('button', { name: /retry/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders cleanly during SSR and passes axe accessibility checks', async () => {
    const html = renderToString(
      <SynchronizedChartGrid panels={SAMPLE_PANELS} />
    );
    expect(html).toContain('Price');
    expect(html).toContain('Forward P/E');

    const { container } = render(
      <SynchronizedChartGrid panels={SAMPLE_PANELS} symbol="AAPL" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
