import {
  baseCompatibility,
  commonAsProp,
  commonChildrenProp,
  commonClassNameProp,
  commonDisabledProp,
  commonFullWidthProp,
  commonIconProp,
  commonLabelProp,
  commonLoadingProp,
  commonSizeProp,
  commonToneProp,
  commonVariantProp,
  interactiveRule,
  type RegistryComponent,
} from './shared';

export const actionsComponents: RegistryComponent[] = [
  {
    id: 'button',
    slug: 'button',
    displayName: 'Button',
    package: '@ui-construction-library/core',
    version: '0.1.0',
    category: 'actions',
    description:
      'Primary action trigger. Renders as <button> by default; use `as` for link behaviour.',
    status: 'stable',
    tags: ['cta', 'action', 'interactive'],
    props: [
      commonVariantProp,
      commonSizeProp,
      commonToneProp,
      commonDisabledProp,
      commonLoadingProp,
      commonFullWidthProp,
      commonAsProp,
      commonClassNameProp,
      commonChildrenProp,
      commonIconProp,
      commonLabelProp,
      {
        name: 'iconPosition',
        type: 'string',
        category: 'layout',
        editingSurface: 'layout-edit',
        description: 'Position of the icon relative to label (start | end).',
        defaultValue: 'start',
      },
      {
        name: 'onClick',
        type: '(event: React.MouseEvent) => void',
        category: 'behavior',
        editingSurface: 'hidden',
        semantics: 'computed',
        description: 'Click handler.',
      },
    ],
    slots: ['default', 'icon'],
    events: ['onClick'],
    states: ['default', 'hover', 'focus', 'active', 'disabled', 'loading'],
    a11y: {
      role: 'button',
      ariaRequired: [],
      keyboard: ['Enter', 'Space'],
      focusBehavior:
        'Focusable; receives focus via Tab. disabled=true removes from tab order.',
      screenReaderNotes: [
        'Visible label or aria-label is required.',
        'loading state should be communicated via aria-busy or visually hidden text.',
        'icon-only buttons must carry aria-label.',
      ],
      invalidCombinations: [
        'icon-only without label or aria-label',
        'disabled + loading simultaneously',
      ],
      localizationNotes: [
        'Label must be translatable; avoid hardcoded text inside icon SVG.',
      ],
    },
    responsiveBehavior: [
      'fullWidth optional via prop',
      'min touch target 44×44px',
    ],
    styleHooks: [
      'button.bg',
      'button.color',
      'button.border',
      'button.radius',
      'button.padding',
    ],
    builder: {
      editingSurface: 'prop-driven',
      allowChildren: true,
      insertionRules: interactiveRule,
    },
    recipes: [
      {
        id: 'primary-cta-button',
        label: 'Primary CTA Button',
        description:
          'High-emphasis call-to-action button for a single primary action per view.',
        requiredProps: ['children'],
        recommendedDefaults: { variant: 'solid', tone: 'primary', size: 'md' },
        a11yCaveats: ['Ensure only one primary CTA is visible per screen.'],
        doExample:
          '<Button variant="solid" tone="primary">Get started</Button>',
        dontExample:
          '<Button variant="solid" tone="primary">Click here</Button>',
      },
    ],
    antiPatterns: [
      {
        id: 'icon-only-no-label',
        description: 'Icon-only button without accessible label.',
        reason:
          'Screen readers announce no text; purpose is opaque to assistive technology.',
        fix: 'Add aria-label or a visually-hidden <span>.',
      },
      {
        id: 'multiple-primary-buttons',
        description: 'More than one primary-variant button in the same view.',
        reason:
          'Visual hierarchy is lost; user cannot identify the main action.',
        fix: 'Use one primary; demote others to secondary or ghost variant.',
      },
    ],
    export: { react: 'supported', next: 'supported' },
    compatibility: baseCompatibility,
  },
];
