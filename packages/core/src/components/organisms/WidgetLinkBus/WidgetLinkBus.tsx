import {
  createContext,
  type KeyboardEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '../../../utils/cn';
import { Skeleton } from '../../atoms/Skeleton';
import { EmptyState } from '../EmptyState';
import type {
  ActiveWidgetColorGroup,
  LinkedEntityPayload,
  LinkedEntityType,
  LinkedPanelProps,
  WidgetColorGroup,
  WidgetLinkContextValue,
  WidgetLinkGroupMap,
  WidgetLinkProviderProps,
  WidgetLinkSelectorProps,
} from './WidgetLinkBus.types';

const ACTIVE_GROUPS: readonly ActiveWidgetColorGroup[] = [
  'green',
  'blue',
  'red',
  'amber',
];

const ALL_GROUPS: readonly WidgetColorGroup[] = [
  'green',
  'blue',
  'red',
  'amber',
  'unlinked',
];

const GROUP_LABELS: Record<WidgetColorGroup, { short: string; label: string }> =
  {
    green: { short: 'G', label: 'Green link group' },
    blue: { short: 'B', label: 'Blue link group' },
    red: { short: 'R', label: 'Red link group' },
    amber: { short: 'A', label: 'Amber link group' },
    unlinked: { short: '—', label: 'Unlinked (autonomous)' },
  };

const VALID_ENTITY_TYPES = new Set<LinkedEntityType>([
  'ticker',
  'account',
  'repo',
  'outlet',
  'location',
]);

function isActiveGroup(group: unknown): group is ActiveWidgetColorGroup {
  return (
    typeof group === 'string' &&
    (ACTIVE_GROUPS as readonly string[]).includes(group)
  );
}

function isValidPayload(value: unknown): value is LinkedEntityPayload {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  if (typeof record.symbol !== 'string' || record.symbol.trim().length === 0) {
    return false;
  }
  if (
    typeof record.entityType !== 'string' ||
    !VALID_ENTITY_TYPES.has(record.entityType as LinkedEntityType)
  ) {
    return false;
  }
  if (
    typeof record.sourceWidgetId !== 'string' ||
    record.sourceWidgetId.trim().length === 0
  ) {
    return false;
  }
  if (
    typeof record.updatedAtMs !== 'number' ||
    !Number.isInteger(record.updatedAtMs) ||
    record.updatedAtMs < 0
  ) {
    return false;
  }
  if (record.timeframe !== undefined && typeof record.timeframe !== 'string') {
    return false;
  }
  return true;
}

function readGroupsFromUrl(
  initialGroups: WidgetLinkGroupMap | undefined,
  syncUrl: boolean
): WidgetLinkGroupMap {
  const base: WidgetLinkGroupMap = { ...(initialGroups ?? {}) };
  if (!syncUrl || typeof window === 'undefined') {
    return base;
  }
  try {
    const params = new URLSearchParams(window.location.search);
    for (const group of ACTIVE_GROUPS) {
      const symbol = params.get(`g_${group}`)?.trim();
      if (symbol) {
        base[group] = {
          symbol,
          entityType: 'ticker',
          sourceWidgetId: 'url',
          updatedAtMs: 0,
        };
      }
    }
  } catch {
    // Ignore restricted URL contexts
  }
  return base;
}

function syncGroupToUrl(
  group: ActiveWidgetColorGroup,
  payload: LinkedEntityPayload | null
): void {
  if (
    typeof window === 'undefined' ||
    !window.location ||
    !window.history?.replaceState
  ) {
    return;
  }
  try {
    const url = new URL(window.location.href);
    if (payload) {
      url.searchParams.set(`g_${group}`, payload.symbol);
    } else {
      url.searchParams.delete(`g_${group}`);
    }
    window.history.replaceState(
      null,
      '',
      `${url.pathname}${url.search}${url.hash}`
    );
  } catch {
    // Ignore history API errors in sandboxed iframes
  }
}

const FALLBACK_CONTEXT: WidgetLinkContextValue = {
  groups: {},
  publish: () => {},
  getGroupValue: () => null,
  clearGroup: () => {},
};

const WidgetLinkContext = createContext<WidgetLinkContextValue | null>(null);

export function WidgetLinkProvider({
  children,
  syncUrl = true,
  channelName = 'ucl-widget-link',
  initialGroups,
  onGroupChange,
}: WidgetLinkProviderProps) {
  const [groups, setGroups] = useState<WidgetLinkGroupMap>(() =>
    readGroupsFromUrl(initialGroups, syncUrl)
  );
  const groupsRef = useRef<WidgetLinkGroupMap>(groups);
  groupsRef.current = groups;

  const channelRef = useRef<BroadcastChannel | null>(null);
  const seenMessagesRef = useRef<Set<string>>(new Set());
  const lastTimestampRef = useRef<number>(0);
  const onGroupChangeRef = useRef(onGroupChange);
  onGroupChangeRef.current = onGroupChange;

  const recordSeen = useCallback(
    (
      group: ActiveWidgetColorGroup,
      sourceWidgetId: string,
      updatedAtMs: number
    ) => {
      const key = `${group}:${sourceWidgetId}:${updatedAtMs}`;
      const seen = seenMessagesRef.current;
      if (seen.size > 200) {
        seen.clear();
      }
      seen.add(key);
    },
    []
  );

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      channelName === null ||
      typeof BroadcastChannel === 'undefined'
    ) {
      return;
    }

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel(channelName);
      channelRef.current = channel;

      channel.onmessage = (event: MessageEvent) => {
        const data = event?.data as Record<string, unknown> | undefined;
        if (!data || typeof data !== 'object') return;

        const group = data.group;
        if (!isActiveGroup(group)) return;

        if (data.payload === null) {
          if (!groupsRef.current[group]) return;
          const next = { ...groupsRef.current };
          delete next[group];
          groupsRef.current = next;
          setGroups(next);
          if (syncUrl) {
            syncGroupToUrl(group, null);
          }
          onGroupChangeRef.current?.(group, null);
          return;
        }

        if (!isValidPayload(data.payload)) return;
        const incoming = data.payload;
        const seenKey = `${group}:${incoming.sourceWidgetId}:${incoming.updatedAtMs}`;
        const existing = groupsRef.current[group];

        if (
          seenMessagesRef.current.has(seenKey) ||
          (existing &&
            existing.sourceWidgetId === incoming.sourceWidgetId &&
            existing.updatedAtMs === incoming.updatedAtMs)
        ) {
          return;
        }

        recordSeen(group, incoming.sourceWidgetId, incoming.updatedAtMs);
        const next: WidgetLinkGroupMap = {
          ...groupsRef.current,
          [group]: incoming,
        };
        groupsRef.current = next;
        setGroups(next);
        if (syncUrl) {
          syncGroupToUrl(group, incoming);
        }
        onGroupChangeRef.current?.(group, incoming);
      };
    } catch {
      channelRef.current = null;
    }

    return () => {
      try {
        channel?.close();
      } catch {
        // Ignore close errors
      }
      if (channelRef.current === channel) {
        channelRef.current = null;
      }
    };
  }, [channelName, recordSeen, syncUrl]);

  const publish = useCallback(
    (
      group: WidgetColorGroup,
      payload: Omit<LinkedEntityPayload, 'updatedAtMs'>
    ) => {
      if (group === 'unlinked') return;
      const symbol = payload.symbol.trim();
      if (!symbol) return;

      const updatedAtMs = Math.max(Date.now(), lastTimestampRef.current + 1);
      lastTimestampRef.current = updatedAtMs;

      const fullPayload: LinkedEntityPayload = {
        ...payload,
        symbol,
        updatedAtMs,
      };

      recordSeen(group, fullPayload.sourceWidgetId, fullPayload.updatedAtMs);

      const next: WidgetLinkGroupMap = {
        ...groupsRef.current,
        [group]: fullPayload,
      };
      groupsRef.current = next;
      setGroups(next);

      if (syncUrl) {
        syncGroupToUrl(group, fullPayload);
      }

      onGroupChangeRef.current?.(group, fullPayload);

      if (channelRef.current) {
        try {
          channelRef.current.postMessage({ group, payload: fullPayload });
        } catch {
          // Ignore BroadcastChannel serialization errors
        }
      }
    },
    [recordSeen, syncUrl]
  );

  const getGroupValue = useCallback(
    (group: WidgetColorGroup): LinkedEntityPayload | null => {
      if (group === 'unlinked') return null;
      return groups[group] ?? null;
    },
    [groups]
  );

  const clearGroup = useCallback(
    (group: WidgetColorGroup) => {
      if (group === 'unlinked') return;
      if (!groupsRef.current[group]) return;

      const next = { ...groupsRef.current };
      delete next[group];
      groupsRef.current = next;
      setGroups(next);

      if (syncUrl) {
        syncGroupToUrl(group, null);
      }

      onGroupChangeRef.current?.(group, null);

      if (channelRef.current) {
        try {
          channelRef.current.postMessage({ group, payload: null });
        } catch {
          // Ignore BroadcastChannel errors
        }
      }
    },
    [syncUrl]
  );

  const value = useMemo<WidgetLinkContextValue>(
    () => ({
      groups,
      publish,
      getGroupValue,
      clearGroup,
    }),
    [groups, publish, getGroupValue, clearGroup]
  );

  return (
    <WidgetLinkContext.Provider value={value}>
      {children}
    </WidgetLinkContext.Provider>
  );
}

export function useWidgetLinkBus(): WidgetLinkContextValue {
  return useContext(WidgetLinkContext) ?? FALLBACK_CONTEXT;
}

export function useWidgetLinkGroup(group: WidgetColorGroup): {
  entity: LinkedEntityPayload | null;
  publishEntity: (payload: Omit<LinkedEntityPayload, 'updatedAtMs'>) => void;
  clearGroup: () => void;
} {
  const { getGroupValue, publish, clearGroup } = useWidgetLinkBus();
  const entity = getGroupValue(group);

  const publishEntity = useCallback(
    (payload: Omit<LinkedEntityPayload, 'updatedAtMs'>) => {
      publish(group, payload);
    },
    [publish, group]
  );

  const clearCurrentGroup = useCallback(() => {
    clearGroup(group);
  }, [clearGroup, group]);

  return {
    entity,
    publishEntity,
    clearGroup: clearCurrentGroup,
  };
}

export function useWidgetLinkPublisher(
  group: WidgetColorGroup,
  sourceWidgetId: string
): (
  payload: Omit<
    LinkedEntityPayload,
    'updatedAtMs' | 'sourceWidgetId' | 'entityType'
  > & {
    entityType?: LinkedEntityType;
  }
) => void {
  const { publish } = useWidgetLinkBus();

  return useCallback(
    (payload) => {
      publish(group, {
        entityType: payload.entityType ?? 'ticker',
        ...payload,
        sourceWidgetId,
      });
    },
    [publish, group, sourceWidgetId]
  );
}

export function WidgetLinkSelector({
  value,
  onChange,
  'aria-label': ariaLabel = 'Widget link color group',
  className,
}: WidgetLinkSelectorProps) {
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
      let nextIndex = -1;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % ALL_GROUPS.length;
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        nextIndex = (currentIndex - 1 + ALL_GROUPS.length) % ALL_GROUPS.length;
      } else if (event.key === 'Home') {
        nextIndex = 0;
      } else if (event.key === 'End') {
        nextIndex = ALL_GROUPS.length - 1;
      }

      if (nextIndex >= 0) {
        event.preventDefault();
        const nextGroup = ALL_GROUPS[nextIndex];
        onChange(nextGroup);
        buttonRefs.current[nextGroup]?.focus();
      }
    },
    [onChange]
  );

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn('widget-link-selector', className)}
    >
      {ALL_GROUPS.map((groupName, index) => {
        const selected = value === groupName;
        const meta = GROUP_LABELS[groupName];
        return (
          /* biome-ignore lint/a11y/useSemanticElements: WAI-ARIA APG radiogroup toolbar uses button[role="radio"] for compact G/B/R/A selectors */
          <button
            key={groupName}
            ref={(el) => {
              buttonRefs.current[groupName] = el;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={meta.label}
            title={meta.label}
            tabIndex={selected ? 0 : -1}
            data-group={groupName}
            className={cn(
              'widget-link-selector__option',
              `widget-link-selector__option--${groupName}`,
              selected && 'widget-link-selector__option--selected'
            )}
            onClick={() => onChange(groupName)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {meta.short}
          </button>
        );
      })}
    </div>
  );
}

export const WidgetLinkBadge = WidgetLinkSelector;

export function LinkedPanel({
  widgetId,
  title,
  defaultGroup = 'unlinked',
  group,
  onGroupChange,
  status = 'default',
  emptyMessage = 'No data available',
  errorMessage = 'Failed to load panel data',
  onRetry,
  headerActions,
  children,
  className,
}: LinkedPanelProps) {
  const [internalGroup, setInternalGroup] =
    useState<WidgetColorGroup>(defaultGroup);
  const activeGroup = group ?? internalGroup;
  const { entity } = useWidgetLinkGroup(activeGroup);

  const handleGroupChange = useCallback(
    (nextGroup: WidgetColorGroup) => {
      if (group === undefined) {
        setInternalGroup(nextGroup);
      }
      onGroupChange?.(nextGroup);
    },
    [group, onGroupChange]
  );

  const panelLabel =
    typeof title === 'string' && title.trim() ? title : `Panel ${widgetId}`;

  return (
    <section
      aria-label={panelLabel}
      data-widget-id={widgetId}
      data-link-group={activeGroup}
      data-status={status}
      className={cn('linked-panel', className)}
    >
      <header className="linked-panel__header">
        <div className="linked-panel__title-wrap">
          <span className="linked-panel__title">{title}</span>
          {activeGroup !== 'unlinked' && entity ? (
            <span
              className="linked-panel__entity"
              data-testid={`linked-entity-${widgetId}`}
            >
              {entity.symbol}
            </span>
          ) : null}
        </div>
        <div className="linked-panel__controls">
          {headerActions}
          <WidgetLinkSelector
            value={activeGroup}
            onChange={handleGroupChange}
          />
        </div>
      </header>

      <div className="linked-panel__body">
        {status === 'loading' ? (
          <div
            role="status"
            aria-label="Loading panel content"
            className="linked-panel__loading"
          >
            <Skeleton className="linked-panel__skeleton-line" />
            <Skeleton className="linked-panel__skeleton-line" />
            <Skeleton className="linked-panel__skeleton-line linked-panel__skeleton-line--short" />
          </div>
        ) : status === 'empty' ? (
          <EmptyState title={emptyMessage} />
        ) : status === 'error' ? (
          <div role="alert" className="linked-panel__error">
            <p className="linked-panel__error-message">{errorMessage}</p>
            {onRetry ? (
              <button
                type="button"
                className="linked-panel__retry-btn"
                onClick={onRetry}
              >
                Retry
              </button>
            ) : null}
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
