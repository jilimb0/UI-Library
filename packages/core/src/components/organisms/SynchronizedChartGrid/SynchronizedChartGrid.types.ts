import type { ReactNode } from 'react';
import type { WidgetColorGroup } from '../WidgetLinkBus/WidgetLinkBus.types';

export type ChartDomain =
  | 'price'
  | 'valuation_multiple'
  | 'macro'
  | 'eps_revision'
  | 'velocity'
  | 'spread_zscore';

export interface SynchronizedSeriesPoint {
  timestampMs: number;
  label: string;
  /** Scaled integer value (e.g. minor cents or bps — zero float math in core). */
  valueScaled: number;
  scaleDecimals: number;
  formattedValue: string;
}

export interface SynchronizedThresholdLine {
  label: string;
  valueScaled: number;
  tone: 'neutral' | 'warning' | 'danger';
}

export interface SynchronizedChartPanelData {
  id: string;
  title: string;
  domain: ChartDomain;
  unitLabel: string;
  linkGroup?: WidgetColorGroup;
  series: readonly SynchronizedSeriesPoint[];
  thresholdLines?: readonly SynchronizedThresholdLine[];
}

export type SynchronizedChartGridStatus =
  | 'default'
  | 'loading'
  | 'empty'
  | 'error';

export interface SynchronizedChartGridProps {
  panels: readonly SynchronizedChartPanelData[];
  status?: SynchronizedChartGridStatus;
  emptyMessage?: ReactNode;
  errorMessage?: ReactNode;
  onRetry?: () => void;
  activeIndex?: number | null;
  onActiveIndexChange?: (
    index: number | null,
    timestampMs: number | null
  ) => void;
  symbol?: string;
  columns?: 1 | 2 | 3;
  className?: string;
}
