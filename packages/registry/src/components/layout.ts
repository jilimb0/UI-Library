import {
  baseCompatibility,
  commonAsProp,
  commonChildrenProp,
  commonClassNameProp,
  commonToneProp,
  commonVariantProp,
  type RegistryComponent,
} from './shared';

export const layoutComponents: RegistryComponent[] = [
  {
    id: 'card',
    slug: 'card',
    displayName: 'Card',
    package: '@ui-construction-library/core',
    version: '0.1.0',
    category: 'layout',
    description:
      'Surface container grouping related content with optional header, body, and footer slots.',
    status: 'stable',
    tags: ['container', 'surface', 'layout'],
    props: [
      commonVariantProp,
      commonToneProp,
      commonClassNameProp,
      commonChildrenProp,
      commonAsProp,
      {
        name: 'padding',
        type: 'string',
        category: 'layout',
        editingSurface: 'layout-edit',
        description: 'Padding size preset (none | sm | md | lg).',
        defaultValue: 'md',
      },
      {
        name: 'shadow',
        type: 'string',
        category: 'style',
        editingSurface: 'quick-edit',
        description: 'Shadow elevation (none | sm | md | lg).',
        defaultValue: 'sm',
      },
      {
        name: 'interactive',
        type: 'boolean',
        category: 'behavior',
        editingSurface: 'advanced-edit',
        description: 'Applies hover/focus styles for clickable cards.',
        defaultValue: 'false',
      },
      {
        name: 'onClick',
        type: '(event: React.MouseEvent) => void',
        category: 'behavior',
        editingSurface: 'hidden',
        semantics: 'computed',
        description: 'Click handler (use with interactive=true).',
      },
    ],
    slots: ['header', 'default', 'footer', 'media'],
    events: ['onClick'],
    states: ['default', 'hover', 'focus'],
    a11y: {
      keyboard: [
        'Tab to focus when interactive=true',
        'Enter/Space to activate when interactive=true',
      ],
      focusBehavior:
        'Non-interactive cards are not focusable. interactive=true cards need role="button" or a focusable child.',
      screenReaderNotes: [
        'Interactive cards should use role="article" or role="region" with aria-label.',
        'Do not nest interactive elements inside an interactive card without careful focus management.',
        'Card heading conveys the group label for screen readers.',
      ],
      invalidCombinations: [
        'interactive=true without keyboard handler or focusable element',
        'nested interactive cards',
      ],
    },
    responsiveBehavior: [
      'full width in single-column layout',
      'fixed width in grid',
    ],
    styleHooks: [
      'card.bg',
      'card.border',
      'card.radius',
      'card.shadow',
      'card.padding',
    ],
    builder: {
      editingSurface: 'layout-container',
      allowChildren: true,
    },
    recipes: [
      {
        id: 'kpi-card',
        label: 'Dashboard KPI Card',
        description: 'Card displaying a metric label, value, and trend badge.',
        requiredProps: ['children'],
        recommendedDefaults: {
          variant: 'outlined',
          padding: 'md',
          shadow: 'sm',
        },
      },
    ],
    antiPatterns: [
      {
        id: 'card-colored-border',
        description: 'Using a thick colored left border to indicate status.',
        reason:
          'Colored side borders are an overused anti-pattern; relies on color alone.',
        fix: 'Use a Badge, tone prop, or surface color to communicate status.',
      },
      {
        id: 'nested-interactive-card',
        description:
          'An interactive card containing other interactive elements.',
        reason:
          'Creates nested interactives that violate WCAG 1.3.1 and confuse keyboard users.',
        fix: 'Make only specific inner elements interactive, or use a non-interactive card surface.',
      },
    ],
    export: { react: 'supported', next: 'supported' },
    compatibility: baseCompatibility,
  },
  {
    id: 'divider',
    slug: 'divider',
    displayName: 'Divider',
    package: '@ui-construction-library/core',
    version: '0.1.0',
    category: 'layout',
    description: 'Visual separation line or labeled separator.',
    status: 'stable',
    tags: ['separator', 'layout'],
    props: [commonClassNameProp],
    slots: ['default'],
    events: [],
    states: ['default'],
    a11y: {
      role: 'separator',
      keyboard: [],
      focusBehavior: 'Non-interactive; not focusable.',
      screenReaderNotes: ['Use aria-orientation for non-default orientation.'],
    },
    responsiveBehavior: ['fluid width'],
    styleHooks: ['divider.color'],
    builder: { editingSurface: 'layout-container', allowChildren: false },
    recipes: [],
    antiPatterns: [],
    export: { react: 'supported', next: 'supported' },
    compatibility: baseCompatibility,
  },
];
