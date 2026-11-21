import type { ReactNode } from 'react';

export type WidgetColorGroup = 'green' | 'blue' | 'red' | 'amber' | 'unlinked';

export type ActiveWidgetColorGroup = Exclude<WidgetColorGroup, 'unlinked'>;

export type LinkedEntityType =
  | 'ticker'
  | 'account'
  | 'repo'
  | 'outlet'
  | 'location';

export interface LinkedEntityPayload {
  symbol: string;
  entityType: LinkedEntityType;
  timeframe?: string;
  sourceWidgetId: string;
  updatedAtMs: number;
}

export type WidgetLinkGroupMap = Partial<
  Record<ActiveWidgetColorGroup, LinkedEntityPayload>
>;

export interface WidgetLinkContextValue {
  groups: WidgetLinkGroupMap;
  publish: (
    group: WidgetColorGroup,
    payload: Omit<LinkedEntityPayload, 'updatedAtMs'>
  ) => void;
  getGroupValue: (group: WidgetColorGroup) => LinkedEntityPayload | null;
  clearGroup: (group: WidgetColorGroup) => void;
}

export interface WidgetLinkProviderProps {
  children: ReactNode;
  /** Synchronize active groups with URL query (?g_green=AAPL&g_blue=MSFT). Defaults to true in browser. */
  syncUrl?: boolean;
  /** BroadcastChannel name for cross-tab sync (disabled when null or API unavailable). */
  channelName?: string | null;
  /** Initial values (used for SSR or tests without window). */
  initialGroups?: WidgetLinkGroupMap;
  /** Callback when any active group changes (for React Native / non-DOM adapters). */
  onGroupChange?: (
    group: ActiveWidgetColorGroup,
    payload: LinkedEntityPayload | null
  ) => void;
}

export type LinkedPanelStatus = 'default' | 'loading' | 'empty' | 'error';

export interface LinkedPanelProps {
  widgetId: string;
  title: ReactNode;
  defaultGroup?: WidgetColorGroup;
  group?: WidgetColorGroup;
  onGroupChange?: (group: WidgetColorGroup) => void;
  status?: LinkedPanelStatus;
  emptyMessage?: ReactNode;
  errorMessage?: ReactNode;
  onRetry?: () => void;
  headerActions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export interface WidgetLinkSelectorProps {
  value: WidgetColorGroup;
  onChange: (group: WidgetColorGroup) => void;
  'aria-label'?: string;
  className?: string;
}
