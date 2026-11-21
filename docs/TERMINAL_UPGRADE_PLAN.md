# UI-Library — План трансформации в Terminal UI Kit (Bloomberg / Koyfin / Godel / OpenBB)

> **Репозиторий:** `core-infra/ui-library` (`@ui-construction-library/core`, `@ui-construction-library/schema`, `@ui-construction-library/tokens`)  
> **Статус плана:** Готов к исполнению (TDD-first)  
> **Связанные ADR (не нарушать):**  
> - `.ai/adr/0001-wai-aria-tokens-and-stdio-mcp-snapshot.md` (WAI-ARIA, SSR-гарды `typeof window !== 'undefined'`, единый источник токенов `packages/tokens`, `api-snapshot.json` для `scripts/mcp-server.mjs`)  
> - `.ai/adr/0002-resilience-rate-limiting-and-privacy-telemetry.md` (First-class `*-foreground` токены, privacy-scrubbed телеметрия)  
> - `.ai/adr/0003-agent-control-room-and-contract-snapshot.md` (`AgentControlRoom`, `SourceLineageDrawer`, `FundamentalLineageCitationSchema` с целыми `valueMinor` и `costMicros`)

---

## 1. Текущая кодовая база (Verified Baseline)

В `@ui-construction-library/core` уже реализован базовый фундамент для терминальных интерфейсов:
- **Command Bar:** `packages/core/src/components/organisms/CommandPalette/CommandPalette.tsx` (`CommandPalette`, `CommandPaletteProps`, `CommandPaletteGroup`, `CommandPaletteItem`) — поиск по `label` и `keywords`, навигация стрелками (`ArrowDown`, `ArrowUp`, `Enter`, `Escape`), ARIA `role="combobox"` / `role="listbox"`. Пока отсутствует парсер терминальной грамматики `[Subject] [Mnemonic]` и алгебраических спред-выражений (`A / B`, `A - B`).
- **Click-to-Source Lineage:** `packages/core/src/components/organisms/SourceLineageDrawer/SourceLineageDrawer.tsx` (`SourceLineageDrawer`, `FundamentalLineageCitation`, `formatMinorUnits`) + Zod-контракт `packages/schema/src/zod/lineage.schema.ts` (`FundamentalLineageCitationSchema` с целыми minor-единицами, `sourceByteOffset`, `sourceByteLength`).
- **Agent Observability:** `packages/core/src/components/templates/AgentControlRoom/AgentControlRoom.tsx` и `AgentControlRoom.types.ts` (`TraceSpanItem`, `ApprovalGateItem`, `AgentNodeTelemetry`, `ApprovalDecisionInput`) + `packages/schema/src/zod/agent-control-room.schema.ts`.
- **Таблицы и KPI:** `packages/core/src/components/organisms/DataTable/DataTable.tsx`, `KpiCard/KpiCard.tsx`, `KpiCard/KpiGrid.tsx`, `KpiCard/StatCard.tsx`, `Drawer/Drawer.tsx`, `packages/core/src/components/atoms/Kbd/Kbd.tsx`.
- **MCP Server & Snapshot:** `scripts/mcp-server.mjs` (stdio JSON-RPC 2.0, загружает `packages/core/api-snapshot.json`, отдает рецепты `uilibrary_get_gold_kit_recipe`).

**Ключевой разрыв относительно Koyfin / Godel Terminal / Bloomberg:**  
Не хватает общей шины цветовой синхронизации виджетов (`WidgetLinkBus`), синтаксиса быстрых команд `[Entity] [Mnemonic] <GO>` в `CommandPalette`, синхронизированной сетки тайлов (`TilingWorkspace`) и многодоменных графиков с общим кроссхейром (`SynchronizedChartGrid`). Реализация этих организмов в `UI-Library` немедленно вооружает все потребители экосистемы (`Trader`, `MyPersFin`, `RepoRadar`, `Gavel`, `C&TLab`, `create-ready-stack`).

---

## 2. Матрица инвариантов (Axes 1–8)

| Ось | Требование к новым компонентам `UI-Library` |
|---|---|
| **Axis 3 (Resilience)** | Безопасный fallback при отсутствии `BroadcastChannel` или URL-параметров; все подписки шины очищаются в `useEffect` cleanup без утечек слушателей. |
| **Axis 4 (Precision)** | Никаких `number` float-сумм в контрактах данных: `SynchronizedChartGrid` и `LinkedEntityPayload` передают числовые серии в целых минорных единицах / базисных пунктах (`bps`) или строках/масштабированных целых. |
| **Axis 5 (Privacy & Zero-Leakage)** | Никаких внешних CDN-шрифтов или трекеров; `BroadcastChannel('ucl-widget-link')` публикует только идентификаторы сущности (`symbol`, `entityType`, `timeframe`), без PII, токенов или балансов. |
| **Axis 6 (WAI-ARIA & SSR)** | Обязательные гарды `typeof window !== 'undefined'` перед обращением к `window.location`, `window.history` и `BroadcastChannel`. В `WidgetLinkBadge` — `role="radiogroup"`/`aria-label`; в `TilingWorkspace` — `aria-roledescription="workspace panel"`, фокус-рамки и `Escape`/клавиатурное переключение. |
| **Axis 7 (Appllama UI & Kinematics)** | Физика переходов `100–180ms` с обязательным `@media (prefers-reduced-motion: reduce)`. Все новые организмы (`TilingWorkspace`, `SynchronizedChartGrid`) обязаны поддерживать 4 состояния (`Default`, `Loading`, `Empty`, `Error`). URL-driven состояние цветовых групп (`?g_green=...&g_blue=...`). |
| **Axis 8 (SEO/GEO)** | Экспорт новых организмов в `packages/core/api-snapshot.json`, `scripts/mcp-server.mjs` и `apps/demo-showcase` / `Storybook`. |

---

## 3. Детальный пофазовый план реализации

### Фаза 1 — Color-Coded Widget Linking (`WidgetLinkBus` & `LinkedPanel`)

Создать механизм broadcast-синхронизации панелей по цветовым группам (паттерн Koyfin `G/B/R/A` групп).

**Целевые файлы:**
- `[NEW]` `packages/core/src/components/organisms/WidgetLinkBus/WidgetLinkBus.types.ts`
- `[NEW]` `packages/core/src/components/organisms/WidgetLinkBus/WidgetLinkBus.tsx`
- `[NEW]` `packages/core/src/components/organisms/WidgetLinkBus/WidgetLinkBus.test.tsx`
- `[NEW]` `packages/core/src/components/organisms/WidgetLinkBus/WidgetLinkBus.stories.tsx`
- `[NEW]` `packages/core/src/components/organisms/WidgetLinkBus/index.ts`
- `[MODIFY]` `packages/schema/src/zod/widget-link.schema.ts` `[NEW]` и `packages/schema/src/zod/index.ts`

**Точный TypeScript-контракт (`WidgetLinkBus.types.ts`):**
```ts
import type { ReactNode } from 'react';

export type WidgetColorGroup = 'green' | 'blue' | 'red' | 'amber' | 'unlinked';

export type LinkedEntityType = 'ticker' | 'account' | 'repo' | 'outlet' | 'location';

export interface LinkedEntityPayload {
  symbol: string;
  entityType: LinkedEntityType;
  timeframe?: string;
  sourceWidgetId: string;
  updatedAtMs: number;
}

export interface WidgetLinkContextValue {
  groups: Partial<Record<Exclude<WidgetColorGroup, 'unlinked'>, LinkedEntityPayload>>;
  publish: (group: WidgetColorGroup, payload: Omit<LinkedEntityPayload, 'updatedAtMs'>) => void;
  getGroupValue: (group: WidgetColorGroup) => LinkedEntityPayload | null;
  clearGroup: (group: WidgetColorGroup) => void;
}

export interface WidgetLinkProviderProps {
  children: ReactNode;
  /** Синхронизировать активные группы с URL query (?g_green=AAPL&g_blue=MSFT). По умолчанию true в браузере. */
  syncUrl?: boolean;
  /** Имя BroadcastChannel для межвкладочной синхронизации (отключается при null или отсутствии API). */
  channelName?: string | null;
  /** Начальные значения (используется для SSR/тестов без window). */
  initialGroups?: Partial<Record<Exclude<WidgetColorGroup, 'unlinked'>, LinkedEntityPayload>>;
  /** Callback при изменении любой группы (удобно для React Native / non-DOM адаптеров). */
  onGroupChange?: (
    group: Exclude<WidgetColorGroup, 'unlinked'>,
    payload: LinkedEntityPayload | null
  ) => void;
}

export interface LinkedPanelProps {
  widgetId: string;
  title: ReactNode;
  defaultGroup?: WidgetColorGroup;
  group?: WidgetColorGroup;
  onGroupChange?: (group: WidgetColorGroup) => void;
  status?: 'default' | 'loading' | 'empty' | 'error';
  emptyMessage?: ReactNode;
  errorMessage?: ReactNode;
  onRetry?: () => void;
  headerActions?: ReactNode;
  children: ReactNode;
  className?: string;
}
```

**Детали реализации:**
1. При инициализации в `WidgetLinkProvider` (только внутри `typeof window !== 'undefined'`) считывать query-параметры `?g_green=...`, `?g_blue=...`, `?g_red=...`, `?g_amber=...`.
2. При вызове `publish(group, payload)`:
   - Если `group === 'unlinked'`, обновление игнорируется (панель работает автономно).
   - Иначе обновляется состояние, при `syncUrl` обновляется `window.history.replaceState` без перезагрузки страницы, и (если доступен `BroadcastChannel`) отправляется сообщение с `sourceWidgetId` и timestamp для исключения эхо-циклов.
3. Предоставить хуки:
   - `useWidgetLinkGroup(group: WidgetColorGroup)` $\rightarrow$ `{ entity, publishEntity }`.
   - `useWidgetLinkPublisher(group: WidgetColorGroup, sourceWidgetId: string)`.
4. `LinkedPanel` рендерит компактный заголовок с `WidgetLinkSelector` (`G`, `B`, `R`, `A`, `—`), привязанную клавиатурную навигацию и встроенную обработку 4 состояний UI (`loading` $\rightarrow$ `Skeleton`, `empty` $\rightarrow$ `EmptyState`, `error` $\rightarrow$ кнопка повтора, `default` $\rightarrow$ `children`).
5. Токены и стили: использовать только CSS custom properties из `@ui-construction-library/tokens` (`--card`, `--card-foreground`, `--border`, `--muted-foreground`) без захардкоженных hex-цветов вне fallback-маппинга цветовых бейджей групп с проверенным контрастом WCAG AA.

---

### Фаза 2 — Keyboard-First Command Grammar (`[Entity] [Mnemonic] <GO>`) & Ratio Expression Parser

Модернизация существующего `packages/core/src/components/organisms/CommandPalette/CommandPalette.tsx` по паттерну Godel Terminal / Koyfin.

**Целевые файлы:**
- `[NEW]` `packages/core/src/components/organisms/CommandPalette/commandGrammar.ts`
- `[MODIFY]` `packages/core/src/components/organisms/CommandPalette/CommandPalette.tsx`
- `[NEW]` `packages/core/src/components/organisms/CommandPalette/CommandPalette.test.tsx` (или расширение существующих тестов)

**Точный контракт парсера (`commandGrammar.ts`):**
```ts
export type CommandMode = 'search' | 'mnemonic' | 'expression';
export type RatioOperator = '/' | '-' | '*';

export interface ParsedExpression {
  left: string;
  operator: RatioOperator;
  right: string;
}

export interface ParsedTerminalCommand {
  mode: CommandMode;
  subject?: string;
  mnemonic?: string;
  expression?: ParsedExpression;
  raw: string;
}

export const KNOWN_TERMINAL_MNEMONICS = [
  'DES',   // 30-second Security / Entity Tear Sheet
  'FA',    // Financial Analysis / Standardized Statements
  'EM',    // Earnings Matrix & Consensus Revisions
  'RV',    // Relative Valuation & Peer Comps
  'DDIS',  // Debt Maturity Wall
  'OWN',   // 13F Institutional & Insider Ownership
  'CF',    // Corporate Filings & Risk Factor Diff
  'SPLC',  // Supply Chain Exposure Graph
  'PORT',  // Portfolio Attribution & Stress Testing
  'TCA',   // Transaction Cost Analysis & Quarantine
  'RISK',  // Risk Limits & TiltGuard
  'FX',    // FX Forward & Cross-Rate Matrix
  'BMAP',  // Geospatial Map & Site Screening
  'MA',    // M&A Precedent Comps & Underwriting
  'WEI',   // Market / Fleet Overview Monitors
  'EQS',   // Parametric Screener
] as const;

export type TerminalMnemonic = (typeof KNOWN_TERMINAL_MNEMONICS)[number];

export function parseTerminalCommand(input: string): ParsedTerminalCommand;
```

**Правила парсинга:**
1. **Expression mode:** распознаёт выражения вида `SOLUSDT / BTCUSDT`, `AAPL/QQQ`, `XLE - CL1`, `BTCUSDT * 100` (поддержка операторов `/`, `-`, `*` с пробелами или без). Возвращает `{ mode: 'expression', expression: { left, operator, right }, raw }`.
2. **Mnemonic mode:** распознаёт `[Subject] [Mnemonic]` (регистронезависимо, с опциональными `<EQUITY>`, `<CRYPTO>`, `GO`), например:
   - `AAPL DES`, `AAPL FA`, `AAPL DDIS`
   - `BTCUSDT RISK`, `BTCUSDT TCA`, `USD/EUR FX`
   - `my-repo DES`, `outlet-1 SPLC`
   Также распознаёт одиночные команды уровня портфеля/рынка (`WEI`, `PORT`, `EQS`, `MA`).
3. **Search mode:** любой произвольный текст без совпадения с известным мнемоником или бинарным выражением.

**Доработки `CommandPalette.tsx`:**
- Добавить опциональные пропсы в `CommandPaletteProps` (обратно-совместимо!):
  - `onExecuteCommand?: (parsed: ParsedTerminalCommand) => void;`
  - `onPreviewItem?: (item: CommandPaletteItem) => void;` — вызывается при `ArrowUp`/`ArrowDown` для мгновенного broadcast-предпросмотра в активную цветовую группу `WidgetLinkBus`!
  - `knownMnemonics?: readonly string[];`
  - `shortcutHint?: string;` (рендерит `<Kbd>` бейджи рядом с пунктами и подсказку `Enter <GO>` для распознанных мнемоников).
- Экспортировать опциональный хук `useGlobalCommandShortcut({ onOpen, triggers: ['/', '`', 'Mod+k'] })` с проверкой `isEditableElement(document.activeElement)` (не перехватывает `/` и `` ` `` внутри `<input>`, `<textarea>`, `[contenteditable="true"]`) и SSR-гардом `typeof window !== 'undefined'`.

---

### Фаза 3 — Tiling Workspace & Synchronized Multi-Domain Chart Grid

**Целевые файлы:**
- `[NEW]` `packages/core/src/components/organisms/TilingWorkspace/TilingWorkspace.types.ts`
- `[NEW]` `packages/core/src/components/organisms/TilingWorkspace/TilingWorkspace.tsx`
- `[NEW]` `packages/core/src/components/organisms/TilingWorkspace/TilingWorkspace.test.tsx`
- `[NEW]` `packages/core/src/components/organisms/TilingWorkspace/index.ts`
- `[NEW]` `packages/core/src/components/organisms/SynchronizedChartGrid/SynchronizedChartGrid.types.ts`
- `[NEW]` `packages/core/src/components/organisms/SynchronizedChartGrid/SynchronizedChartGrid.tsx`
- `[NEW]` `packages/core/src/components/organisms/SynchronizedChartGrid/SynchronizedChartGrid.test.tsx`
- `[NEW]` `packages/core/src/components/organisms/SynchronizedChartGrid/index.ts`

**Спецификация `TilingWorkspace`:**
```ts
export type TilingPresetId = '1x1' | '2x1' | '1+2' | '2x2' | '3x2';

export interface TilingTileConfig {
  id: string;
  title: string;
  linkGroup: WidgetColorGroup;
  colSpan?: 1 | 2 | 3;
  rowSpan?: 1 | 2;
  render: (context: { isFocused: boolean; linkGroup: WidgetColorGroup }) => ReactNode;
}

export interface TilingWorkspaceProps {
  workspaceId: string;
  tiles: readonly TilingTileConfig[];
  preset?: TilingPresetId;
  onPresetChange?: (preset: TilingPresetId) => void;
  persistLayout?: boolean; // localStorage с try/catch и typeof window !== 'undefined'
  onFocusTile?: (tileId: string) => void;
}
```
- **Максимум 6 панелей** (`Alt+1` .. `Alt+6` переключают фокус напрямую на тайл $1 \dots 6$).
- На экранах `< 900px` CSS Grid автоматически схлопывается в одноколоночный стек без горизонтального переполнения.
- Поддержка переключения шаблонов раскладки (`1x1`, `2x1`, `1+2`, `2x2`, `3x2`) с сохранением в `localStorage` под ключом `ucl-tiling:${workspaceId}`.

**Спецификация `SynchronizedChartGrid`:**
- Чистый SVG-компонент (без тяжёлых внешних chart-зависимостей и без `d3` bloat), принимающий массив синхронизированных серий:
```ts
export interface SynchronizedSeriesPoint {
  timestampMs: number;
  label: string;
  /** Масштабированное целое значение (например, minor cents или bps — без float-арифметики в ядре). */
  valueScaled: number;
  scaleDecimals: number;
  formattedValue: string;
}

export interface SynchronizedChartPanelData {
  id: string;
  title: string;
  domain: 'price' | 'valuation_multiple' | 'macro' | 'eps_revision' | 'velocity' | 'spread_zscore';
  unitLabel: string;
  linkGroup?: WidgetColorGroup;
  series: readonly SynchronizedSeriesPoint[];
  thresholdLines?: ReadonlyArray<{ label: string; valueScaled: number; tone: 'neutral' | 'warning' | 'danger' }>;
}
```
- **Единый кроссхейр:** наведение мыши или фокус с клавиатуры (`ArrowLeft`/`ArrowRight` по точкам временной оси) устанавливает общий `activeIndex` / `activeTimestampMs` для всех панелей внутри сетки и публикует событие синхронизации в `WidgetLinkBus` при привязке к цветовой группе.
- **4 состояния UI:** загрузка (`loading`), пустые данные (`series.length === 0`), ошибка (`error` с `onRetry`), штатный рендер (`default`).

---

### Фаза 4 — Экспорт, Zod-схемы, API Snapshot & MCP Recipe

**Целевые файлы:**
- `[MODIFY]` `packages/core/src/components/organisms/index.ts` — реэкспорт `WidgetLinkBus`, `TilingWorkspace`, `SynchronizedChartGrid`, `parseTerminalCommand`.
- `[NEW]` `packages/schema/src/zod/widget-link.schema.ts` и `[MODIFY]` `packages/schema/src/zod/index.ts`.
- `[MODIFY]` `packages/core/api-snapshot.json` — пересборка командой `pnpm update:api`.
- `[MODIFY]` `scripts/mcp-server.mjs` и `scripts/mcp-server.test.mjs` — добавить рецепты `'terminal-workspace'` и `'widget-link-cockpit'` в `uilibrary_get_gold_kit_recipe`.

---

## 4. Детальный TDD-план (Red $\rightarrow$ Green $\rightarrow$ Refactor)

1. **`WidgetLinkBus.test.tsx` (Vitest + Testing Library):**
   - Публикация в группу `'green'` обновляет все подписанные компоненты с `'green'`, но не затрагивает `'blue'` и `'unlinked'`.
   - Циклический broadcast с тем же `sourceWidgetId` и `updatedAtMs` не вызывает бесконечного ререндера.
   - SSR-тест: вызов `renderToString(<WidgetLinkProvider>...</WidgetLinkProvider>)` в среде без `window` не бросает `ReferenceError`.
   - Query-параметры `?g_green=AAPL` корректно гидрируют начальное состояние.
   - Проверка `axe` / ARIA-ролей для переключателя цветовой группы (`radiogroup`, `aria-checked`).
2. **`CommandPalette.test.tsx` + `commandGrammar.test.ts`:**
   - `parseTerminalCommand('AAPL FA')` $\rightarrow$ `{ mode: 'mnemonic', subject: 'AAPL', mnemonic: 'FA' }`.
   - `parseTerminalCommand('AAPL US <EQUITY> DDIS <GO>')` $\rightarrow$ `{ mode: 'mnemonic', subject: 'AAPL US', mnemonic: 'DDIS' }`.
   - `parseTerminalCommand('SOLUSDT / BTCUSDT')` $\rightarrow$ `{ mode: 'expression', expression: { left: 'SOLUSDT', operator: '/', right: 'BTCUSDT' } }`.
   - Навигация `ArrowDown` вызывает `onPreviewItem` без закрытия палитры; `Enter` вызывает `onExecuteCommand`.
   - Хоткей `/` не срабатывает, когда фокус находится в `<input>` или `<textarea>`.
3. **`TilingWorkspace.test.tsx` & `SynchronizedChartGrid.test.tsx`:**
   - Нажатие `Alt+2` переводит фокус на 2-й тайл.
   - Наведение или `ArrowRight` на первом графике обновляет активный индекс кроссхейра на всех графиках в сетке.
   - Проверка рендера состояний `loading`, `empty`, `error` (с кнопкой retry).

---

## 5. Команды верификации

```bash
pnpm --filter @ui-construction-library/schema test
pnpm --filter @ui-construction-library/core test
pnpm update:api
pnpm check:api
pnpm check:boundaries
pnpm check:public-surface
pnpm lint && pnpm typecheck && pnpm build
```
После завершения всех фаз — оформить новый ADR в `.ai/adr/0004-widget-link-bus-and-terminal-grammar.md` и проиндексировать его в `.ai/ARCHITECTURE.md` в пределах бюджета 15 KB.
