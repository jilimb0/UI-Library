import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '../../../utils/cn';
import { Skeleton } from '../../atoms/Skeleton';
import { EmptyState } from '../EmptyState';
import type {
  TilingPresetId,
  TilingWorkspaceProps,
} from './TilingWorkspace.types';

const MAX_TILES = 6;

const PRESETS: readonly TilingPresetId[] = ['1x1', '2x1', '1+2', '2x2', '3x2'];

function isValidPreset(value: unknown): value is TilingPresetId {
  return (
    typeof value === 'string' && (PRESETS as readonly string[]).includes(value)
  );
}

function getStorageKey(workspaceId: string): string {
  return `ucl-tiling:${workspaceId}`;
}

function readStoredPreset(
  workspaceId: string,
  persistLayout: boolean
): TilingPresetId | null {
  if (!persistLayout || typeof window === 'undefined') {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(getStorageKey(workspaceId));
    return isValidPreset(raw) ? raw : null;
  } catch {
    return null;
  }
}

function writeStoredPreset(
  workspaceId: string,
  preset: TilingPresetId,
  persistLayout: boolean
): void {
  if (!persistLayout || typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(getStorageKey(workspaceId), preset);
  } catch {
    // Ignore storage quota or private-mode errors
  }
}

export function TilingWorkspace({
  workspaceId,
  tiles,
  preset,
  onPresetChange,
  persistLayout = true,
  onFocusTile,
  status = 'default',
  emptyMessage = 'No workspace panels configured',
  errorMessage = 'Failed to load workspace layout',
  onRetry,
  className,
}: TilingWorkspaceProps) {
  const visibleTiles = useMemo(() => tiles.slice(0, MAX_TILES), [tiles]);

  const [internalPreset, setInternalPreset] = useState<TilingPresetId>(
    () => readStoredPreset(workspaceId, persistLayout) ?? '2x2'
  );
  const activePreset = preset ?? internalPreset;

  const [focusedTileId, setFocusedTileId] = useState<string | null>(null);
  const focusedTileIdRef = useRef<string | null>(null);
  const tileRefs = useRef<Record<string, HTMLElement | null>>({});

  const onFocusTileRef = useRef(onFocusTile);
  onFocusTileRef.current = onFocusTile;

  const activateTileFocus = useCallback((tileId: string) => {
    const changed = focusedTileIdRef.current !== tileId;
    focusedTileIdRef.current = tileId;
    setFocusedTileId(tileId);
    if (changed) {
      onFocusTileRef.current?.(tileId);
    }
  }, []);

  const clearTileFocus = useCallback(() => {
    focusedTileIdRef.current = null;
    setFocusedTileId(null);
  }, []);

  const handlePresetSelect = useCallback(
    (nextPreset: TilingPresetId) => {
      if (preset === undefined) {
        setInternalPreset(nextPreset);
      }
      writeStoredPreset(workspaceId, nextPreset, persistLayout);
      onPresetChange?.(nextPreset);
    },
    [preset, workspaceId, persistLayout, onPresetChange]
  );

  const focusTileAtIndex = useCallback(
    (index: number) => {
      const target = visibleTiles[index];
      if (!target) return;
      activateTileFocus(target.id);
      tileRefs.current[target.id]?.focus();
    },
    [activateTileFocus, visibleTiles]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleGlobalKeyDown = (event: globalThis.KeyboardEvent) => {
      if (!event.altKey || event.ctrlKey || event.metaKey) return;

      let digit = Number.NaN;
      if (/^[1-6]$/.test(event.key)) {
        digit = Number(event.key);
      } else if (/^Digit[1-6]$/.test(event.code)) {
        digit = Number(event.code.replace('Digit', ''));
      }

      if (Number.isInteger(digit) && digit >= 1 && digit <= MAX_TILES) {
        const idx = digit - 1;
        if (idx < visibleTiles.length) {
          event.preventDefault();
          focusTileAtIndex(idx);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [focusTileAtIndex, visibleTiles.length]);

  const handleTileKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        clearTileFocus();
      }
    },
    [clearTileFocus]
  );

  return (
    <div
      className={cn('tiling-workspace', className)}
      data-workspace-id={workspaceId}
      data-status={status}
    >
      <div className="tiling-workspace__toolbar">
        <fieldset
          aria-label="Workspace layout preset"
          className="tiling-workspace__presets"
        >
          {PRESETS.map((presetId) => {
            const active = activePreset === presetId;
            return (
              <button
                key={presetId}
                type="button"
                aria-pressed={active}
                className={cn(
                  'tiling-workspace__preset-btn',
                  active && 'tiling-workspace__preset-btn--active'
                )}
                onClick={() => handlePresetSelect(presetId)}
              >
                {presetId}
              </button>
            );
          })}
        </fieldset>
      </div>

      {status === 'loading' ? (
        <div
          role="status"
          aria-label="Loading workspace"
          className="tiling-workspace__loading"
        >
          <Skeleton className="tiling-workspace__skeleton" />
          <Skeleton className="tiling-workspace__skeleton" />
        </div>
      ) : status === 'error' ? (
        <div role="alert" className="tiling-workspace__error">
          <p className="tiling-workspace__error-message">{errorMessage}</p>
          {onRetry ? (
            <button
              type="button"
              className="tiling-workspace__retry-btn"
              onClick={onRetry}
            >
              Retry
            </button>
          ) : null}
        </div>
      ) : status === 'empty' || visibleTiles.length === 0 ? (
        <EmptyState title={emptyMessage} />
      ) : (
        <div
          data-testid={`tiling-grid-${workspaceId}`}
          data-preset={activePreset}
          className="tiling-workspace__grid"
        >
          {visibleTiles.map((tile, index) => {
            const isFocused = focusedTileId === tile.id;
            return (
              <section
                key={tile.id}
                ref={(el) => {
                  tileRefs.current[tile.id] = el;
                }}
                tabIndex={-1}
                aria-roledescription="workspace panel"
                aria-label={tile.title}
                data-tile-id={tile.id}
                data-focused={isFocused ? 'true' : 'false'}
                data-link-group={tile.linkGroup}
                className={cn(
                  'tiling-workspace__tile',
                  isFocused && 'tiling-workspace__tile--focused'
                )}
                style={{
                  gridColumn: tile.colSpan ? `span ${tile.colSpan}` : undefined,
                  gridRow: tile.rowSpan ? `span ${tile.rowSpan}` : undefined,
                }}
                onFocus={() => activateTileFocus(tile.id)}
                onMouseDown={() => activateTileFocus(tile.id)}
                onKeyDown={handleTileKeyDown}
              >
                <header className="tiling-workspace__tile-header">
                  <span className="tiling-workspace__tile-index">
                    {index + 1}
                  </span>
                  <span className="tiling-workspace__tile-title">
                    {tile.title}
                  </span>
                  <span
                    className={cn(
                      'tiling-workspace__group-dot',
                      `tiling-workspace__group-dot--${tile.linkGroup}`
                    )}
                    aria-hidden="true"
                  />
                </header>
                <div className="tiling-workspace__tile-body">
                  {tile.render({
                    isFocused,
                    linkGroup: tile.linkGroup,
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
