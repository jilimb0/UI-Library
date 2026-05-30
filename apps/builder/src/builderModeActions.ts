import { recordAnalyticsEvent } from './analytics';

export type BuilderMode = 'generate' | 'edit' | 'review' | 'publish' | 'export';

export function changeBuilderMode(
  setBuilderMode: (mode: BuilderMode) => void,
  mode: BuilderMode
) {
  recordAnalyticsEvent('builder_mode_changed', 'builder', { mode });
  setBuilderMode(mode);
}
