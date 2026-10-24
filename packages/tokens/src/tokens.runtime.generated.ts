/* AUTO-GENERATED from tokens.w3c.json — do not edit.           */
/* Re-generate: node packages/tokens/scripts/build-w3c.mjs       */

export const BASE_CSS: string =
  "/* AUTO-GENERATED from tokens.w3c.json — do not edit. */\n/* Source of truth: @ui-construction-library/tokens/src/tokens.w3c.json */\n/* Single --ucl- prefix. Non-color + primitive scales live in :root;\n   semantic + component-state are scoped to [data-theme]. */\n\n:root {\n  --ucl-color-neutral-50: #fbfbfd;\n  --ucl-color-neutral-100: #f5f5f7;\n  --ucl-color-neutral-200: #ececee;\n  --ucl-color-neutral-300: #d2d2d7;\n  --ucl-color-neutral-400: #86868b;\n  --ucl-color-neutral-500: #6e6e73;\n  --ucl-color-neutral-600: #3a3a3c;\n  --ucl-color-neutral-700: #1d1d1f;\n  --ucl-color-neutral-800: #0b0b0d;\n  --ucl-color-neutral-900: #000000;\n  --ucl-color-success-50: #ecfaf3;\n  --ucl-color-success-100: #d6f2e3;\n  --ucl-color-success-500: #2e9e6b;\n  --ucl-color-success-600: #24875c;\n  --ucl-color-success-700: #1d6e4b;\n  --ucl-color-success-900: #0a3d28;\n  --ucl-color-warning-50: #fbf4e6;\n  --ucl-color-warning-100: #f6e6c8;\n  --ucl-color-warning-500: #c98a2b;\n  --ucl-color-warning-600: #b0771f;\n  --ucl-color-warning-700: #8f5f17;\n  --ucl-color-warning-900: #4a3209;\n  --ucl-color-error-50: #fbeeec;\n  --ucl-color-error-100: #f7d6d2;\n  --ucl-color-error-500: #d94545;\n  --ucl-color-error-600: #c63838;\n  --ucl-color-error-700: #a32a2a;\n  --ucl-color-error-900: #5a1212;\n  --ucl-color-info-50: #eef3fb;\n  --ucl-color-info-100: #d6e2f6;\n  --ucl-color-info-500: #3b82f6;\n  --ucl-color-info-600: #2f6fd9;\n  --ucl-color-info-700: #2659b3;\n  --ucl-color-info-900: #122a66;\n  --ucl-radius-none: 0px;\n  --ucl-radius-xs: 4px;\n  --ucl-radius-sm: 6px;\n  --ucl-radius-md: 10px;\n  --ucl-radius-lg: 16px;\n  --ucl-radius-xl: 20px;\n  --ucl-radius-full: 9999px;\n  --ucl-spacing-0: 0px;\n  --ucl-spacing-1: 0.25rem;\n  --ucl-spacing-2: 0.5rem;\n  --ucl-spacing-3: 0.75rem;\n  --ucl-spacing-4: 1rem;\n  --ucl-spacing-5: 1.25rem;\n  --ucl-spacing-6: 1.5rem;\n  --ucl-spacing-7: 1.75rem;\n  --ucl-spacing-8: 2rem;\n  --ucl-spacing-9: 2.25rem;\n  --ucl-spacing-10: 2.5rem;\n  --ucl-spacing-11: 2.75rem;\n  --ucl-spacing-12: 3rem;\n  --ucl-spacing-14: 3.5rem;\n  --ucl-spacing-16: 4rem;\n  --ucl-spacing-20: 5rem;\n  --ucl-spacing-24: 6rem;\n  --ucl-spacing-28: 7rem;\n  --ucl-spacing-32: 8rem;\n  --ucl-spacing-36: 9rem;\n  --ucl-spacing-40: 10rem;\n  --ucl-spacing-44: 11rem;\n  --ucl-spacing-48: 12rem;\n  --ucl-spacing-56: 14rem;\n  --ucl-spacing-64: 16rem;\n  --ucl-spacing-0.5: 0.125rem;\n  --ucl-spacing-1.5: 0.375rem;\n  --ucl-spacing-2.5: 0.625rem;\n  --ucl-spacing-3.5: 0.875rem;\n  --ucl-font-sans: -apple-system, \"SF Pro Text\", \"Inter\", system-ui, ui-sans-serif, sans-serif;\n  --ucl-font-serif: \"Source Serif 4\", ui-serif, Georgia, Cambria, \"Times New Roman\", serif;\n  --ucl-font-mono: \"SF Mono\", \"JetBrains Mono\", ui-monospace, SFMono-Regular, Consolas, Menlo, monospace;\n  --ucl-text-xs: 0.75rem;\n  --ucl-text-sm: 0.875rem;\n  --ucl-text-base: 1rem;\n  --ucl-text-lg: 1.125rem;\n  --ucl-text-xl: 1.25rem;\n  --ucl-text-2xl: 1.5rem;\n  --ucl-text-3xl: 1.875rem;\n  --ucl-text-4xl: 2.25rem;\n  --ucl-text-5xl: 3rem;\n  --ucl-text-6xl: 3.75rem;\n  --ucl-leading-tight: 1.1;\n  --ucl-leading-snug: 1.25;\n  --ucl-leading-normal: 1.5;\n  --ucl-leading-relaxed: 1.7;\n  --ucl-tracking-tighter: -0.03em;\n  --ucl-tracking-tight: -0.015em;\n  --ucl-tracking-normal: 0;\n  --ucl-tracking-wide: 0.02em;\n  --ucl-tracking-wider: 0.08em;\n  --ucl-weight-thin: 100;\n  --ucl-weight-extralight: 200;\n  --ucl-weight-light: 300;\n  --ucl-weight-normal: 400;\n  --ucl-weight-medium: 500;\n  --ucl-weight-semibold: 600;\n  --ucl-weight-bold: 700;\n  --ucl-weight-extrabold: 800;\n  --ucl-weight-black: 900;\n  --ucl-shadow-sm: 0 1px 2px rgba(0,0,0,0.04);\n  --ucl-shadow-md: 0 1px 1px rgba(0,0,0,0.05), 0 8px 14px rgba(0,0,0,0.05);\n  --ucl-shadow-lg: 0 1px 1px rgba(0,0,0,0.05), 0 12px 24px rgba(0,0,0,0.06);\n  --ucl-shadow-xl: 0 2px 4px rgba(0,0,0,0.05), 0 20px 40px rgba(0,0,0,0.08);\n  --ucl-duration-instant: 0ms;\n  --ucl-duration-fast: 150ms;\n  --ucl-duration-normal: 200ms;\n  --ucl-duration-slow: 300ms;\n  --ucl-duration-slower: 500ms;\n  --ucl-ease-linear: linear;\n  --ucl-ease-in: cubic-bezier(0.4, 0, 1, 1);\n  --ucl-ease-out: cubic-bezier(0, 0, 0.2, 1);\n  --ucl-ease-inOut: cubic-bezier(0.4, 0, 0.2, 1);\n  --ucl-ease-emphasized: cubic-bezier(0.2, 0, 0, 1);\n  --ucl-z-base: 0;\n  --ucl-z-dropdown: 1000;\n  --ucl-z-sticky: 1100;\n  --ucl-z-fixed: 1200;\n  --ucl-z-modal: 1300;\n  --ucl-z-popover: 1400;\n  --ucl-z-tooltip: 1500;\n  --ucl-opacity-0: 0;\n  --ucl-opacity-25: 0.25;\n  --ucl-opacity-50: 0.5;\n  --ucl-opacity-75: 0.75;\n  --ucl-opacity-90: 0.9;\n  --ucl-opacity-100: 1;\n}\n\n:root:not([data-theme]), [data-theme=\"light\"] {\n  --ucl-color-background: #fbfbfd;\n  --ucl-color-foreground: #1d1d1f;\n  --ucl-color-card: #ffffff;\n  --ucl-color-card-foreground: #1d1d1f;\n  --ucl-color-popover: #ffffff;\n  --ucl-color-popover-foreground: #1d1d1f;\n  --ucl-color-muted: #f5f5f7;\n  --ucl-color-muted-foreground: #6e6e73;\n  --ucl-color-accent: #f5f5f7;\n  --ucl-color-accent-foreground: #1d1d1f;\n  --ucl-color-border: #d2d2d7;\n  --ucl-color-input: #d2d2d7;\n  --ucl-color-ring: #1d1d1f;\n  --ucl-color-primary: #1d1d1f;\n  --ucl-color-primary-foreground: #ffffff;\n  --ucl-color-secondary: #f5f5f7;\n  --ucl-color-secondary-foreground: #1d1d1f;\n  --ucl-color-success: #2e9e6b;\n  --ucl-color-success-foreground: #ffffff;\n  --ucl-color-warning: #c98a2b;\n  --ucl-color-warning-foreground: #ffffff;\n  --ucl-color-error: #d94545;\n  --ucl-color-error-foreground: #ffffff;\n  --ucl-color-info: #3b82f6;\n  --ucl-color-info-foreground: #ffffff;\n  --ucl-intent-success-bg: #ecfaf3;\n  --ucl-intent-success-fg: #1d6e4b;\n  --ucl-intent-success-border: #d6f2e3;\n  --ucl-intent-error-bg: #fbeeec;\n  --ucl-intent-error-fg: #a32a2a;\n  --ucl-intent-error-border: #f7d6d2;\n  --ucl-intent-warning-bg: #fbf4e6;\n  --ucl-intent-warning-fg: #8f5f17;\n  --ucl-intent-warning-border: #f6e6c8;\n  --ucl-intent-info-bg: #eef3fb;\n  --ucl-intent-info-fg: #2659b3;\n  --ucl-intent-info-border: #d6e2f6;\n  --ucl-button-primary-default: #1d1d1f;\n  --ucl-button-primary-hover: #000000;\n  --ucl-button-primary-active: #000000;\n  --ucl-button-primary-focus: #1d1d1f;\n  --ucl-button-primary-disabled: #d2d2d7;\n  --ucl-button-primary-fg: #ffffff;\n  --ucl-button-secondary-default: #f5f5f7;\n  --ucl-button-secondary-hover: #ececee;\n  --ucl-button-secondary-active: #d2d2d7;\n  --ucl-button-secondary-focus: #f5f5f7;\n  --ucl-button-secondary-disabled: #f5f5f7;\n  --ucl-button-secondary-fg: #1d1d1f;\n  --ucl-button-ghost-default: transparent;\n  --ucl-button-ghost-hover: #f5f5f7;\n  --ucl-button-ghost-active: #ececee;\n  --ucl-button-ghost-focus: transparent;\n  --ucl-button-ghost-disabled: transparent;\n  --ucl-button-ghost-fg: #1d1d1f;\n  --ucl-button-outline-default: #ffffff;\n  --ucl-button-outline-hover: #f5f5f7;\n  --ucl-button-outline-active: #ececee;\n  --ucl-button-outline-focus: #ffffff;\n  --ucl-button-outline-disabled: #f5f5f7;\n  --ucl-button-outline-fg: #1d1d1f;\n  --ucl-input-bg-default: #ffffff;\n  --ucl-input-bg-hover: #ffffff;\n  --ucl-input-bg-active: #ffffff;\n  --ucl-input-bg-focus: #ffffff;\n  --ucl-input-bg-disabled: #f5f5f7;\n  --ucl-input-border-default: #d2d2d7;\n  --ucl-input-border-hover: #86868b;\n  --ucl-input-border-active: #6e6e73;\n  --ucl-input-border-focus: #1d1d1f;\n  --ucl-input-border-disabled: #d2d2d7;\n  --ucl-input-border-error: #d94545;\n  --ucl-input-fg: #1d1d1f;\n  --ucl-input-placeholder: #86868b;\n  --ucl-input-ring: #1d1d1f;\n  --ucl-card-bg-default: #ffffff;\n  --ucl-card-bg-raised: #fbfbfd;\n  --ucl-card-bg-glass: rgba(255,255,255,0.72);\n  --ucl-card-border: #d2d2d7;\n  --ucl-card-shadow: 0 1px 1px rgba(0,0,0,0.05), 0 8px 14px rgba(0,0,0,0.05);\n  --ucl-badge-default-bg: #f5f5f7;\n  --ucl-badge-default-fg: #1d1d1f;\n  --ucl-badge-success-bg: #ecfaf3;\n  --ucl-badge-success-fg: #1d6e4b;\n  --ucl-badge-success-border: #d6f2e3;\n  --ucl-badge-warning-bg: #fbf4e6;\n  --ucl-badge-warning-fg: #8f5f17;\n  --ucl-badge-warning-border: #f6e6c8;\n  --ucl-badge-error-bg: #fbeeec;\n  --ucl-badge-error-fg: #a32a2a;\n  --ucl-badge-error-border: #f7d6d2;\n  --ucl-badge-info-bg: #eef3fb;\n  --ucl-badge-info-fg: #2659b3;\n  --ucl-badge-info-border: #d6e2f6;\n  --ucl-select-trigger-default: #ffffff;\n  --ucl-select-trigger-hover: #ffffff;\n  --ucl-select-trigger-active: #ffffff;\n  --ucl-select-trigger-focus: #ffffff;\n  --ucl-select-trigger-disabled: #f5f5f7;\n  --ucl-select-border-default: #d2d2d7;\n  --ucl-select-border-hover: #86868b;\n  --ucl-select-border-active: #6e6e73;\n  --ucl-select-border-focus: #1d1d1f;\n  --ucl-select-border-disabled: #d2d2d7;\n  --ucl-select-border-error: #d94545;\n  --ucl-select-fg: #1d1d1f;\n  --ucl-select-placeholder: #86868b;\n  --ucl-select-optionBg-default: #ffffff;\n  --ucl-select-optionBg-hover: #f5f5f7;\n  --ucl-select-optionBg-selected: #ececee;\n  --ucl-switch-track-off: #d2d2d7;\n  --ucl-switch-track-on: #1d1d1f;\n  --ucl-switch-track-disabled: #ececee;\n  --ucl-switch-thumb: #ffffff;\n  --ucl-checkbox-bg-unchecked: #ffffff;\n  --ucl-checkbox-bg-checked: #1d1d1f;\n  --ucl-checkbox-bg-disabled: #f5f5f7;\n  --ucl-checkbox-border-default: #d2d2d7;\n  --ucl-checkbox-border-hover: #86868b;\n  --ucl-checkbox-border-checked: #1d1d1f;\n  --ucl-checkbox-border-disabled: #d2d2d7;\n  --ucl-checkbox-fg: #ffffff;\n  --ucl-radio-accent: #1d1d1f;\n  --ucl-radio-border-default: #d2d2d7;\n  --ucl-radio-border-hover: #86868b;\n  --ucl-radio-border-disabled: #d2d2d7;\n  --ucl-slider-track-bg: #ececee;\n  --ucl-slider-range-bg: #1d1d1f;\n  --ucl-slider-thumb-bg: #ffffff;\n  --ucl-slider-thumb-border: #1d1d1f;\n  --ucl-slider-thumb-hover: #000000;\n  --ucl-slider-thumb-disabled: #d2d2d7;\n  --ucl-tabs-list-bg: #f5f5f7;\n  --ucl-tabs-trigger-default: transparent;\n  --ucl-tabs-trigger-hover: #ececee;\n  --ucl-tabs-trigger-active: #ffffff;\n  --ucl-tabs-trigger-fg-default: #6e6e73;\n  --ucl-tabs-trigger-fg-active: #1d1d1f;\n  --ucl-accordion-trigger-default: transparent;\n  --ucl-accordion-trigger-hover: #f5f5f7;\n  --ucl-accordion-trigger-fg: #1d1d1f;\n  --ucl-accordion-content-fg: #6e6e73;\n  --ucl-accordion-border: #d2d2d7;\n  --ucl-pagination-btn-bg: #ffffff;\n  --ucl-pagination-btn-bg-hover: #f5f5f7;\n  --ucl-pagination-btn-bg-active: #1d1d1f;\n  --ucl-pagination-btn-border: #d2d2d7;\n  --ucl-pagination-btn-fg: #1d1d1f;\n  --ucl-pagination-btn-fg-active: #ffffff;\n  --ucl-tooltip-bg: #1d1d1f;\n  --ucl-tooltip-fg: #ffffff;\n  --ucl-tooltip-border: transparent;\n  --ucl-dropdown-menu-bg: #ffffff;\n  --ucl-dropdown-item-bg-default: transparent;\n  --ucl-dropdown-item-bg-hover: #f5f5f7;\n  --ucl-dropdown-item-bg-active: #1d1d1f;\n  --ucl-dropdown-item-bg-destructive-hover: #fbeeec;\n  --ucl-dropdown-item-fg-default: #1d1d1f;\n  --ucl-dropdown-item-fg-active: #ffffff;\n  --ucl-dropdown-item-fg-destructive: #d94545;\n  --ucl-dropdown-trigger-border: #d2d2d7;\n  --ucl-dropdown-trigger-bg-default: #ffffff;\n  --ucl-dropdown-trigger-bg-hover: #f5f5f7;\n}\n\n[data-theme=\"dark\"] {\n  --ucl-color-background: #0b0b0d;\n  --ucl-color-foreground: #f5f5f7;\n  --ucl-color-card: #161618;\n  --ucl-color-card-foreground: #f5f5f7;\n  --ucl-color-popover: #161618;\n  --ucl-color-popover-foreground: #f5f5f7;\n  --ucl-color-muted: #1d1d1f;\n  --ucl-color-muted-foreground: #86868b;\n  --ucl-color-accent: #1d1d1f;\n  --ucl-color-accent-foreground: #f5f5f7;\n  --ucl-color-border: rgba(255,255,255,0.10);\n  --ucl-color-input: rgba(255,255,255,0.10);\n  --ucl-color-ring: #f5f5f7;\n  --ucl-color-primary: #f5f5f7;\n  --ucl-color-primary-foreground: #1d1d1f;\n  --ucl-color-secondary: #1d1d1f;\n  --ucl-color-secondary-foreground: #f5f5f7;\n  --ucl-color-success: #3ab07f;\n  --ucl-color-success-foreground: #062b1c;\n  --ucl-color-warning: #d9a23a;\n  --ucl-color-warning-foreground: #2a1c08;\n  --ucl-color-error: #e05858;\n  --ucl-color-error-foreground: #2a0c0c;\n  --ucl-color-info: #5b8def;\n  --ucl-color-info-foreground: #0a1a3a;\n  --ucl-intent-success-bg: #0a2a1c;\n  --ucl-intent-success-fg: #7fd9b0;\n  --ucl-intent-success-border: #1d6e4b;\n  --ucl-intent-error-bg: #2a0c0c;\n  --ucl-intent-error-fg: #f0a3a3;\n  --ucl-intent-error-border: #a32a2a;\n  --ucl-intent-warning-bg: #2a1c08;\n  --ucl-intent-warning-fg: #f0c987;\n  --ucl-intent-warning-border: #8f5f17;\n  --ucl-intent-info-bg: #0a1a3a;\n  --ucl-intent-info-fg: #a9c2f5;\n  --ucl-intent-info-border: #2659b3;\n  --ucl-button-primary-default: #f5f5f7;\n  --ucl-button-primary-hover: #ffffff;\n  --ucl-button-primary-active: #e6e6e8;\n  --ucl-button-primary-focus: #f5f5f7;\n  --ucl-button-primary-disabled: #3a3a3c;\n  --ucl-button-primary-fg: #1d1d1f;\n  --ucl-button-secondary-default: #1d1d1f;\n  --ucl-button-secondary-hover: #2a2a2c;\n  --ucl-button-secondary-active: #3a3a3c;\n  --ucl-button-secondary-focus: #1d1d1f;\n  --ucl-button-secondary-disabled: #1d1d1f;\n  --ucl-button-secondary-fg: #f5f5f7;\n  --ucl-button-ghost-default: transparent;\n  --ucl-button-ghost-hover: #1d1d1f;\n  --ucl-button-ghost-active: #2a2a2c;\n  --ucl-button-ghost-focus: transparent;\n  --ucl-button-ghost-disabled: transparent;\n  --ucl-button-ghost-fg: #f5f5f7;\n  --ucl-button-outline-default: transparent;\n  --ucl-button-outline-hover: #1d1d1f;\n  --ucl-button-outline-active: #2a2a2c;\n  --ucl-button-outline-focus: transparent;\n  --ucl-button-outline-disabled: #1d1d1f;\n  --ucl-button-outline-fg: #f5f5f7;\n  --ucl-input-bg-default: #161618;\n  --ucl-input-bg-hover: #161618;\n  --ucl-input-bg-active: #161618;\n  --ucl-input-bg-focus: #161618;\n  --ucl-input-bg-disabled: #1d1d1f;\n  --ucl-input-border-default: rgba(255,255,255,0.10);\n  --ucl-input-border-hover: rgba(255,255,255,0.16);\n  --ucl-input-border-active: rgba(255,255,255,0.22);\n  --ucl-input-border-focus: #f5f5f7;\n  --ucl-input-border-disabled: rgba(255,255,255,0.10);\n  --ucl-input-border-error: #e05858;\n  --ucl-input-fg: #f5f5f7;\n  --ucl-input-placeholder: #86868b;\n  --ucl-input-ring: #f5f5f7;\n  --ucl-card-bg-default: #161618;\n  --ucl-card-bg-raised: #1d1d1f;\n  --ucl-card-bg-glass: rgba(20,20,22,0.72);\n  --ucl-card-border: rgba(255,255,255,0.10);\n  --ucl-card-shadow: 0 1px 2px rgba(0,0,0,0.4), 0 12px 24px rgba(0,0,0,0.5);\n  --ucl-badge-default-bg: #1d1d1f;\n  --ucl-badge-default-fg: #f5f5f7;\n  --ucl-badge-success-bg: #0a2a1c;\n  --ucl-badge-success-fg: #7fd9b0;\n  --ucl-badge-success-border: #1d6e4b;\n  --ucl-badge-warning-bg: #2a1c08;\n  --ucl-badge-warning-fg: #f0c987;\n  --ucl-badge-warning-border: #8f5f17;\n  --ucl-badge-error-bg: #2a0c0c;\n  --ucl-badge-error-fg: #f0a3a3;\n  --ucl-badge-error-border: #a32a2a;\n  --ucl-badge-info-bg: #0a1a3a;\n  --ucl-badge-info-fg: #a9c2f5;\n  --ucl-badge-info-border: #2659b3;\n  --ucl-select-trigger-default: #161618;\n  --ucl-select-trigger-hover: #161618;\n  --ucl-select-trigger-active: #161618;\n  --ucl-select-trigger-focus: #161618;\n  --ucl-select-trigger-disabled: #1d1d1f;\n  --ucl-select-border-default: rgba(255,255,255,0.10);\n  --ucl-select-border-hover: rgba(255,255,255,0.16);\n  --ucl-select-border-active: rgba(255,255,255,0.22);\n  --ucl-select-border-focus: #f5f5f7;\n  --ucl-select-border-disabled: rgba(255,255,255,0.10);\n  --ucl-select-border-error: #e05858;\n  --ucl-select-fg: #f5f5f7;\n  --ucl-select-placeholder: #86868b;\n  --ucl-select-optionBg-default: #161618;\n  --ucl-select-optionBg-hover: #1d1d1f;\n  --ucl-select-optionBg-selected: #2a2a2c;\n  --ucl-switch-track-off: #3a3a3c;\n  --ucl-switch-track-on: #f5f5f7;\n  --ucl-switch-track-disabled: #2a2a2c;\n  --ucl-switch-thumb: #161618;\n  --ucl-checkbox-bg-unchecked: #161618;\n  --ucl-checkbox-bg-checked: #f5f5f7;\n  --ucl-checkbox-bg-disabled: #1d1d1f;\n  --ucl-checkbox-border-default: rgba(255,255,255,0.10);\n  --ucl-checkbox-border-hover: rgba(255,255,255,0.22);\n  --ucl-checkbox-border-checked: #f5f5f7;\n  --ucl-checkbox-border-disabled: rgba(255,255,255,0.10);\n  --ucl-checkbox-fg: #1d1d1f;\n  --ucl-radio-accent: #f5f5f7;\n  --ucl-radio-border-default: rgba(255,255,255,0.10);\n  --ucl-radio-border-hover: rgba(255,255,255,0.22);\n  --ucl-radio-border-disabled: rgba(255,255,255,0.10);\n  --ucl-slider-track-bg: #3a3a3c;\n  --ucl-slider-range-bg: #f5f5f7;\n  --ucl-slider-thumb-bg: #161618;\n  --ucl-slider-thumb-border: #f5f5f7;\n  --ucl-slider-thumb-hover: #ffffff;\n  --ucl-slider-thumb-disabled: #3a3a3c;\n  --ucl-tabs-list-bg: #1d1d1f;\n  --ucl-tabs-trigger-default: transparent;\n  --ucl-tabs-trigger-hover: #2a2a2c;\n  --ucl-tabs-trigger-active: #161618;\n  --ucl-tabs-trigger-fg-default: #86868b;\n  --ucl-tabs-trigger-fg-active: #f5f5f7;\n  --ucl-accordion-trigger-default: transparent;\n  --ucl-accordion-trigger-hover: #1d1d1f;\n  --ucl-accordion-trigger-fg: #f5f5f7;\n  --ucl-accordion-content-fg: #86868b;\n  --ucl-accordion-border: rgba(255,255,255,0.10);\n  --ucl-pagination-btn-bg: #161618;\n  --ucl-pagination-btn-bg-hover: #1d1d1f;\n  --ucl-pagination-btn-bg-active: #f5f5f7;\n  --ucl-pagination-btn-border: rgba(255,255,255,0.10);\n  --ucl-pagination-btn-fg: #f5f5f7;\n  --ucl-pagination-btn-fg-active: #1d1d1f;\n  --ucl-tooltip-bg: #f5f5f7;\n  --ucl-tooltip-fg: #1d1d1f;\n  --ucl-tooltip-border: transparent;\n  --ucl-dropdown-menu-bg: #161618;\n  --ucl-dropdown-item-bg-default: transparent;\n  --ucl-dropdown-item-bg-hover: #1d1d1f;\n  --ucl-dropdown-item-bg-active: #f5f5f7;\n  --ucl-dropdown-item-bg-destructive-hover: #2a0c0c;\n  --ucl-dropdown-item-fg-default: #f5f5f7;\n  --ucl-dropdown-item-fg-active: #1d1d1f;\n  --ucl-dropdown-item-fg-destructive: #e05858;\n  --ucl-dropdown-trigger-border: rgba(255,255,255,0.10);\n  --ucl-dropdown-trigger-bg-default: #161618;\n  --ucl-dropdown-trigger-bg-hover: #1d1d1f;\n}\n";

export const LIGHT_CSS: string =
  ":root:not([data-theme]), [data-theme=\"light\"] {\n  --ucl-color-background: #fbfbfd;\n  --ucl-color-foreground: #1d1d1f;\n  --ucl-color-card: #ffffff;\n  --ucl-color-card-foreground: #1d1d1f;\n  --ucl-color-popover: #ffffff;\n  --ucl-color-popover-foreground: #1d1d1f;\n  --ucl-color-muted: #f5f5f7;\n  --ucl-color-muted-foreground: #6e6e73;\n  --ucl-color-accent: #f5f5f7;\n  --ucl-color-accent-foreground: #1d1d1f;\n  --ucl-color-border: #d2d2d7;\n  --ucl-color-input: #d2d2d7;\n  --ucl-color-ring: #1d1d1f;\n  --ucl-color-primary: #1d1d1f;\n  --ucl-color-primary-foreground: #ffffff;\n  --ucl-color-secondary: #f5f5f7;\n  --ucl-color-secondary-foreground: #1d1d1f;\n  --ucl-color-success: #2e9e6b;\n  --ucl-color-success-foreground: #ffffff;\n  --ucl-color-warning: #c98a2b;\n  --ucl-color-warning-foreground: #ffffff;\n  --ucl-color-error: #d94545;\n  --ucl-color-error-foreground: #ffffff;\n  --ucl-color-info: #3b82f6;\n  --ucl-color-info-foreground: #ffffff;\n  --ucl-intent-success-bg: #ecfaf3;\n  --ucl-intent-success-fg: #1d6e4b;\n  --ucl-intent-success-border: #d6f2e3;\n  --ucl-intent-error-bg: #fbeeec;\n  --ucl-intent-error-fg: #a32a2a;\n  --ucl-intent-error-border: #f7d6d2;\n  --ucl-intent-warning-bg: #fbf4e6;\n  --ucl-intent-warning-fg: #8f5f17;\n  --ucl-intent-warning-border: #f6e6c8;\n  --ucl-intent-info-bg: #eef3fb;\n  --ucl-intent-info-fg: #2659b3;\n  --ucl-intent-info-border: #d6e2f6;\n  --ucl-button-primary-default: #1d1d1f;\n  --ucl-button-primary-hover: #000000;\n  --ucl-button-primary-active: #000000;\n  --ucl-button-primary-focus: #1d1d1f;\n  --ucl-button-primary-disabled: #d2d2d7;\n  --ucl-button-primary-fg: #ffffff;\n  --ucl-button-secondary-default: #f5f5f7;\n  --ucl-button-secondary-hover: #ececee;\n  --ucl-button-secondary-active: #d2d2d7;\n  --ucl-button-secondary-focus: #f5f5f7;\n  --ucl-button-secondary-disabled: #f5f5f7;\n  --ucl-button-secondary-fg: #1d1d1f;\n  --ucl-button-ghost-default: transparent;\n  --ucl-button-ghost-hover: #f5f5f7;\n  --ucl-button-ghost-active: #ececee;\n  --ucl-button-ghost-focus: transparent;\n  --ucl-button-ghost-disabled: transparent;\n  --ucl-button-ghost-fg: #1d1d1f;\n  --ucl-button-outline-default: #ffffff;\n  --ucl-button-outline-hover: #f5f5f7;\n  --ucl-button-outline-active: #ececee;\n  --ucl-button-outline-focus: #ffffff;\n  --ucl-button-outline-disabled: #f5f5f7;\n  --ucl-button-outline-fg: #1d1d1f;\n  --ucl-input-bg-default: #ffffff;\n  --ucl-input-bg-hover: #ffffff;\n  --ucl-input-bg-active: #ffffff;\n  --ucl-input-bg-focus: #ffffff;\n  --ucl-input-bg-disabled: #f5f5f7;\n  --ucl-input-border-default: #d2d2d7;\n  --ucl-input-border-hover: #86868b;\n  --ucl-input-border-active: #6e6e73;\n  --ucl-input-border-focus: #1d1d1f;\n  --ucl-input-border-disabled: #d2d2d7;\n  --ucl-input-border-error: #d94545;\n  --ucl-input-fg: #1d1d1f;\n  --ucl-input-placeholder: #86868b;\n  --ucl-input-ring: #1d1d1f;\n  --ucl-card-bg-default: #ffffff;\n  --ucl-card-bg-raised: #fbfbfd;\n  --ucl-card-bg-glass: rgba(255,255,255,0.72);\n  --ucl-card-border: #d2d2d7;\n  --ucl-card-shadow: 0 1px 1px rgba(0,0,0,0.05), 0 8px 14px rgba(0,0,0,0.05);\n  --ucl-badge-default-bg: #f5f5f7;\n  --ucl-badge-default-fg: #1d1d1f;\n  --ucl-badge-success-bg: #ecfaf3;\n  --ucl-badge-success-fg: #1d6e4b;\n  --ucl-badge-success-border: #d6f2e3;\n  --ucl-badge-warning-bg: #fbf4e6;\n  --ucl-badge-warning-fg: #8f5f17;\n  --ucl-badge-warning-border: #f6e6c8;\n  --ucl-badge-error-bg: #fbeeec;\n  --ucl-badge-error-fg: #a32a2a;\n  --ucl-badge-error-border: #f7d6d2;\n  --ucl-badge-info-bg: #eef3fb;\n  --ucl-badge-info-fg: #2659b3;\n  --ucl-badge-info-border: #d6e2f6;\n  --ucl-select-trigger-default: #ffffff;\n  --ucl-select-trigger-hover: #ffffff;\n  --ucl-select-trigger-active: #ffffff;\n  --ucl-select-trigger-focus: #ffffff;\n  --ucl-select-trigger-disabled: #f5f5f7;\n  --ucl-select-border-default: #d2d2d7;\n  --ucl-select-border-hover: #86868b;\n  --ucl-select-border-active: #6e6e73;\n  --ucl-select-border-focus: #1d1d1f;\n  --ucl-select-border-disabled: #d2d2d7;\n  --ucl-select-border-error: #d94545;\n  --ucl-select-fg: #1d1d1f;\n  --ucl-select-placeholder: #86868b;\n  --ucl-select-optionBg-default: #ffffff;\n  --ucl-select-optionBg-hover: #f5f5f7;\n  --ucl-select-optionBg-selected: #ececee;\n  --ucl-switch-track-off: #d2d2d7;\n  --ucl-switch-track-on: #1d1d1f;\n  --ucl-switch-track-disabled: #ececee;\n  --ucl-switch-thumb: #ffffff;\n  --ucl-checkbox-bg-unchecked: #ffffff;\n  --ucl-checkbox-bg-checked: #1d1d1f;\n  --ucl-checkbox-bg-disabled: #f5f5f7;\n  --ucl-checkbox-border-default: #d2d2d7;\n  --ucl-checkbox-border-hover: #86868b;\n  --ucl-checkbox-border-checked: #1d1d1f;\n  --ucl-checkbox-border-disabled: #d2d2d7;\n  --ucl-checkbox-fg: #ffffff;\n  --ucl-radio-accent: #1d1d1f;\n  --ucl-radio-border-default: #d2d2d7;\n  --ucl-radio-border-hover: #86868b;\n  --ucl-radio-border-disabled: #d2d2d7;\n  --ucl-slider-track-bg: #ececee;\n  --ucl-slider-range-bg: #1d1d1f;\n  --ucl-slider-thumb-bg: #ffffff;\n  --ucl-slider-thumb-border: #1d1d1f;\n  --ucl-slider-thumb-hover: #000000;\n  --ucl-slider-thumb-disabled: #d2d2d7;\n  --ucl-tabs-list-bg: #f5f5f7;\n  --ucl-tabs-trigger-default: transparent;\n  --ucl-tabs-trigger-hover: #ececee;\n  --ucl-tabs-trigger-active: #ffffff;\n  --ucl-tabs-trigger-fg-default: #6e6e73;\n  --ucl-tabs-trigger-fg-active: #1d1d1f;\n  --ucl-accordion-trigger-default: transparent;\n  --ucl-accordion-trigger-hover: #f5f5f7;\n  --ucl-accordion-trigger-fg: #1d1d1f;\n  --ucl-accordion-content-fg: #6e6e73;\n  --ucl-accordion-border: #d2d2d7;\n  --ucl-pagination-btn-bg: #ffffff;\n  --ucl-pagination-btn-bg-hover: #f5f5f7;\n  --ucl-pagination-btn-bg-active: #1d1d1f;\n  --ucl-pagination-btn-border: #d2d2d7;\n  --ucl-pagination-btn-fg: #1d1d1f;\n  --ucl-pagination-btn-fg-active: #ffffff;\n  --ucl-tooltip-bg: #1d1d1f;\n  --ucl-tooltip-fg: #ffffff;\n  --ucl-tooltip-border: transparent;\n  --ucl-dropdown-menu-bg: #ffffff;\n  --ucl-dropdown-item-bg-default: transparent;\n  --ucl-dropdown-item-bg-hover: #f5f5f7;\n  --ucl-dropdown-item-bg-active: #1d1d1f;\n  --ucl-dropdown-item-bg-destructive-hover: #fbeeec;\n  --ucl-dropdown-item-fg-default: #1d1d1f;\n  --ucl-dropdown-item-fg-active: #ffffff;\n  --ucl-dropdown-item-fg-destructive: #d94545;\n  --ucl-dropdown-trigger-border: #d2d2d7;\n  --ucl-dropdown-trigger-bg-default: #ffffff;\n  --ucl-dropdown-trigger-bg-hover: #f5f5f7;\n}";

export const DARK_CSS: string =
  "[data-theme=\"dark\"] {\n  --ucl-color-background: #0b0b0d;\n  --ucl-color-foreground: #f5f5f7;\n  --ucl-color-card: #161618;\n  --ucl-color-card-foreground: #f5f5f7;\n  --ucl-color-popover: #161618;\n  --ucl-color-popover-foreground: #f5f5f7;\n  --ucl-color-muted: #1d1d1f;\n  --ucl-color-muted-foreground: #86868b;\n  --ucl-color-accent: #1d1d1f;\n  --ucl-color-accent-foreground: #f5f5f7;\n  --ucl-color-border: rgba(255,255,255,0.10);\n  --ucl-color-input: rgba(255,255,255,0.10);\n  --ucl-color-ring: #f5f5f7;\n  --ucl-color-primary: #f5f5f7;\n  --ucl-color-primary-foreground: #1d1d1f;\n  --ucl-color-secondary: #1d1d1f;\n  --ucl-color-secondary-foreground: #f5f5f7;\n  --ucl-color-success: #3ab07f;\n  --ucl-color-success-foreground: #062b1c;\n  --ucl-color-warning: #d9a23a;\n  --ucl-color-warning-foreground: #2a1c08;\n  --ucl-color-error: #e05858;\n  --ucl-color-error-foreground: #2a0c0c;\n  --ucl-color-info: #5b8def;\n  --ucl-color-info-foreground: #0a1a3a;\n  --ucl-intent-success-bg: #0a2a1c;\n  --ucl-intent-success-fg: #7fd9b0;\n  --ucl-intent-success-border: #1d6e4b;\n  --ucl-intent-error-bg: #2a0c0c;\n  --ucl-intent-error-fg: #f0a3a3;\n  --ucl-intent-error-border: #a32a2a;\n  --ucl-intent-warning-bg: #2a1c08;\n  --ucl-intent-warning-fg: #f0c987;\n  --ucl-intent-warning-border: #8f5f17;\n  --ucl-intent-info-bg: #0a1a3a;\n  --ucl-intent-info-fg: #a9c2f5;\n  --ucl-intent-info-border: #2659b3;\n  --ucl-button-primary-default: #f5f5f7;\n  --ucl-button-primary-hover: #ffffff;\n  --ucl-button-primary-active: #e6e6e8;\n  --ucl-button-primary-focus: #f5f5f7;\n  --ucl-button-primary-disabled: #3a3a3c;\n  --ucl-button-primary-fg: #1d1d1f;\n  --ucl-button-secondary-default: #1d1d1f;\n  --ucl-button-secondary-hover: #2a2a2c;\n  --ucl-button-secondary-active: #3a3a3c;\n  --ucl-button-secondary-focus: #1d1d1f;\n  --ucl-button-secondary-disabled: #1d1d1f;\n  --ucl-button-secondary-fg: #f5f5f7;\n  --ucl-button-ghost-default: transparent;\n  --ucl-button-ghost-hover: #1d1d1f;\n  --ucl-button-ghost-active: #2a2a2c;\n  --ucl-button-ghost-focus: transparent;\n  --ucl-button-ghost-disabled: transparent;\n  --ucl-button-ghost-fg: #f5f5f7;\n  --ucl-button-outline-default: transparent;\n  --ucl-button-outline-hover: #1d1d1f;\n  --ucl-button-outline-active: #2a2a2c;\n  --ucl-button-outline-focus: transparent;\n  --ucl-button-outline-disabled: #1d1d1f;\n  --ucl-button-outline-fg: #f5f5f7;\n  --ucl-input-bg-default: #161618;\n  --ucl-input-bg-hover: #161618;\n  --ucl-input-bg-active: #161618;\n  --ucl-input-bg-focus: #161618;\n  --ucl-input-bg-disabled: #1d1d1f;\n  --ucl-input-border-default: rgba(255,255,255,0.10);\n  --ucl-input-border-hover: rgba(255,255,255,0.16);\n  --ucl-input-border-active: rgba(255,255,255,0.22);\n  --ucl-input-border-focus: #f5f5f7;\n  --ucl-input-border-disabled: rgba(255,255,255,0.10);\n  --ucl-input-border-error: #e05858;\n  --ucl-input-fg: #f5f5f7;\n  --ucl-input-placeholder: #86868b;\n  --ucl-input-ring: #f5f5f7;\n  --ucl-card-bg-default: #161618;\n  --ucl-card-bg-raised: #1d1d1f;\n  --ucl-card-bg-glass: rgba(20,20,22,0.72);\n  --ucl-card-border: rgba(255,255,255,0.10);\n  --ucl-card-shadow: 0 1px 2px rgba(0,0,0,0.4), 0 12px 24px rgba(0,0,0,0.5);\n  --ucl-badge-default-bg: #1d1d1f;\n  --ucl-badge-default-fg: #f5f5f7;\n  --ucl-badge-success-bg: #0a2a1c;\n  --ucl-badge-success-fg: #7fd9b0;\n  --ucl-badge-success-border: #1d6e4b;\n  --ucl-badge-warning-bg: #2a1c08;\n  --ucl-badge-warning-fg: #f0c987;\n  --ucl-badge-warning-border: #8f5f17;\n  --ucl-badge-error-bg: #2a0c0c;\n  --ucl-badge-error-fg: #f0a3a3;\n  --ucl-badge-error-border: #a32a2a;\n  --ucl-badge-info-bg: #0a1a3a;\n  --ucl-badge-info-fg: #a9c2f5;\n  --ucl-badge-info-border: #2659b3;\n  --ucl-select-trigger-default: #161618;\n  --ucl-select-trigger-hover: #161618;\n  --ucl-select-trigger-active: #161618;\n  --ucl-select-trigger-focus: #161618;\n  --ucl-select-trigger-disabled: #1d1d1f;\n  --ucl-select-border-default: rgba(255,255,255,0.10);\n  --ucl-select-border-hover: rgba(255,255,255,0.16);\n  --ucl-select-border-active: rgba(255,255,255,0.22);\n  --ucl-select-border-focus: #f5f5f7;\n  --ucl-select-border-disabled: rgba(255,255,255,0.10);\n  --ucl-select-border-error: #e05858;\n  --ucl-select-fg: #f5f5f7;\n  --ucl-select-placeholder: #86868b;\n  --ucl-select-optionBg-default: #161618;\n  --ucl-select-optionBg-hover: #1d1d1f;\n  --ucl-select-optionBg-selected: #2a2a2c;\n  --ucl-switch-track-off: #3a3a3c;\n  --ucl-switch-track-on: #f5f5f7;\n  --ucl-switch-track-disabled: #2a2a2c;\n  --ucl-switch-thumb: #161618;\n  --ucl-checkbox-bg-unchecked: #161618;\n  --ucl-checkbox-bg-checked: #f5f5f7;\n  --ucl-checkbox-bg-disabled: #1d1d1f;\n  --ucl-checkbox-border-default: rgba(255,255,255,0.10);\n  --ucl-checkbox-border-hover: rgba(255,255,255,0.22);\n  --ucl-checkbox-border-checked: #f5f5f7;\n  --ucl-checkbox-border-disabled: rgba(255,255,255,0.10);\n  --ucl-checkbox-fg: #1d1d1f;\n  --ucl-radio-accent: #f5f5f7;\n  --ucl-radio-border-default: rgba(255,255,255,0.10);\n  --ucl-radio-border-hover: rgba(255,255,255,0.22);\n  --ucl-radio-border-disabled: rgba(255,255,255,0.10);\n  --ucl-slider-track-bg: #3a3a3c;\n  --ucl-slider-range-bg: #f5f5f7;\n  --ucl-slider-thumb-bg: #161618;\n  --ucl-slider-thumb-border: #f5f5f7;\n  --ucl-slider-thumb-hover: #ffffff;\n  --ucl-slider-thumb-disabled: #3a3a3c;\n  --ucl-tabs-list-bg: #1d1d1f;\n  --ucl-tabs-trigger-default: transparent;\n  --ucl-tabs-trigger-hover: #2a2a2c;\n  --ucl-tabs-trigger-active: #161618;\n  --ucl-tabs-trigger-fg-default: #86868b;\n  --ucl-tabs-trigger-fg-active: #f5f5f7;\n  --ucl-accordion-trigger-default: transparent;\n  --ucl-accordion-trigger-hover: #1d1d1f;\n  --ucl-accordion-trigger-fg: #f5f5f7;\n  --ucl-accordion-content-fg: #86868b;\n  --ucl-accordion-border: rgba(255,255,255,0.10);\n  --ucl-pagination-btn-bg: #161618;\n  --ucl-pagination-btn-bg-hover: #1d1d1f;\n  --ucl-pagination-btn-bg-active: #f5f5f7;\n  --ucl-pagination-btn-border: rgba(255,255,255,0.10);\n  --ucl-pagination-btn-fg: #f5f5f7;\n  --ucl-pagination-btn-fg-active: #1d1d1f;\n  --ucl-tooltip-bg: #f5f5f7;\n  --ucl-tooltip-fg: #1d1d1f;\n  --ucl-tooltip-border: transparent;\n  --ucl-dropdown-menu-bg: #161618;\n  --ucl-dropdown-item-bg-default: transparent;\n  --ucl-dropdown-item-bg-hover: #1d1d1f;\n  --ucl-dropdown-item-bg-active: #f5f5f7;\n  --ucl-dropdown-item-bg-destructive-hover: #2a0c0c;\n  --ucl-dropdown-item-fg-default: #f5f5f7;\n  --ucl-dropdown-item-fg-active: #1d1d1f;\n  --ucl-dropdown-item-fg-destructive: #e05858;\n  --ucl-dropdown-trigger-border: rgba(255,255,255,0.10);\n  --ucl-dropdown-trigger-bg-default: #161618;\n  --ucl-dropdown-trigger-bg-hover: #1d1d1f;\n}";

export const ROOT_CSS: string =
  ":root {\n  --ucl-color-neutral-50: #fbfbfd;\n  --ucl-color-neutral-100: #f5f5f7;\n  --ucl-color-neutral-200: #ececee;\n  --ucl-color-neutral-300: #d2d2d7;\n  --ucl-color-neutral-400: #86868b;\n  --ucl-color-neutral-500: #6e6e73;\n  --ucl-color-neutral-600: #3a3a3c;\n  --ucl-color-neutral-700: #1d1d1f;\n  --ucl-color-neutral-800: #0b0b0d;\n  --ucl-color-neutral-900: #000000;\n  --ucl-color-success-50: #ecfaf3;\n  --ucl-color-success-100: #d6f2e3;\n  --ucl-color-success-500: #2e9e6b;\n  --ucl-color-success-600: #24875c;\n  --ucl-color-success-700: #1d6e4b;\n  --ucl-color-success-900: #0a3d28;\n  --ucl-color-warning-50: #fbf4e6;\n  --ucl-color-warning-100: #f6e6c8;\n  --ucl-color-warning-500: #c98a2b;\n  --ucl-color-warning-600: #b0771f;\n  --ucl-color-warning-700: #8f5f17;\n  --ucl-color-warning-900: #4a3209;\n  --ucl-color-error-50: #fbeeec;\n  --ucl-color-error-100: #f7d6d2;\n  --ucl-color-error-500: #d94545;\n  --ucl-color-error-600: #c63838;\n  --ucl-color-error-700: #a32a2a;\n  --ucl-color-error-900: #5a1212;\n  --ucl-color-info-50: #eef3fb;\n  --ucl-color-info-100: #d6e2f6;\n  --ucl-color-info-500: #3b82f6;\n  --ucl-color-info-600: #2f6fd9;\n  --ucl-color-info-700: #2659b3;\n  --ucl-color-info-900: #122a66;\n  --ucl-radius-none: 0px;\n  --ucl-radius-xs: 4px;\n  --ucl-radius-sm: 6px;\n  --ucl-radius-md: 10px;\n  --ucl-radius-lg: 16px;\n  --ucl-radius-xl: 20px;\n  --ucl-radius-full: 9999px;\n  --ucl-spacing-0: 0px;\n  --ucl-spacing-1: 0.25rem;\n  --ucl-spacing-2: 0.5rem;\n  --ucl-spacing-3: 0.75rem;\n  --ucl-spacing-4: 1rem;\n  --ucl-spacing-5: 1.25rem;\n  --ucl-spacing-6: 1.5rem;\n  --ucl-spacing-7: 1.75rem;\n  --ucl-spacing-8: 2rem;\n  --ucl-spacing-9: 2.25rem;\n  --ucl-spacing-10: 2.5rem;\n  --ucl-spacing-11: 2.75rem;\n  --ucl-spacing-12: 3rem;\n  --ucl-spacing-14: 3.5rem;\n  --ucl-spacing-16: 4rem;\n  --ucl-spacing-20: 5rem;\n  --ucl-spacing-24: 6rem;\n  --ucl-spacing-28: 7rem;\n  --ucl-spacing-32: 8rem;\n  --ucl-spacing-36: 9rem;\n  --ucl-spacing-40: 10rem;\n  --ucl-spacing-44: 11rem;\n  --ucl-spacing-48: 12rem;\n  --ucl-spacing-56: 14rem;\n  --ucl-spacing-64: 16rem;\n  --ucl-spacing-0.5: 0.125rem;\n  --ucl-spacing-1.5: 0.375rem;\n  --ucl-spacing-2.5: 0.625rem;\n  --ucl-spacing-3.5: 0.875rem;\n  --ucl-font-sans: -apple-system, \"SF Pro Text\", \"Inter\", system-ui, ui-sans-serif, sans-serif;\n  --ucl-font-serif: \"Source Serif 4\", ui-serif, Georgia, Cambria, \"Times New Roman\", serif;\n  --ucl-font-mono: \"SF Mono\", \"JetBrains Mono\", ui-monospace, SFMono-Regular, Consolas, Menlo, monospace;\n  --ucl-text-xs: 0.75rem;\n  --ucl-text-sm: 0.875rem;\n  --ucl-text-base: 1rem;\n  --ucl-text-lg: 1.125rem;\n  --ucl-text-xl: 1.25rem;\n  --ucl-text-2xl: 1.5rem;\n  --ucl-text-3xl: 1.875rem;\n  --ucl-text-4xl: 2.25rem;\n  --ucl-text-5xl: 3rem;\n  --ucl-text-6xl: 3.75rem;\n  --ucl-leading-tight: 1.1;\n  --ucl-leading-snug: 1.25;\n  --ucl-leading-normal: 1.5;\n  --ucl-leading-relaxed: 1.7;\n  --ucl-tracking-tighter: -0.03em;\n  --ucl-tracking-tight: -0.015em;\n  --ucl-tracking-normal: 0;\n  --ucl-tracking-wide: 0.02em;\n  --ucl-tracking-wider: 0.08em;\n  --ucl-weight-thin: 100;\n  --ucl-weight-extralight: 200;\n  --ucl-weight-light: 300;\n  --ucl-weight-normal: 400;\n  --ucl-weight-medium: 500;\n  --ucl-weight-semibold: 600;\n  --ucl-weight-bold: 700;\n  --ucl-weight-extrabold: 800;\n  --ucl-weight-black: 900;\n  --ucl-shadow-sm: 0 1px 2px rgba(0,0,0,0.04);\n  --ucl-shadow-md: 0 1px 1px rgba(0,0,0,0.05), 0 8px 14px rgba(0,0,0,0.05);\n  --ucl-shadow-lg: 0 1px 1px rgba(0,0,0,0.05), 0 12px 24px rgba(0,0,0,0.06);\n  --ucl-shadow-xl: 0 2px 4px rgba(0,0,0,0.05), 0 20px 40px rgba(0,0,0,0.08);\n  --ucl-duration-instant: 0ms;\n  --ucl-duration-fast: 150ms;\n  --ucl-duration-normal: 200ms;\n  --ucl-duration-slow: 300ms;\n  --ucl-duration-slower: 500ms;\n  --ucl-ease-linear: linear;\n  --ucl-ease-in: cubic-bezier(0.4, 0, 1, 1);\n  --ucl-ease-out: cubic-bezier(0, 0, 0.2, 1);\n  --ucl-ease-inOut: cubic-bezier(0.4, 0, 0.2, 1);\n  --ucl-ease-emphasized: cubic-bezier(0.2, 0, 0, 1);\n  --ucl-z-base: 0;\n  --ucl-z-dropdown: 1000;\n  --ucl-z-sticky: 1100;\n  --ucl-z-fixed: 1200;\n  --ucl-z-modal: 1300;\n  --ucl-z-popover: 1400;\n  --ucl-z-tooltip: 1500;\n  --ucl-opacity-0: 0;\n  --ucl-opacity-25: 0.25;\n  --ucl-opacity-50: 0.5;\n  --ucl-opacity-75: 0.75;\n  --ucl-opacity-90: 0.9;\n  --ucl-opacity-100: 1;\n}";

export const designTokens = {
  "$schema": "https://design-tokens.org/format",
  "$description": "Mono Luxe default — canonical W3C Design Tokens source for @ui-construction-library. Single source of truth; all TS/CSS/Tailwind artifacts are generated from this file.",
  "$prefix": "--ucl-",
  "color": {
    "primitive": {
      "$description": "Tier 1 — framework-agnostic color scales. Neutral is the Mono Luxe brand scale; intents are restrained, low-saturation system colors used sparingly.",
      "neutral": {
        "50": {
          "$type": "color",
          "$value": "#fbfbfd"
        },
        "100": {
          "$type": "color",
          "$value": "#f5f5f7"
        },
        "200": {
          "$type": "color",
          "$value": "#ececee"
        },
        "300": {
          "$type": "color",
          "$value": "#d2d2d7"
        },
        "400": {
          "$type": "color",
          "$value": "#86868b"
        },
        "500": {
          "$type": "color",
          "$value": "#6e6e73"
        },
        "600": {
          "$type": "color",
          "$value": "#3a3a3c"
        },
        "700": {
          "$type": "color",
          "$value": "#1d1d1f"
        },
        "800": {
          "$type": "color",
          "$value": "#0b0b0d"
        },
        "900": {
          "$type": "color",
          "$value": "#000000"
        }
      },
      "success": {
        "50": {
          "$type": "color",
          "$value": "#ecfaf3"
        },
        "100": {
          "$type": "color",
          "$value": "#d6f2e3"
        },
        "500": {
          "$type": "color",
          "$value": "#2e9e6b"
        },
        "600": {
          "$type": "color",
          "$value": "#24875c"
        },
        "700": {
          "$type": "color",
          "$value": "#1d6e4b"
        },
        "900": {
          "$type": "color",
          "$value": "#0a3d28"
        }
      },
      "warning": {
        "50": {
          "$type": "color",
          "$value": "#fbf4e6"
        },
        "100": {
          "$type": "color",
          "$value": "#f6e6c8"
        },
        "500": {
          "$type": "color",
          "$value": "#c98a2b"
        },
        "600": {
          "$type": "color",
          "$value": "#b0771f"
        },
        "700": {
          "$type": "color",
          "$value": "#8f5f17"
        },
        "900": {
          "$type": "color",
          "$value": "#4a3209"
        }
      },
      "error": {
        "50": {
          "$type": "color",
          "$value": "#fbeeec"
        },
        "100": {
          "$type": "color",
          "$value": "#f7d6d2"
        },
        "500": {
          "$type": "color",
          "$value": "#d94545"
        },
        "600": {
          "$type": "color",
          "$value": "#c63838"
        },
        "700": {
          "$type": "color",
          "$value": "#a32a2a"
        },
        "900": {
          "$type": "color",
          "$value": "#5a1212"
        }
      },
      "info": {
        "50": {
          "$type": "color",
          "$value": "#eef3fb"
        },
        "100": {
          "$type": "color",
          "$value": "#d6e2f6"
        },
        "500": {
          "$type": "color",
          "$value": "#3b82f6"
        },
        "600": {
          "$type": "color",
          "$value": "#2f6fd9"
        },
        "700": {
          "$type": "color",
          "$value": "#2659b3"
        },
        "900": {
          "$type": "color",
          "$value": "#122a66"
        }
      }
    },
    "semantic": {
      "$description": "Tier 2 — theme-scoped semantic aliases with *-foreground pairs.",
      "light": {
        "background": {
          "$type": "color",
          "$value": "#fbfbfd"
        },
        "foreground": {
          "$type": "color",
          "$value": "#1d1d1f"
        },
        "card": {
          "$type": "color",
          "$value": "#ffffff"
        },
        "card-foreground": {
          "$type": "color",
          "$value": "#1d1d1f"
        },
        "popover": {
          "$type": "color",
          "$value": "#ffffff"
        },
        "popover-foreground": {
          "$type": "color",
          "$value": "#1d1d1f"
        },
        "muted": {
          "$type": "color",
          "$value": "#f5f5f7"
        },
        "muted-foreground": {
          "$type": "color",
          "$value": "#6e6e73"
        },
        "accent": {
          "$type": "color",
          "$value": "#f5f5f7"
        },
        "accent-foreground": {
          "$type": "color",
          "$value": "#1d1d1f"
        },
        "border": {
          "$type": "color",
          "$value": "#d2d2d7"
        },
        "input": {
          "$type": "color",
          "$value": "#d2d2d7"
        },
        "ring": {
          "$type": "color",
          "$value": "#1d1d1f"
        },
        "primary": {
          "$type": "color",
          "$value": "#1d1d1f"
        },
        "primary-foreground": {
          "$type": "color",
          "$value": "#ffffff"
        },
        "secondary": {
          "$type": "color",
          "$value": "#f5f5f7"
        },
        "secondary-foreground": {
          "$type": "color",
          "$value": "#1d1d1f"
        },
        "success": {
          "$type": "color",
          "$value": "#2e9e6b"
        },
        "success-foreground": {
          "$type": "color",
          "$value": "#ffffff"
        },
        "warning": {
          "$type": "color",
          "$value": "#c98a2b"
        },
        "warning-foreground": {
          "$type": "color",
          "$value": "#ffffff"
        },
        "error": {
          "$type": "color",
          "$value": "#d94545"
        },
        "error-foreground": {
          "$type": "color",
          "$value": "#ffffff"
        },
        "info": {
          "$type": "color",
          "$value": "#3b82f6"
        },
        "info-foreground": {
          "$type": "color",
          "$value": "#ffffff"
        },
        "intent": {
          "success": {
            "bg": {
              "$type": "color",
              "$value": "#ecfaf3"
            },
            "fg": {
              "$type": "color",
              "$value": "#1d6e4b"
            },
            "border": {
              "$type": "color",
              "$value": "#d6f2e3"
            }
          },
          "error": {
            "bg": {
              "$type": "color",
              "$value": "#fbeeec"
            },
            "fg": {
              "$type": "color",
              "$value": "#a32a2a"
            },
            "border": {
              "$type": "color",
              "$value": "#f7d6d2"
            }
          },
          "warning": {
            "bg": {
              "$type": "color",
              "$value": "#fbf4e6"
            },
            "fg": {
              "$type": "color",
              "$value": "#8f5f17"
            },
            "border": {
              "$type": "color",
              "$value": "#f6e6c8"
            }
          },
          "info": {
            "bg": {
              "$type": "color",
              "$value": "#eef3fb"
            },
            "fg": {
              "$type": "color",
              "$value": "#2659b3"
            },
            "border": {
              "$type": "color",
              "$value": "#d6e2f6"
            }
          }
        }
      },
      "dark": {
        "background": {
          "$type": "color",
          "$value": "#0b0b0d"
        },
        "foreground": {
          "$type": "color",
          "$value": "#f5f5f7"
        },
        "card": {
          "$type": "color",
          "$value": "#161618"
        },
        "card-foreground": {
          "$type": "color",
          "$value": "#f5f5f7"
        },
        "popover": {
          "$type": "color",
          "$value": "#161618"
        },
        "popover-foreground": {
          "$type": "color",
          "$value": "#f5f5f7"
        },
        "muted": {
          "$type": "color",
          "$value": "#1d1d1f"
        },
        "muted-foreground": {
          "$type": "color",
          "$value": "#86868b"
        },
        "accent": {
          "$type": "color",
          "$value": "#1d1d1f"
        },
        "accent-foreground": {
          "$type": "color",
          "$value": "#f5f5f7"
        },
        "border": {
          "$type": "color",
          "$value": "rgba(255,255,255,0.10)"
        },
        "input": {
          "$type": "color",
          "$value": "rgba(255,255,255,0.10)"
        },
        "ring": {
          "$type": "color",
          "$value": "#f5f5f7"
        },
        "primary": {
          "$type": "color",
          "$value": "#f5f5f7"
        },
        "primary-foreground": {
          "$type": "color",
          "$value": "#1d1d1f"
        },
        "secondary": {
          "$type": "color",
          "$value": "#1d1d1f"
        },
        "secondary-foreground": {
          "$type": "color",
          "$value": "#f5f5f7"
        },
        "success": {
          "$type": "color",
          "$value": "#3ab07f"
        },
        "success-foreground": {
          "$type": "color",
          "$value": "#062b1c"
        },
        "warning": {
          "$type": "color",
          "$value": "#d9a23a"
        },
        "warning-foreground": {
          "$type": "color",
          "$value": "#2a1c08"
        },
        "error": {
          "$type": "color",
          "$value": "#e05858"
        },
        "error-foreground": {
          "$type": "color",
          "$value": "#2a0c0c"
        },
        "info": {
          "$type": "color",
          "$value": "#5b8def"
        },
        "info-foreground": {
          "$type": "color",
          "$value": "#0a1a3a"
        },
        "intent": {
          "success": {
            "bg": {
              "$type": "color",
              "$value": "#0a2a1c"
            },
            "fg": {
              "$type": "color",
              "$value": "#7fd9b0"
            },
            "border": {
              "$type": "color",
              "$value": "#1d6e4b"
            }
          },
          "error": {
            "bg": {
              "$type": "color",
              "$value": "#2a0c0c"
            },
            "fg": {
              "$type": "color",
              "$value": "#f0a3a3"
            },
            "border": {
              "$type": "color",
              "$value": "#a32a2a"
            }
          },
          "warning": {
            "bg": {
              "$type": "color",
              "$value": "#2a1c08"
            },
            "fg": {
              "$type": "color",
              "$value": "#f0c987"
            },
            "border": {
              "$type": "color",
              "$value": "#8f5f17"
            }
          },
          "info": {
            "bg": {
              "$type": "color",
              "$value": "#0a1a3a"
            },
            "fg": {
              "$type": "color",
              "$value": "#a9c2f5"
            },
            "border": {
              "$type": "color",
              "$value": "#2659b3"
            }
          }
        }
      }
    },
    "component": {
      "$description": "Tier 3 — component-state tokens (default/hover/active/focus/disabled) consumed by components via CSS :state selectors.",
      "light": {
        "button": {
          "primary": {
            "default": {
              "$type": "color",
              "$value": "#1d1d1f"
            },
            "hover": {
              "$type": "color",
              "$value": "#000000"
            },
            "active": {
              "$type": "color",
              "$value": "#000000"
            },
            "focus": {
              "$type": "color",
              "$value": "#1d1d1f"
            },
            "disabled": {
              "$type": "color",
              "$value": "#d2d2d7"
            },
            "fg": {
              "$type": "color",
              "$value": "#ffffff"
            }
          },
          "secondary": {
            "default": {
              "$type": "color",
              "$value": "#f5f5f7"
            },
            "hover": {
              "$type": "color",
              "$value": "#ececee"
            },
            "active": {
              "$type": "color",
              "$value": "#d2d2d7"
            },
            "focus": {
              "$type": "color",
              "$value": "#f5f5f7"
            },
            "disabled": {
              "$type": "color",
              "$value": "#f5f5f7"
            },
            "fg": {
              "$type": "color",
              "$value": "#1d1d1f"
            }
          },
          "ghost": {
            "default": {
              "$type": "color",
              "$value": "transparent"
            },
            "hover": {
              "$type": "color",
              "$value": "#f5f5f7"
            },
            "active": {
              "$type": "color",
              "$value": "#ececee"
            },
            "focus": {
              "$type": "color",
              "$value": "transparent"
            },
            "disabled": {
              "$type": "color",
              "$value": "transparent"
            },
            "fg": {
              "$type": "color",
              "$value": "#1d1d1f"
            }
          },
          "outline": {
            "default": {
              "$type": "color",
              "$value": "#ffffff"
            },
            "hover": {
              "$type": "color",
              "$value": "#f5f5f7"
            },
            "active": {
              "$type": "color",
              "$value": "#ececee"
            },
            "focus": {
              "$type": "color",
              "$value": "#ffffff"
            },
            "disabled": {
              "$type": "color",
              "$value": "#f5f5f7"
            },
            "fg": {
              "$type": "color",
              "$value": "#1d1d1f"
            }
          }
        },
        "input": {
          "bg": {
            "default": {
              "$type": "color",
              "$value": "#ffffff"
            },
            "hover": {
              "$type": "color",
              "$value": "#ffffff"
            },
            "active": {
              "$type": "color",
              "$value": "#ffffff"
            },
            "focus": {
              "$type": "color",
              "$value": "#ffffff"
            },
            "disabled": {
              "$type": "color",
              "$value": "#f5f5f7"
            }
          },
          "border": {
            "default": {
              "$type": "color",
              "$value": "#d2d2d7"
            },
            "hover": {
              "$type": "color",
              "$value": "#86868b"
            },
            "active": {
              "$type": "color",
              "$value": "#6e6e73"
            },
            "focus": {
              "$type": "color",
              "$value": "#1d1d1f"
            },
            "disabled": {
              "$type": "color",
              "$value": "#d2d2d7"
            },
            "error": {
              "$type": "color",
              "$value": "#d94545"
            }
          },
          "fg": {
            "$type": "color",
            "$value": "#1d1d1f"
          },
          "placeholder": {
            "$type": "color",
            "$value": "#86868b"
          },
          "ring": {
            "$type": "color",
            "$value": "#1d1d1f"
          }
        },
        "card": {
          "bg": {
            "default": {
              "$type": "color",
              "$value": "#ffffff"
            },
            "raised": {
              "$type": "color",
              "$value": "#fbfbfd"
            },
            "glass": {
              "$type": "color",
              "$value": "rgba(255,255,255,0.72)"
            }
          },
          "border": {
            "$type": "color",
            "$value": "#d2d2d7"
          },
          "shadow": {
            "$type": "shadow",
            "$value": "0 1px 1px rgba(0,0,0,0.05), 0 8px 14px rgba(0,0,0,0.05)"
          }
        },
        "badge": {
          "default": {
            "bg": {
              "$type": "color",
              "$value": "#f5f5f7"
            },
            "fg": {
              "$type": "color",
              "$value": "#1d1d1f"
            }
          },
          "success": {
            "bg": {
              "$type": "color",
              "$value": "#ecfaf3"
            },
            "fg": {
              "$type": "color",
              "$value": "#1d6e4b"
            },
            "border": {
              "$type": "color",
              "$value": "#d6f2e3"
            }
          },
          "warning": {
            "bg": {
              "$type": "color",
              "$value": "#fbf4e6"
            },
            "fg": {
              "$type": "color",
              "$value": "#8f5f17"
            },
            "border": {
              "$type": "color",
              "$value": "#f6e6c8"
            }
          },
          "error": {
            "bg": {
              "$type": "color",
              "$value": "#fbeeec"
            },
            "fg": {
              "$type": "color",
              "$value": "#a32a2a"
            },
            "border": {
              "$type": "color",
              "$value": "#f7d6d2"
            }
          },
          "info": {
            "bg": {
              "$type": "color",
              "$value": "#eef3fb"
            },
            "fg": {
              "$type": "color",
              "$value": "#2659b3"
            },
            "border": {
              "$type": "color",
              "$value": "#d6e2f6"
            }
          }
        },
        "select": {
          "trigger": {
            "default": {
              "$type": "color",
              "$value": "#ffffff"
            },
            "hover": {
              "$type": "color",
              "$value": "#ffffff"
            },
            "active": {
              "$type": "color",
              "$value": "#ffffff"
            },
            "focus": {
              "$type": "color",
              "$value": "#ffffff"
            },
            "disabled": {
              "$type": "color",
              "$value": "#f5f5f7"
            }
          },
          "border": {
            "default": {
              "$type": "color",
              "$value": "#d2d2d7"
            },
            "hover": {
              "$type": "color",
              "$value": "#86868b"
            },
            "active": {
              "$type": "color",
              "$value": "#6e6e73"
            },
            "focus": {
              "$type": "color",
              "$value": "#1d1d1f"
            },
            "disabled": {
              "$type": "color",
              "$value": "#d2d2d7"
            },
            "error": {
              "$type": "color",
              "$value": "#d94545"
            }
          },
          "fg": {
            "$type": "color",
            "$value": "#1d1d1f"
          },
          "placeholder": {
            "$type": "color",
            "$value": "#86868b"
          },
          "optionBg": {
            "default": {
              "$type": "color",
              "$value": "#ffffff"
            },
            "hover": {
              "$type": "color",
              "$value": "#f5f5f7"
            },
            "selected": {
              "$type": "color",
              "$value": "#ececee"
            }
          }
        },
        "switch": {
          "track": {
            "off": {
              "$type": "color",
              "$value": "#d2d2d7"
            },
            "on": {
              "$type": "color",
              "$value": "#1d1d1f"
            },
            "disabled": {
              "$type": "color",
              "$value": "#ececee"
            }
          },
          "thumb": {
            "$type": "color",
            "$value": "#ffffff"
          }
        },
        "checkbox": {
          "bg": {
            "unchecked": {
              "$type": "color",
              "$value": "#ffffff"
            },
            "checked": {
              "$type": "color",
              "$value": "#1d1d1f"
            },
            "disabled": {
              "$type": "color",
              "$value": "#f5f5f7"
            }
          },
          "border": {
            "default": {
              "$type": "color",
              "$value": "#d2d2d7"
            },
            "hover": {
              "$type": "color",
              "$value": "#86868b"
            },
            "checked": {
              "$type": "color",
              "$value": "#1d1d1f"
            },
            "disabled": {
              "$type": "color",
              "$value": "#d2d2d7"
            }
          },
          "fg": {
            "$type": "color",
            "$value": "#ffffff"
          }
        },
        "radio": {
          "accent": {
            "$type": "color",
            "$value": "#1d1d1f"
          },
          "border": {
            "default": {
              "$type": "color",
              "$value": "#d2d2d7"
            },
            "hover": {
              "$type": "color",
              "$value": "#86868b"
            },
            "disabled": {
              "$type": "color",
              "$value": "#d2d2d7"
            }
          }
        },
        "slider": {
          "track": {
            "bg": {
              "$type": "color",
              "$value": "#ececee"
            }
          },
          "range": {
            "bg": {
              "$type": "color",
              "$value": "#1d1d1f"
            }
          },
          "thumb": {
            "bg": {
              "$type": "color",
              "$value": "#ffffff"
            },
            "border": {
              "$type": "color",
              "$value": "#1d1d1f"
            },
            "hover": {
              "$type": "color",
              "$value": "#000000"
            },
            "disabled": {
              "$type": "color",
              "$value": "#d2d2d7"
            }
          }
        },
        "tabs": {
          "list": {
            "bg": {
              "$type": "color",
              "$value": "#f5f5f7"
            }
          },
          "trigger": {
            "default": {
              "$type": "color",
              "$value": "transparent"
            },
            "hover": {
              "$type": "color",
              "$value": "#ececee"
            },
            "active": {
              "$type": "color",
              "$value": "#ffffff"
            },
            "fg": {
              "default": {
                "$type": "color",
                "$value": "#6e6e73"
              },
              "active": {
                "$type": "color",
                "$value": "#1d1d1f"
              }
            }
          }
        },
        "accordion": {
          "trigger": {
            "default": {
              "$type": "color",
              "$value": "transparent"
            },
            "hover": {
              "$type": "color",
              "$value": "#f5f5f7"
            },
            "fg": {
              "$type": "color",
              "$value": "#1d1d1f"
            }
          },
          "content": {
            "fg": {
              "$type": "color",
              "$value": "#6e6e73"
            }
          },
          "border": {
            "$type": "color",
            "$value": "#d2d2d7"
          }
        },
        "pagination": {
          "btn": {
            "bg": {
              "$type": "color",
              "$value": "#ffffff"
            },
            "bg-hover": {
              "$type": "color",
              "$value": "#f5f5f7"
            },
            "bg-active": {
              "$type": "color",
              "$value": "#1d1d1f"
            },
            "border": {
              "$type": "color",
              "$value": "#d2d2d7"
            },
            "fg": {
              "$type": "color",
              "$value": "#1d1d1f"
            },
            "fg-active": {
              "$type": "color",
              "$value": "#ffffff"
            }
          }
        },
        "tooltip": {
          "bg": {
            "$type": "color",
            "$value": "#1d1d1f"
          },
          "fg": {
            "$type": "color",
            "$value": "#ffffff"
          },
          "border": {
            "$type": "color",
            "$value": "transparent"
          }
        },
        "dropdown": {
          "menu": {
            "bg": {
              "$type": "color",
              "$value": "#ffffff"
            }
          },
          "item": {
            "bg": {
              "default": {
                "$type": "color",
                "$value": "transparent"
              },
              "hover": {
                "$type": "color",
                "$value": "#f5f5f7"
              },
              "active": {
                "$type": "color",
                "$value": "#1d1d1f"
              },
              "destructive-hover": {
                "$type": "color",
                "$value": "#fbeeec"
              }
            },
            "fg": {
              "default": {
                "$type": "color",
                "$value": "#1d1d1f"
              },
              "active": {
                "$type": "color",
                "$value": "#ffffff"
              },
              "destructive": {
                "$type": "color",
                "$value": "#d94545"
              }
            }
          },
          "trigger": {
            "border": {
              "$type": "color",
              "$value": "#d2d2d7"
            },
            "bg": {
              "default": {
                "$type": "color",
                "$value": "#ffffff"
              },
              "hover": {
                "$type": "color",
                "$value": "#f5f5f7"
              }
            }
          }
        }
      },
      "dark": {
        "button": {
          "primary": {
            "default": {
              "$type": "color",
              "$value": "#f5f5f7"
            },
            "hover": {
              "$type": "color",
              "$value": "#ffffff"
            },
            "active": {
              "$type": "color",
              "$value": "#e6e6e8"
            },
            "focus": {
              "$type": "color",
              "$value": "#f5f5f7"
            },
            "disabled": {
              "$type": "color",
              "$value": "#3a3a3c"
            },
            "fg": {
              "$type": "color",
              "$value": "#1d1d1f"
            }
          },
          "secondary": {
            "default": {
              "$type": "color",
              "$value": "#1d1d1f"
            },
            "hover": {
              "$type": "color",
              "$value": "#2a2a2c"
            },
            "active": {
              "$type": "color",
              "$value": "#3a3a3c"
            },
            "focus": {
              "$type": "color",
              "$value": "#1d1d1f"
            },
            "disabled": {
              "$type": "color",
              "$value": "#1d1d1f"
            },
            "fg": {
              "$type": "color",
              "$value": "#f5f5f7"
            }
          },
          "ghost": {
            "default": {
              "$type": "color",
              "$value": "transparent"
            },
            "hover": {
              "$type": "color",
              "$value": "#1d1d1f"
            },
            "active": {
              "$type": "color",
              "$value": "#2a2a2c"
            },
            "focus": {
              "$type": "color",
              "$value": "transparent"
            },
            "disabled": {
              "$type": "color",
              "$value": "transparent"
            },
            "fg": {
              "$type": "color",
              "$value": "#f5f5f7"
            }
          },
          "outline": {
            "default": {
              "$type": "color",
              "$value": "transparent"
            },
            "hover": {
              "$type": "color",
              "$value": "#1d1d1f"
            },
            "active": {
              "$type": "color",
              "$value": "#2a2a2c"
            },
            "focus": {
              "$type": "color",
              "$value": "transparent"
            },
            "disabled": {
              "$type": "color",
              "$value": "#1d1d1f"
            },
            "fg": {
              "$type": "color",
              "$value": "#f5f5f7"
            }
          }
        },
        "input": {
          "bg": {
            "default": {
              "$type": "color",
              "$value": "#161618"
            },
            "hover": {
              "$type": "color",
              "$value": "#161618"
            },
            "active": {
              "$type": "color",
              "$value": "#161618"
            },
            "focus": {
              "$type": "color",
              "$value": "#161618"
            },
            "disabled": {
              "$type": "color",
              "$value": "#1d1d1f"
            }
          },
          "border": {
            "default": {
              "$type": "color",
              "$value": "rgba(255,255,255,0.10)"
            },
            "hover": {
              "$type": "color",
              "$value": "rgba(255,255,255,0.16)"
            },
            "active": {
              "$type": "color",
              "$value": "rgba(255,255,255,0.22)"
            },
            "focus": {
              "$type": "color",
              "$value": "#f5f5f7"
            },
            "disabled": {
              "$type": "color",
              "$value": "rgba(255,255,255,0.10)"
            },
            "error": {
              "$type": "color",
              "$value": "#e05858"
            }
          },
          "fg": {
            "$type": "color",
            "$value": "#f5f5f7"
          },
          "placeholder": {
            "$type": "color",
            "$value": "#86868b"
          },
          "ring": {
            "$type": "color",
            "$value": "#f5f5f7"
          }
        },
        "card": {
          "bg": {
            "default": {
              "$type": "color",
              "$value": "#161618"
            },
            "raised": {
              "$type": "color",
              "$value": "#1d1d1f"
            },
            "glass": {
              "$type": "color",
              "$value": "rgba(20,20,22,0.72)"
            }
          },
          "border": {
            "$type": "color",
            "$value": "rgba(255,255,255,0.10)"
          },
          "shadow": {
            "$type": "shadow",
            "$value": "0 1px 2px rgba(0,0,0,0.4), 0 12px 24px rgba(0,0,0,0.5)"
          }
        },
        "badge": {
          "default": {
            "bg": {
              "$type": "color",
              "$value": "#1d1d1f"
            },
            "fg": {
              "$type": "color",
              "$value": "#f5f5f7"
            }
          },
          "success": {
            "bg": {
              "$type": "color",
              "$value": "#0a2a1c"
            },
            "fg": {
              "$type": "color",
              "$value": "#7fd9b0"
            },
            "border": {
              "$type": "color",
              "$value": "#1d6e4b"
            }
          },
          "warning": {
            "bg": {
              "$type": "color",
              "$value": "#2a1c08"
            },
            "fg": {
              "$type": "color",
              "$value": "#f0c987"
            },
            "border": {
              "$type": "color",
              "$value": "#8f5f17"
            }
          },
          "error": {
            "bg": {
              "$type": "color",
              "$value": "#2a0c0c"
            },
            "fg": {
              "$type": "color",
              "$value": "#f0a3a3"
            },
            "border": {
              "$type": "color",
              "$value": "#a32a2a"
            }
          },
          "info": {
            "bg": {
              "$type": "color",
              "$value": "#0a1a3a"
            },
            "fg": {
              "$type": "color",
              "$value": "#a9c2f5"
            },
            "border": {
              "$type": "color",
              "$value": "#2659b3"
            }
          }
        },
        "select": {
          "trigger": {
            "default": {
              "$type": "color",
              "$value": "#161618"
            },
            "hover": {
              "$type": "color",
              "$value": "#161618"
            },
            "active": {
              "$type": "color",
              "$value": "#161618"
            },
            "focus": {
              "$type": "color",
              "$value": "#161618"
            },
            "disabled": {
              "$type": "color",
              "$value": "#1d1d1f"
            }
          },
          "border": {
            "default": {
              "$type": "color",
              "$value": "rgba(255,255,255,0.10)"
            },
            "hover": {
              "$type": "color",
              "$value": "rgba(255,255,255,0.16)"
            },
            "active": {
              "$type": "color",
              "$value": "rgba(255,255,255,0.22)"
            },
            "focus": {
              "$type": "color",
              "$value": "#f5f5f7"
            },
            "disabled": {
              "$type": "color",
              "$value": "rgba(255,255,255,0.10)"
            },
            "error": {
              "$type": "color",
              "$value": "#e05858"
            }
          },
          "fg": {
            "$type": "color",
            "$value": "#f5f5f7"
          },
          "placeholder": {
            "$type": "color",
            "$value": "#86868b"
          },
          "optionBg": {
            "default": {
              "$type": "color",
              "$value": "#161618"
            },
            "hover": {
              "$type": "color",
              "$value": "#1d1d1f"
            },
            "selected": {
              "$type": "color",
              "$value": "#2a2a2c"
            }
          }
        },
        "switch": {
          "track": {
            "off": {
              "$type": "color",
              "$value": "#3a3a3c"
            },
            "on": {
              "$type": "color",
              "$value": "#f5f5f7"
            },
            "disabled": {
              "$type": "color",
              "$value": "#2a2a2c"
            }
          },
          "thumb": {
            "$type": "color",
            "$value": "#161618"
          }
        },
        "checkbox": {
          "bg": {
            "unchecked": {
              "$type": "color",
              "$value": "#161618"
            },
            "checked": {
              "$type": "color",
              "$value": "#f5f5f7"
            },
            "disabled": {
              "$type": "color",
              "$value": "#1d1d1f"
            }
          },
          "border": {
            "default": {
              "$type": "color",
              "$value": "rgba(255,255,255,0.10)"
            },
            "hover": {
              "$type": "color",
              "$value": "rgba(255,255,255,0.22)"
            },
            "checked": {
              "$type": "color",
              "$value": "#f5f5f7"
            },
            "disabled": {
              "$type": "color",
              "$value": "rgba(255,255,255,0.10)"
            }
          },
          "fg": {
            "$type": "color",
            "$value": "#1d1d1f"
          }
        },
        "radio": {
          "accent": {
            "$type": "color",
            "$value": "#f5f5f7"
          },
          "border": {
            "default": {
              "$type": "color",
              "$value": "rgba(255,255,255,0.10)"
            },
            "hover": {
              "$type": "color",
              "$value": "rgba(255,255,255,0.22)"
            },
            "disabled": {
              "$type": "color",
              "$value": "rgba(255,255,255,0.10)"
            }
          }
        },
        "slider": {
          "track": {
            "bg": {
              "$type": "color",
              "$value": "#3a3a3c"
            }
          },
          "range": {
            "bg": {
              "$type": "color",
              "$value": "#f5f5f7"
            }
          },
          "thumb": {
            "bg": {
              "$type": "color",
              "$value": "#161618"
            },
            "border": {
              "$type": "color",
              "$value": "#f5f5f7"
            },
            "hover": {
              "$type": "color",
              "$value": "#ffffff"
            },
            "disabled": {
              "$type": "color",
              "$value": "#3a3a3c"
            }
          }
        },
        "tabs": {
          "list": {
            "bg": {
              "$type": "color",
              "$value": "#1d1d1f"
            }
          },
          "trigger": {
            "default": {
              "$type": "color",
              "$value": "transparent"
            },
            "hover": {
              "$type": "color",
              "$value": "#2a2a2c"
            },
            "active": {
              "$type": "color",
              "$value": "#161618"
            },
            "fg": {
              "default": {
                "$type": "color",
                "$value": "#86868b"
              },
              "active": {
                "$type": "color",
                "$value": "#f5f5f7"
              }
            }
          }
        },
        "accordion": {
          "trigger": {
            "default": {
              "$type": "color",
              "$value": "transparent"
            },
            "hover": {
              "$type": "color",
              "$value": "#1d1d1f"
            },
            "fg": {
              "$type": "color",
              "$value": "#f5f5f7"
            }
          },
          "content": {
            "fg": {
              "$type": "color",
              "$value": "#86868b"
            }
          },
          "border": {
            "$type": "color",
            "$value": "rgba(255,255,255,0.10)"
          }
        },
        "pagination": {
          "btn": {
            "bg": {
              "$type": "color",
              "$value": "#161618"
            },
            "bg-hover": {
              "$type": "color",
              "$value": "#1d1d1f"
            },
            "bg-active": {
              "$type": "color",
              "$value": "#f5f5f7"
            },
            "border": {
              "$type": "color",
              "$value": "rgba(255,255,255,0.10)"
            },
            "fg": {
              "$type": "color",
              "$value": "#f5f5f7"
            },
            "fg-active": {
              "$type": "color",
              "$value": "#1d1d1f"
            }
          }
        },
        "tooltip": {
          "bg": {
            "$type": "color",
            "$value": "#f5f5f7"
          },
          "fg": {
            "$type": "color",
            "$value": "#1d1d1f"
          },
          "border": {
            "$type": "color",
            "$value": "transparent"
          }
        },
        "dropdown": {
          "menu": {
            "bg": {
              "$type": "color",
              "$value": "#161618"
            }
          },
          "item": {
            "bg": {
              "default": {
                "$type": "color",
                "$value": "transparent"
              },
              "hover": {
                "$type": "color",
                "$value": "#1d1d1f"
              },
              "active": {
                "$type": "color",
                "$value": "#f5f5f7"
              },
              "destructive-hover": {
                "$type": "color",
                "$value": "#2a0c0c"
              }
            },
            "fg": {
              "default": {
                "$type": "color",
                "$value": "#f5f5f7"
              },
              "active": {
                "$type": "color",
                "$value": "#1d1d1f"
              },
              "destructive": {
                "$type": "color",
                "$value": "#e05858"
              }
            }
          },
          "trigger": {
            "border": {
              "$type": "color",
              "$value": "rgba(255,255,255,0.10)"
            },
            "bg": {
              "default": {
                "$type": "color",
                "$value": "#161618"
              },
              "hover": {
                "$type": "color",
                "$value": "#1d1d1f"
              }
            }
          }
        }
      }
    }
  },
  "radius": {
    "$description": "Corner radii scale — radius follows component size (card lg, control md, badge sm).",
    "none": {
      "$type": "dimension",
      "$value": "0px"
    },
    "xs": {
      "$type": "dimension",
      "$value": "4px"
    },
    "sm": {
      "$type": "dimension",
      "$value": "6px"
    },
    "md": {
      "$type": "dimension",
      "$value": "10px"
    },
    "lg": {
      "$type": "dimension",
      "$value": "16px"
    },
    "xl": {
      "$type": "dimension",
      "$value": "20px"
    },
    "full": {
      "$type": "dimension",
      "$value": "9999px"
    }
  },
  "spacing": {
    "0": {
      "$type": "dimension",
      "$value": "0px"
    },
    "1": {
      "$type": "dimension",
      "$value": "0.25rem"
    },
    "2": {
      "$type": "dimension",
      "$value": "0.5rem"
    },
    "3": {
      "$type": "dimension",
      "$value": "0.75rem"
    },
    "4": {
      "$type": "dimension",
      "$value": "1rem"
    },
    "5": {
      "$type": "dimension",
      "$value": "1.25rem"
    },
    "6": {
      "$type": "dimension",
      "$value": "1.5rem"
    },
    "7": {
      "$type": "dimension",
      "$value": "1.75rem"
    },
    "8": {
      "$type": "dimension",
      "$value": "2rem"
    },
    "9": {
      "$type": "dimension",
      "$value": "2.25rem"
    },
    "10": {
      "$type": "dimension",
      "$value": "2.5rem"
    },
    "11": {
      "$type": "dimension",
      "$value": "2.75rem"
    },
    "12": {
      "$type": "dimension",
      "$value": "3rem"
    },
    "14": {
      "$type": "dimension",
      "$value": "3.5rem"
    },
    "16": {
      "$type": "dimension",
      "$value": "4rem"
    },
    "20": {
      "$type": "dimension",
      "$value": "5rem"
    },
    "24": {
      "$type": "dimension",
      "$value": "6rem"
    },
    "28": {
      "$type": "dimension",
      "$value": "7rem"
    },
    "32": {
      "$type": "dimension",
      "$value": "8rem"
    },
    "36": {
      "$type": "dimension",
      "$value": "9rem"
    },
    "40": {
      "$type": "dimension",
      "$value": "10rem"
    },
    "44": {
      "$type": "dimension",
      "$value": "11rem"
    },
    "48": {
      "$type": "dimension",
      "$value": "12rem"
    },
    "56": {
      "$type": "dimension",
      "$value": "14rem"
    },
    "64": {
      "$type": "dimension",
      "$value": "16rem"
    },
    "$description": "Spacing scale (rem).",
    "0.5": {
      "$type": "dimension",
      "$value": "0.125rem"
    },
    "1.5": {
      "$type": "dimension",
      "$value": "0.375rem"
    },
    "2.5": {
      "$type": "dimension",
      "$value": "0.625rem"
    },
    "3.5": {
      "$type": "dimension",
      "$value": "0.875rem"
    }
  },
  "typography": {
    "$description": "Type system. Mono Luxe uses SF / system sans as default.",
    "font": {
      "sans": {
        "$type": "fontFamily",
        "$value": "-apple-system, \"SF Pro Text\", \"Inter\", system-ui, ui-sans-serif, sans-serif"
      },
      "serif": {
        "$type": "fontFamily",
        "$value": "\"Source Serif 4\", ui-serif, Georgia, Cambria, \"Times New Roman\", serif"
      },
      "mono": {
        "$type": "fontFamily",
        "$value": "\"SF Mono\", \"JetBrains Mono\", ui-monospace, SFMono-Regular, Consolas, Menlo, monospace"
      }
    },
    "text": {
      "xs": {
        "$type": "dimension",
        "$value": "0.75rem"
      },
      "sm": {
        "$type": "dimension",
        "$value": "0.875rem"
      },
      "base": {
        "$type": "dimension",
        "$value": "1rem"
      },
      "lg": {
        "$type": "dimension",
        "$value": "1.125rem"
      },
      "xl": {
        "$type": "dimension",
        "$value": "1.25rem"
      },
      "2xl": {
        "$type": "dimension",
        "$value": "1.5rem"
      },
      "3xl": {
        "$type": "dimension",
        "$value": "1.875rem"
      },
      "4xl": {
        "$type": "dimension",
        "$value": "2.25rem"
      },
      "5xl": {
        "$type": "dimension",
        "$value": "3rem"
      },
      "6xl": {
        "$type": "dimension",
        "$value": "3.75rem"
      }
    },
    "leading": {
      "tight": {
        "$type": "number",
        "$value": "1.1"
      },
      "snug": {
        "$type": "number",
        "$value": "1.25"
      },
      "normal": {
        "$type": "number",
        "$value": "1.5"
      },
      "relaxed": {
        "$type": "number",
        "$value": "1.7"
      }
    },
    "tracking": {
      "tighter": {
        "$type": "dimension",
        "$value": "-0.03em"
      },
      "tight": {
        "$type": "dimension",
        "$value": "-0.015em"
      },
      "normal": {
        "$type": "dimension",
        "$value": "0"
      },
      "wide": {
        "$type": "dimension",
        "$value": "0.02em"
      },
      "wider": {
        "$type": "dimension",
        "$value": "0.08em"
      }
    },
    "weight": {
      "thin": {
        "$type": "fontWeight",
        "$value": "100"
      },
      "extralight": {
        "$type": "fontWeight",
        "$value": "200"
      },
      "light": {
        "$type": "fontWeight",
        "$value": "300"
      },
      "normal": {
        "$type": "fontWeight",
        "$value": "400"
      },
      "medium": {
        "$type": "fontWeight",
        "$value": "500"
      },
      "semibold": {
        "$type": "fontWeight",
        "$value": "600"
      },
      "bold": {
        "$type": "fontWeight",
        "$value": "700"
      },
      "extrabold": {
        "$type": "fontWeight",
        "$value": "800"
      },
      "black": {
        "$type": "fontWeight",
        "$value": "900"
      }
    }
  },
  "shadow": {
    "$description": "Physical, layered soft shadows (Mono Luxe) — not glows.",
    "sm": {
      "$type": "shadow",
      "$value": "0 1px 2px rgba(0,0,0,0.04)"
    },
    "md": {
      "$type": "shadow",
      "$value": "0 1px 1px rgba(0,0,0,0.05), 0 8px 14px rgba(0,0,0,0.05)"
    },
    "lg": {
      "$type": "shadow",
      "$value": "0 1px 1px rgba(0,0,0,0.05), 0 12px 24px rgba(0,0,0,0.06)"
    },
    "xl": {
      "$type": "shadow",
      "$value": "0 2px 4px rgba(0,0,0,0.05), 0 20px 40px rgba(0,0,0,0.08)"
    }
  },
  "motion": {
    "$description": "Motion tokens.",
    "duration": {
      "instant": {
        "$type": "duration",
        "$value": "0ms"
      },
      "fast": {
        "$type": "duration",
        "$value": "150ms"
      },
      "normal": {
        "$type": "duration",
        "$value": "200ms"
      },
      "slow": {
        "$type": "duration",
        "$value": "300ms"
      },
      "slower": {
        "$type": "duration",
        "$value": "500ms"
      }
    },
    "ease": {
      "linear": {
        "$type": "cubicBezier",
        "$value": "linear"
      },
      "in": {
        "$type": "cubicBezier",
        "$value": "cubic-bezier(0.4, 0, 1, 1)"
      },
      "out": {
        "$type": "cubicBezier",
        "$value": "cubic-bezier(0, 0, 0.2, 1)"
      },
      "inOut": {
        "$type": "cubicBezier",
        "$value": "cubic-bezier(0.4, 0, 0.2, 1)"
      },
      "emphasized": {
        "$type": "cubicBezier",
        "$value": "cubic-bezier(0.2, 0, 0, 1)"
      }
    }
  },
  "zIndex": {
    "$description": "Stacking order.",
    "base": {
      "$type": "number",
      "$value": "0"
    },
    "dropdown": {
      "$type": "number",
      "$value": "1000"
    },
    "sticky": {
      "$type": "number",
      "$value": "1100"
    },
    "fixed": {
      "$type": "number",
      "$value": "1200"
    },
    "modal": {
      "$type": "number",
      "$value": "1300"
    },
    "popover": {
      "$type": "number",
      "$value": "1400"
    },
    "tooltip": {
      "$type": "number",
      "$value": "1500"
    }
  },
  "opacity": {
    "0": {
      "$type": "number",
      "$value": "0"
    },
    "25": {
      "$type": "number",
      "$value": "0.25"
    },
    "50": {
      "$type": "number",
      "$value": "0.5"
    },
    "75": {
      "$type": "number",
      "$value": "0.75"
    },
    "90": {
      "$type": "number",
      "$value": "0.9"
    },
    "100": {
      "$type": "number",
      "$value": "1"
    }
  }
} as const;

export type ThemeName = string;
export type BrandOverride = Record<string, Record<string, string>>;
export type SemanticOverride = Record<string, string>;

const _LIGHT_ENTRIES: Array<{ name: string; value: string }> =
[
  {
    "name": "color-background",
    "value": "#fbfbfd"
  },
  {
    "name": "color-foreground",
    "value": "#1d1d1f"
  },
  {
    "name": "color-card",
    "value": "#ffffff"
  },
  {
    "name": "color-card-foreground",
    "value": "#1d1d1f"
  },
  {
    "name": "color-popover",
    "value": "#ffffff"
  },
  {
    "name": "color-popover-foreground",
    "value": "#1d1d1f"
  },
  {
    "name": "color-muted",
    "value": "#f5f5f7"
  },
  {
    "name": "color-muted-foreground",
    "value": "#6e6e73"
  },
  {
    "name": "color-accent",
    "value": "#f5f5f7"
  },
  {
    "name": "color-accent-foreground",
    "value": "#1d1d1f"
  },
  {
    "name": "color-border",
    "value": "#d2d2d7"
  },
  {
    "name": "color-input",
    "value": "#d2d2d7"
  },
  {
    "name": "color-ring",
    "value": "#1d1d1f"
  },
  {
    "name": "color-primary",
    "value": "#1d1d1f"
  },
  {
    "name": "color-primary-foreground",
    "value": "#ffffff"
  },
  {
    "name": "color-secondary",
    "value": "#f5f5f7"
  },
  {
    "name": "color-secondary-foreground",
    "value": "#1d1d1f"
  },
  {
    "name": "color-success",
    "value": "#2e9e6b"
  },
  {
    "name": "color-success-foreground",
    "value": "#ffffff"
  },
  {
    "name": "color-warning",
    "value": "#c98a2b"
  },
  {
    "name": "color-warning-foreground",
    "value": "#ffffff"
  },
  {
    "name": "color-error",
    "value": "#d94545"
  },
  {
    "name": "color-error-foreground",
    "value": "#ffffff"
  },
  {
    "name": "color-info",
    "value": "#3b82f6"
  },
  {
    "name": "color-info-foreground",
    "value": "#ffffff"
  },
  {
    "name": "intent-success-bg",
    "value": "#ecfaf3"
  },
  {
    "name": "intent-success-fg",
    "value": "#1d6e4b"
  },
  {
    "name": "intent-success-border",
    "value": "#d6f2e3"
  },
  {
    "name": "intent-error-bg",
    "value": "#fbeeec"
  },
  {
    "name": "intent-error-fg",
    "value": "#a32a2a"
  },
  {
    "name": "intent-error-border",
    "value": "#f7d6d2"
  },
  {
    "name": "intent-warning-bg",
    "value": "#fbf4e6"
  },
  {
    "name": "intent-warning-fg",
    "value": "#8f5f17"
  },
  {
    "name": "intent-warning-border",
    "value": "#f6e6c8"
  },
  {
    "name": "intent-info-bg",
    "value": "#eef3fb"
  },
  {
    "name": "intent-info-fg",
    "value": "#2659b3"
  },
  {
    "name": "intent-info-border",
    "value": "#d6e2f6"
  },
  {
    "name": "button-primary-default",
    "value": "#1d1d1f"
  },
  {
    "name": "button-primary-hover",
    "value": "#000000"
  },
  {
    "name": "button-primary-active",
    "value": "#000000"
  },
  {
    "name": "button-primary-focus",
    "value": "#1d1d1f"
  },
  {
    "name": "button-primary-disabled",
    "value": "#d2d2d7"
  },
  {
    "name": "button-primary-fg",
    "value": "#ffffff"
  },
  {
    "name": "button-secondary-default",
    "value": "#f5f5f7"
  },
  {
    "name": "button-secondary-hover",
    "value": "#ececee"
  },
  {
    "name": "button-secondary-active",
    "value": "#d2d2d7"
  },
  {
    "name": "button-secondary-focus",
    "value": "#f5f5f7"
  },
  {
    "name": "button-secondary-disabled",
    "value": "#f5f5f7"
  },
  {
    "name": "button-secondary-fg",
    "value": "#1d1d1f"
  },
  {
    "name": "button-ghost-default",
    "value": "transparent"
  },
  {
    "name": "button-ghost-hover",
    "value": "#f5f5f7"
  },
  {
    "name": "button-ghost-active",
    "value": "#ececee"
  },
  {
    "name": "button-ghost-focus",
    "value": "transparent"
  },
  {
    "name": "button-ghost-disabled",
    "value": "transparent"
  },
  {
    "name": "button-ghost-fg",
    "value": "#1d1d1f"
  },
  {
    "name": "button-outline-default",
    "value": "#ffffff"
  },
  {
    "name": "button-outline-hover",
    "value": "#f5f5f7"
  },
  {
    "name": "button-outline-active",
    "value": "#ececee"
  },
  {
    "name": "button-outline-focus",
    "value": "#ffffff"
  },
  {
    "name": "button-outline-disabled",
    "value": "#f5f5f7"
  },
  {
    "name": "button-outline-fg",
    "value": "#1d1d1f"
  },
  {
    "name": "input-bg-default",
    "value": "#ffffff"
  },
  {
    "name": "input-bg-hover",
    "value": "#ffffff"
  },
  {
    "name": "input-bg-active",
    "value": "#ffffff"
  },
  {
    "name": "input-bg-focus",
    "value": "#ffffff"
  },
  {
    "name": "input-bg-disabled",
    "value": "#f5f5f7"
  },
  {
    "name": "input-border-default",
    "value": "#d2d2d7"
  },
  {
    "name": "input-border-hover",
    "value": "#86868b"
  },
  {
    "name": "input-border-active",
    "value": "#6e6e73"
  },
  {
    "name": "input-border-focus",
    "value": "#1d1d1f"
  },
  {
    "name": "input-border-disabled",
    "value": "#d2d2d7"
  },
  {
    "name": "input-border-error",
    "value": "#d94545"
  },
  {
    "name": "input-fg",
    "value": "#1d1d1f"
  },
  {
    "name": "input-placeholder",
    "value": "#86868b"
  },
  {
    "name": "input-ring",
    "value": "#1d1d1f"
  },
  {
    "name": "card-bg-default",
    "value": "#ffffff"
  },
  {
    "name": "card-bg-raised",
    "value": "#fbfbfd"
  },
  {
    "name": "card-bg-glass",
    "value": "rgba(255,255,255,0.72)"
  },
  {
    "name": "card-border",
    "value": "#d2d2d7"
  },
  {
    "name": "card-shadow",
    "value": "0 1px 1px rgba(0,0,0,0.05), 0 8px 14px rgba(0,0,0,0.05)"
  },
  {
    "name": "badge-default-bg",
    "value": "#f5f5f7"
  },
  {
    "name": "badge-default-fg",
    "value": "#1d1d1f"
  },
  {
    "name": "badge-success-bg",
    "value": "#ecfaf3"
  },
  {
    "name": "badge-success-fg",
    "value": "#1d6e4b"
  },
  {
    "name": "badge-success-border",
    "value": "#d6f2e3"
  },
  {
    "name": "badge-warning-bg",
    "value": "#fbf4e6"
  },
  {
    "name": "badge-warning-fg",
    "value": "#8f5f17"
  },
  {
    "name": "badge-warning-border",
    "value": "#f6e6c8"
  },
  {
    "name": "badge-error-bg",
    "value": "#fbeeec"
  },
  {
    "name": "badge-error-fg",
    "value": "#a32a2a"
  },
  {
    "name": "badge-error-border",
    "value": "#f7d6d2"
  },
  {
    "name": "badge-info-bg",
    "value": "#eef3fb"
  },
  {
    "name": "badge-info-fg",
    "value": "#2659b3"
  },
  {
    "name": "badge-info-border",
    "value": "#d6e2f6"
  },
  {
    "name": "select-trigger-default",
    "value": "#ffffff"
  },
  {
    "name": "select-trigger-hover",
    "value": "#ffffff"
  },
  {
    "name": "select-trigger-active",
    "value": "#ffffff"
  },
  {
    "name": "select-trigger-focus",
    "value": "#ffffff"
  },
  {
    "name": "select-trigger-disabled",
    "value": "#f5f5f7"
  },
  {
    "name": "select-border-default",
    "value": "#d2d2d7"
  },
  {
    "name": "select-border-hover",
    "value": "#86868b"
  },
  {
    "name": "select-border-active",
    "value": "#6e6e73"
  },
  {
    "name": "select-border-focus",
    "value": "#1d1d1f"
  },
  {
    "name": "select-border-disabled",
    "value": "#d2d2d7"
  },
  {
    "name": "select-border-error",
    "value": "#d94545"
  },
  {
    "name": "select-fg",
    "value": "#1d1d1f"
  },
  {
    "name": "select-placeholder",
    "value": "#86868b"
  },
  {
    "name": "select-optionBg-default",
    "value": "#ffffff"
  },
  {
    "name": "select-optionBg-hover",
    "value": "#f5f5f7"
  },
  {
    "name": "select-optionBg-selected",
    "value": "#ececee"
  },
  {
    "name": "switch-track-off",
    "value": "#d2d2d7"
  },
  {
    "name": "switch-track-on",
    "value": "#1d1d1f"
  },
  {
    "name": "switch-track-disabled",
    "value": "#ececee"
  },
  {
    "name": "switch-thumb",
    "value": "#ffffff"
  },
  {
    "name": "checkbox-bg-unchecked",
    "value": "#ffffff"
  },
  {
    "name": "checkbox-bg-checked",
    "value": "#1d1d1f"
  },
  {
    "name": "checkbox-bg-disabled",
    "value": "#f5f5f7"
  },
  {
    "name": "checkbox-border-default",
    "value": "#d2d2d7"
  },
  {
    "name": "checkbox-border-hover",
    "value": "#86868b"
  },
  {
    "name": "checkbox-border-checked",
    "value": "#1d1d1f"
  },
  {
    "name": "checkbox-border-disabled",
    "value": "#d2d2d7"
  },
  {
    "name": "checkbox-fg",
    "value": "#ffffff"
  },
  {
    "name": "radio-accent",
    "value": "#1d1d1f"
  },
  {
    "name": "radio-border-default",
    "value": "#d2d2d7"
  },
  {
    "name": "radio-border-hover",
    "value": "#86868b"
  },
  {
    "name": "radio-border-disabled",
    "value": "#d2d2d7"
  },
  {
    "name": "slider-track-bg",
    "value": "#ececee"
  },
  {
    "name": "slider-range-bg",
    "value": "#1d1d1f"
  },
  {
    "name": "slider-thumb-bg",
    "value": "#ffffff"
  },
  {
    "name": "slider-thumb-border",
    "value": "#1d1d1f"
  },
  {
    "name": "slider-thumb-hover",
    "value": "#000000"
  },
  {
    "name": "slider-thumb-disabled",
    "value": "#d2d2d7"
  },
  {
    "name": "tabs-list-bg",
    "value": "#f5f5f7"
  },
  {
    "name": "tabs-trigger-default",
    "value": "transparent"
  },
  {
    "name": "tabs-trigger-hover",
    "value": "#ececee"
  },
  {
    "name": "tabs-trigger-active",
    "value": "#ffffff"
  },
  {
    "name": "tabs-trigger-fg-default",
    "value": "#6e6e73"
  },
  {
    "name": "tabs-trigger-fg-active",
    "value": "#1d1d1f"
  },
  {
    "name": "accordion-trigger-default",
    "value": "transparent"
  },
  {
    "name": "accordion-trigger-hover",
    "value": "#f5f5f7"
  },
  {
    "name": "accordion-trigger-fg",
    "value": "#1d1d1f"
  },
  {
    "name": "accordion-content-fg",
    "value": "#6e6e73"
  },
  {
    "name": "accordion-border",
    "value": "#d2d2d7"
  },
  {
    "name": "pagination-btn-bg",
    "value": "#ffffff"
  },
  {
    "name": "pagination-btn-bg-hover",
    "value": "#f5f5f7"
  },
  {
    "name": "pagination-btn-bg-active",
    "value": "#1d1d1f"
  },
  {
    "name": "pagination-btn-border",
    "value": "#d2d2d7"
  },
  {
    "name": "pagination-btn-fg",
    "value": "#1d1d1f"
  },
  {
    "name": "pagination-btn-fg-active",
    "value": "#ffffff"
  },
  {
    "name": "tooltip-bg",
    "value": "#1d1d1f"
  },
  {
    "name": "tooltip-fg",
    "value": "#ffffff"
  },
  {
    "name": "tooltip-border",
    "value": "transparent"
  },
  {
    "name": "dropdown-menu-bg",
    "value": "#ffffff"
  },
  {
    "name": "dropdown-item-bg-default",
    "value": "transparent"
  },
  {
    "name": "dropdown-item-bg-hover",
    "value": "#f5f5f7"
  },
  {
    "name": "dropdown-item-bg-active",
    "value": "#1d1d1f"
  },
  {
    "name": "dropdown-item-bg-destructive-hover",
    "value": "#fbeeec"
  },
  {
    "name": "dropdown-item-fg-default",
    "value": "#1d1d1f"
  },
  {
    "name": "dropdown-item-fg-active",
    "value": "#ffffff"
  },
  {
    "name": "dropdown-item-fg-destructive",
    "value": "#d94545"
  },
  {
    "name": "dropdown-trigger-border",
    "value": "#d2d2d7"
  },
  {
    "name": "dropdown-trigger-bg-default",
    "value": "#ffffff"
  },
  {
    "name": "dropdown-trigger-bg-hover",
    "value": "#f5f5f7"
  }
];

export function generateThemeCSS(opts: {
  name: string;
  brand?: BrandOverride;
  semantic?: SemanticOverride;
  component?: Record<string, Record<string, string>>;
}): string {
  const lines: string[] = [];
  // Baseline: all light semantic + component entries.
  for (const entry of _LIGHT_ENTRIES) {
    lines.push('  --ucl-' + entry.name + ': ' + entry.value + ';');
  }
  // Brand overrides: Record<scaleName, Record<tone, value>>
  if (opts.brand) {
    for (const [scaleName, tones] of Object.entries(opts.brand)) {
      for (const [tone, value] of Object.entries(tones)) {
        lines.push('  --ucl-color-' + scaleName + '-' + tone + ': ' + value + ';');
      }
    }
  }
  // Semantic overrides: Record<varName, value>
  if (opts.semantic) {
    for (const [varName, value] of Object.entries(opts.semantic)) {
      lines.push('  --ucl-' + varName + ': ' + value + ';');
    }
  }
  // Component overrides: Record<componentName, Record<tokenName, value>>
  if (opts.component) {
    for (const [componentName, tokens] of Object.entries(opts.component)) {
      for (const [tokenName, value] of Object.entries(tokens)) {
        lines.push(
          '  --ucl-' + componentName + '-' + tokenName + ': ' + value + ';'
        );
      }
    }
  }
  const selector = '[data-theme="' + opts.name + '"]' + ' {';
  return selector + '\n' + lines.join('\n') + '\n}';
}
