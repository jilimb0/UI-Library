import type { ExportTarget } from './index';

export type ExportAnalyticsEvent = {
  name: string;
  target: ExportTarget;
  timestamp: string;
  metadata?: Record<string, string | number | boolean | null>;
};

const exportAnalyticsLog: ExportAnalyticsEvent[] = [];

export function recordExportAnalyticsEvent(
  name: string,
  target: ExportTarget,
  metadata: ExportAnalyticsEvent['metadata'] = {}
): ExportAnalyticsEvent {
  const event: ExportAnalyticsEvent = {
    name,
    target,
    timestamp: new Date().toISOString(),
    metadata,
  };
  exportAnalyticsLog.push(event);
  return event;
}

export function listExportAnalyticsEvents(): ExportAnalyticsEvent[] {
  return [...exportAnalyticsLog];
}

export function clearExportAnalyticsEvents(): void {
  exportAnalyticsLog.length = 0;
}
