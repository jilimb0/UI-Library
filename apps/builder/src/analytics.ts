export type AnalyticsEvent = {
  name: string;
  category: 'builder' | 'export';
  timestamp: string;
  metadata?: Record<string, string | number | boolean | null>;
};

const eventLog: AnalyticsEvent[] = [];

export function recordAnalyticsEvent(
  name: string,
  category: AnalyticsEvent['category'],
  metadata: AnalyticsEvent['metadata'] = {}
): AnalyticsEvent {
  const event: AnalyticsEvent = {
    name,
    category,
    timestamp: new Date().toISOString(),
    metadata,
  };
  eventLog.push(event);
  return event;
}

export function listAnalyticsEvents(): AnalyticsEvent[] {
  return [...eventLog];
}

export function clearAnalyticsEvents(): void {
  eventLog.length = 0;
}
