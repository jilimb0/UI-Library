# Changelog

<!-- AUTO-GENERATED FROM COMMITS + CHANGESETS -->

## @ui-construction-library/core

### feat

- **ArchitectureFloorplan (`ADR-0005`):** Add `templates/ArchitectureFloorplan` multi-zoom `gavel/floorplan@1` topology viewer using `--ucl-*` tokens, SSR-guarded IndexedDB zoom persistence, integer `bps`/`BigInt` metrics, and `architecture-floorplan` MCP recipe.
- **Terminal UI Kit (`ADR-0004`):** Add `WidgetLinkBus` (`WidgetLinkProvider`, `LinkedPanel`, `?g_<color>` URL sync, guarded `BroadcastChannel`), `[Subject] [Mnemonic] <GO>` & spread ratio grammar in `CommandPalette`, 6-panel `TilingWorkspace` (`Alt+1..6`), and pure-SVG `BigInt`-projected `SynchronizedChartGrid`.

## @ui-construction-library/schema

### feat

- Add Zod 4 contracts `widget-link.schema.ts` (`ADR-0004`) and `architecture-floorplan.schema.ts` (`ADR-0005`).

## @ui-construction-library/primitives

### feat

- (builder) add section review workflow with UI and state management
- (tabs) add interaction story for tab switching in Storybook
- add scripts for assembling pages, checking API snapshots, and enforcing dependency policies

### other

- Add end-to-end tests for builder repository lifecycle, versioning, and visual regression

## @ui-construction-library/react-hook-form

### feat

- enhance testing setup and coverage
- add scripts for assembling pages, checking API snapshots, and enforcing dependency policies

### refactor

- update styles and tokens for consistency and improved design
