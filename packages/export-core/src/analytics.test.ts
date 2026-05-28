import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearExportAnalyticsEvents,
  listExportAnalyticsEvents,
  recordExportAnalyticsEvent,
} from './analytics';

describe('export analytics journal', () => {
  beforeEach(() => {
    clearExportAnalyticsEvents();
  });

  it('records export events in order', () => {
    recordExportAnalyticsEvent('export_render_started', 'react-single-page', {
      pageCount: 2,
    });
    recordExportAnalyticsEvent('export_render_finished', 'react-single-page', {
      fileCount: 6,
    });

    const events = listExportAnalyticsEvents();

    expect(events).toHaveLength(2);
    expect(events[0]?.name).toBe('export_render_started');
    expect(events[1]?.metadata?.fileCount).toBe(6);
  });
});
