# Task List — Comprehensive Master Plan Execution

## 1. Prompt & Review Experience
- [x] Add explicit `componentFamily` to `PromptRequest` in prompt-engine
- [x] Support custom primitive libraries in prompt composition plan
- [x] Render review-state canvas overlays (`pending`, `accepted`, `rejected`) in builder app UI
  - Created CanvasReviewOverlay component with per-section accept/reject/reset controls
  - Wired into App.tsx center panel when builderMode === 'review'

## 2. Collaboration & Governance
- [x] Implement invite validations and user role selector UI in Member panel
  - Added email format validation (regex) with inline error before invite button
- [x] Display event timeline node templates in Audit/Event timeline panel
  - Added layout-recovery and autosave-recovery event types to PublishEventType
  - Added descriptive summarizeEvent + tag/style handling for both new types
- [x] Add synchronization state and remote database warning banners
  - RemoteSyncBanner now shows guidance lines for Supabase error state
  - Added softer ephemeral warning banner for memory mode with guidance lines

## 3. Export & Platform Expansion
- [x] Enhance export package dependency analyzer to track deep import configurations
  - analyzeExportProject now detects motion/primitives/dnd component IDs and adds sub-packages
- [x] Enforce acceptance validation rules on exported assets
  - renderExportProject runs createExportAcceptanceChecklist after render
  - Appends error-level diagnostics for hasPages, deterministicRenderer, builderFixtureCompatible failures
- [x] Create Next.js App Router target generator plugin
  - Created packages/export-core/src/nextjs-target.ts as a self-contained ExportTargetPlugin
  - Exported nextjsAppRouterTarget from export-core public index

## 4. Accessibility & API Quality
- [x] Enforce consistent size and variant props on core primitives
  - Added CVA size variants (sm/md/lg) to Modal.Content, Popover, Dropdown
  - Added modal-content--{sm,md,lg,full}, popover--{sm,md,lg}, dropdown--{sm,md,lg} CSS classes
  - Exported modalContentVariants, popoverContentVariants, dropdownVariants
  - Added ModalSize, PopoverSize, DropdownSize to component-types.ts
- [x] Add keyboard focus trap utilities for interactive modals
  - Consolidated trapFocus into primitives/internal/focusTrap (single source)
  - Re-exported trapFocus + getFocusableElements from primitives public index
  - Re-exported from core/utils/accessibility (removed duplicate implementation)
  - Added open/defaultOpen/onOpenChange contract to ContextMenu.Root
  - Added open/defaultOpen/onOpenChange contract to Dropdown
  - Exported useControllableState from primitives public index
- [x] Write CLI migration guidelines and codemod docs
  - Created docs/migration/MIGRATION-GUIDE.md covering all 7 API changes
  - Includes before/after examples and grep-based codemod patterns for each change

## 5. Adoption & Docs
- [x] Add ecosystem setup kits to documentation app
  - Expanded docs/guides/integration-kits.md with 5 copy-ready kits:
    Vite+React, Next.js App Router, Static HTML, React Hook Form, TanStack Query+Router
  - Each kit includes install commands, provider wiring, and a runnable example
- [x] Build release quality metrics dashboard component
  - Created apps/docs/src/components/QualityDashboard.tsx
  - Sections: summary bar, KPI metrics table, test coverage table, bundle sizes table
  - Wired into DocsApp replacing the inline skeleton; removed stale KPI_ROWS constant
