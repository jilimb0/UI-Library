import { type KeyboardEvent, useCallback, useRef, useState } from 'react';
import { cn } from '../../../utils/cn';
import { Skeleton } from '../../atoms/Skeleton';
import { EmptyState } from '../EmptyState';
import { useWidgetLinkBus } from '../WidgetLinkBus/WidgetLinkBus';
import type {
  SynchronizedChartGridProps,
  SynchronizedChartPanelData,
  SynchronizedSeriesPoint,
  SynchronizedThresholdLine,
} from './SynchronizedChartGrid.types';

const SVG_WIDTH = 320;
const SVG_HEIGHT = 120;
const PAD_X = 12;
const PAD_Y = 12;
const PLOT_WIDTH = SVG_WIDTH - PAD_X * 2;
const PLOT_HEIGHT = SVG_HEIGHT - PAD_Y * 2;

function toScaledBigInt(
  valueScaled: number,
  pointDecimals: number,
  targetDecimals: number
): bigint {
  const intVal = Number.isFinite(valueScaled)
    ? BigInt(Math.round(valueScaled))
    : 0n;
  const delta = targetDecimals - pointDecimals;
  if (delta <= 0) return intVal;
  return intVal * 10n ** BigInt(delta);
}

function projectY(value: bigint, minVal: bigint, span: bigint): number {
  if (span === 0n) {
    return PAD_Y + Math.floor(PLOT_HEIGHT / 2);
  }
  const offset = ((value - minVal) * BigInt(PLOT_HEIGHT)) / span;
  const clamped = Math.max(0, Math.min(PLOT_HEIGHT, Number(offset)));
  return PAD_Y + PLOT_HEIGHT - clamped;
}

function projectX(index: number, count: number): number {
  if (count <= 1) {
    return PAD_X + Math.floor(PLOT_WIDTH / 2);
  }
  return PAD_X + Math.round((index * PLOT_WIDTH) / (count - 1));
}

function buildPanelGeometry(
  series: readonly SynchronizedSeriesPoint[],
  thresholds: readonly SynchronizedThresholdLine[] | undefined
) {
  if (series.length === 0) {
    return {
      coords: [] as Array<{ x: number; y: number }>,
      pointsAttr: '',
      thresholdCoords: [] as Array<{
        label: string;
        tone: SynchronizedThresholdLine['tone'];
        y: number;
      }>,
    };
  }

  let maxDecimals = 0;
  for (const pt of series) {
    if (pt.scaleDecimals > maxDecimals) maxDecimals = pt.scaleDecimals;
  }

  const baseScale = series[0].scaleDecimals;
  const scaledValues = series.map((pt) =>
    toScaledBigInt(pt.valueScaled, pt.scaleDecimals, maxDecimals)
  );
  const scaledThresholds = (thresholds ?? []).map((t) => ({
    label: t.label,
    tone: t.tone,
    val: toScaledBigInt(t.valueScaled, baseScale, maxDecimals),
  }));

  let minVal = scaledValues[0];
  let maxVal = scaledValues[0];
  for (const v of scaledValues) {
    if (v < minVal) minVal = v;
    if (v > maxVal) maxVal = v;
  }
  for (const t of scaledThresholds) {
    if (t.val < minVal) minVal = t.val;
    if (t.val > maxVal) maxVal = t.val;
  }

  const span = maxVal - minVal;
  const coords = scaledValues.map((val, idx) => ({
    x: projectX(idx, series.length),
    y: projectY(val, minVal, span),
  }));
  const pointsAttr = coords.map((c) => `${c.x},${c.y}`).join(' ');
  const thresholdCoords = scaledThresholds.map((t) => ({
    label: t.label,
    tone: t.tone,
    y: projectY(t.val, minVal, span),
  }));

  return { coords, pointsAttr, thresholdCoords };
}

export function SynchronizedChartGrid({
  panels,
  status = 'default',
  emptyMessage = 'No chart data available',
  errorMessage = 'Failed to load chart series',
  onRetry,
  activeIndex: controlledActiveIndex,
  onActiveIndexChange,
  symbol,
  columns = 2,
  className,
}: SynchronizedChartGridProps) {
  const [internalActiveIndex, setInternalActiveIndex] = useState<number | null>(
    null
  );
  const resolvedActiveIndex =
    controlledActiveIndex !== undefined
      ? controlledActiveIndex
      : internalActiveIndex;

  const { publish, getGroupValue } = useWidgetLinkBus();
  const lastPublishedRef = useRef<number | null>(null);

  const selectIndex = useCallback(
    (nextIndex: number | null, sourcePanel?: SynchronizedChartPanelData) => {
      if (controlledActiveIndex === undefined) {
        setInternalActiveIndex(nextIndex);
      }

      if (nextIndex === null) {
        lastPublishedRef.current = null;
        onActiveIndexChange?.(null, null);
        return;
      }

      const panelRef = sourcePanel ?? panels[0];
      const point = panelRef?.series[nextIndex] ?? null;
      onActiveIndexChange?.(nextIndex, point?.timestampMs ?? null);

      const linkGroup = sourcePanel?.linkGroup;
      if (
        point &&
        linkGroup &&
        linkGroup !== 'unlinked' &&
        lastPublishedRef.current !== nextIndex
      ) {
        lastPublishedRef.current = nextIndex;
        const resolvedSymbol =
          symbol ?? getGroupValue(linkGroup)?.symbol ?? sourcePanel.title;
        publish(linkGroup, {
          symbol: resolvedSymbol,
          entityType: 'ticker',
          timeframe: point.label,
          sourceWidgetId: sourcePanel.id,
        });
      }
    },
    [
      controlledActiveIndex,
      onActiveIndexChange,
      panels,
      symbol,
      getGroupValue,
      publish,
    ]
  );

  const handleSliderKeyDown = useCallback(
    (
      event: KeyboardEvent<HTMLDivElement>,
      panel: SynchronizedChartPanelData
    ) => {
      const len = panel.series.length;
      if (len === 0) return;
      const maxIdx = len - 1;
      const current =
        resolvedActiveIndex !== null && resolvedActiveIndex <= maxIdx
          ? resolvedActiveIndex
          : null;

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        const next = current === null ? 0 : Math.min(maxIdx, current + 1);
        selectIndex(next, panel);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        const next = current === null ? maxIdx : Math.max(0, current - 1);
        selectIndex(next, panel);
      } else if (event.key === 'Home') {
        event.preventDefault();
        selectIndex(0, panel);
      } else if (event.key === 'End') {
        event.preventDefault();
        selectIndex(maxIdx, panel);
      } else if (event.key === 'Escape') {
        event.preventDefault();
        selectIndex(null, panel);
      }
    },
    [resolvedActiveIndex, selectIndex]
  );

  if (status === 'loading') {
    return (
      <div
        role="status"
        aria-label="Loading synchronized charts"
        className={cn('sync-chart-grid__loading', className)}
        data-columns={columns}
      >
        <Skeleton className="sync-chart-grid__skeleton" />
        <Skeleton className="sync-chart-grid__skeleton" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div role="alert" className={cn('sync-chart-grid__error', className)}>
        <p className="sync-chart-grid__error-message">{errorMessage}</p>
        {onRetry ? (
          <button
            type="button"
            className="sync-chart-grid__retry-btn"
            onClick={onRetry}
          >
            Retry
          </button>
        ) : null}
      </div>
    );
  }

  if (status === 'empty' || panels.length === 0) {
    return <EmptyState title={emptyMessage} className={className} />;
  }

  return (
    <div className={cn('sync-chart-grid', className)} data-columns={columns}>
      {panels.map((panel) => {
        const seriesLen = panel.series.length;
        const clampedActive =
          resolvedActiveIndex !== null && seriesLen > 0
            ? Math.min(resolvedActiveIndex, seriesLen - 1)
            : null;
        const activePoint =
          clampedActive !== null ? panel.series[clampedActive] : null;
        const displayPoint =
          activePoint ?? (seriesLen > 0 ? panel.series[seriesLen - 1] : null);
        const linkedSymbol =
          symbol ??
          (panel.linkGroup && panel.linkGroup !== 'unlinked'
            ? getGroupValue(panel.linkGroup)?.symbol
            : undefined);

        const geometry = buildPanelGeometry(panel.series, panel.thresholdLines);
        const activeCoord =
          clampedActive !== null ? geometry.coords[clampedActive] : null;

        return (
          <section
            key={panel.id}
            aria-label={panel.title}
            data-testid={`chart-panel-${panel.id}`}
            data-domain={panel.domain}
            data-active-index={clampedActive ?? ''}
            className="sync-chart-panel"
          >
            <header className="sync-chart-panel__header">
              <div className="sync-chart-panel__meta">
                <span className="sync-chart-panel__title">{panel.title}</span>
                {linkedSymbol ? (
                  <span className="sync-chart-panel__symbol">
                    {linkedSymbol}
                  </span>
                ) : null}
              </div>
              <div className="sync-chart-panel__readout">
                {displayPoint ? (
                  <span
                    data-testid={`chart-active-value-${panel.id}`}
                    className="sync-chart-panel__value"
                  >
                    {`${displayPoint.label}: ${displayPoint.formattedValue}`}
                  </span>
                ) : null}
                <span className="sync-chart-panel__unit">
                  {panel.unitLabel}
                </span>
              </div>
            </header>

            {seriesLen === 0 ? (
              <EmptyState title="No series data" />
            ) : (
              <div
                role="slider"
                tabIndex={0}
                aria-label={`${panel.title} crosshair`}
                aria-valuemin={0}
                aria-valuemax={Math.max(0, seriesLen - 1)}
                aria-valuenow={clampedActive ?? 0}
                aria-valuetext={
                  activePoint
                    ? `${activePoint.label}: ${activePoint.formattedValue}`
                    : 'No point selected'
                }
                className="sync-chart-panel__canvas-wrap"
                onMouseLeave={() => selectIndex(null)}
                onKeyDown={(e) => handleSliderKeyDown(e, panel)}
              >
                <svg
                  viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
                  className="sync-chart-panel__svg"
                  aria-hidden="true"
                >
                  {geometry.thresholdCoords.map((line) => (
                    <line
                      key={line.label}
                      x1={PAD_X}
                      x2={SVG_WIDTH - PAD_X}
                      y1={line.y}
                      y2={line.y}
                      strokeDasharray="4 3"
                      className={cn(
                        'sync-chart-panel__threshold',
                        `sync-chart-panel__threshold--${line.tone}`
                      )}
                    />
                  ))}

                  {geometry.coords.length > 1 ? (
                    <polyline
                      fill="none"
                      strokeWidth={2}
                      points={geometry.pointsAttr}
                      className="sync-chart-panel__line"
                    />
                  ) : null}

                  {geometry.coords.map((pt, idx) => (
                    <circle
                      key={panel.series[idx].timestampMs}
                      cx={pt.x}
                      cy={pt.y}
                      r={clampedActive === idx ? 4 : 2.5}
                      className={cn(
                        'sync-chart-panel__dot',
                        clampedActive === idx && 'sync-chart-panel__dot--active'
                      )}
                    />
                  ))}

                  {activeCoord ? (
                    <line
                      data-testid={`crosshair-line-${panel.id}`}
                      x1={activeCoord.x}
                      x2={activeCoord.x}
                      y1={PAD_Y}
                      y2={SVG_HEIGHT - PAD_Y}
                      strokeWidth={1}
                      strokeDasharray="3 2"
                      className="sync-chart-panel__crosshair"
                    />
                  ) : null}

                  {geometry.coords.map((pt, idx) => {
                    const colW = Math.max(
                      12,
                      Math.floor(PLOT_WIDTH / Math.max(1, seriesLen))
                    );
                    const colX = Math.max(0, pt.x - Math.floor(colW / 2));
                    return (
                      // biome-ignore lint/a11y/noStaticElementInteractions: hit-target inside aria-hidden SVG; keyboard users scrub via parent role="slider"
                      <rect
                        key={`hit-${panel.series[idx].timestampMs}`}
                        data-testid={`chart-hit-${panel.id}-${idx}`}
                        x={colX}
                        y={0}
                        width={colW}
                        height={SVG_HEIGHT}
                        fill="transparent"
                        onMouseEnter={() => selectIndex(idx, panel)}
                      />
                    );
                  })}
                </svg>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
