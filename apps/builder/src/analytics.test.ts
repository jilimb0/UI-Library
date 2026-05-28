import { afterEach, describe, expect, it } from 'vitest';
import {
  clearAnalyticsEvents,
  listAnalyticsEvents,
  recordAnalyticsEvent,
} from './analytics';

describe('analytics journal', () => {
  afterEach(() => {
    clearAnalyticsEvents();
  });

  it('records builder events in order', () => {
    recordAnalyticsEvent('builder_opened', 'builder', { route: '/builder' });
    recordAnalyticsEvent('export_mode_opened', 'export', { route: '/builder' });

    const events = listAnalyticsEvents();

    expect(events).toHaveLength(2);
    expect(events[0]?.name).toBe('builder_opened');
    expect(events[1]?.category).toBe('export');
  });
});
