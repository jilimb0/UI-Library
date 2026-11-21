import type { ReactNode } from 'react';
import type { WidgetColorGroup } from '../WidgetLinkBus/WidgetLinkBus.types';

export type TilingPresetId = '1x1' | '2x1' | '1+2' | '2x2' | '3x2';

export interface TilingTileConfig {
  id: string;
  title: string;
  linkGroup: WidgetColorGroup;
  colSpan?: 1 | 2 | 3;
  rowSpan?: 1 | 2;
  render: (context: {
    isFocused: boolean;
    linkGroup: WidgetColorGroup;
  }) => ReactNode;
}

export type TilingWorkspaceStatus = 'default' | 'loading' | 'empty' | 'error';

export interface TilingWorkspaceProps {
  workspaceId: string;
  tiles: readonly TilingTileConfig[];
  preset?: TilingPresetId;
  onPresetChange?: (preset: TilingPresetId) => void;
  persistLayout?: boolean;
  onFocusTile?: (tileId: string) => void;
  status?: TilingWorkspaceStatus;
  emptyMessage?: ReactNode;
  errorMessage?: ReactNode;
  onRetry?: () => void;
  className?: string;
}
