import {
  baseCompatibility,
  commonChildrenProp,
  commonClassNameProp,
  type RegistryComponent,
} from './shared';

export const overlaysComponents: RegistryComponent[] = [
  {
    id: 'tooltip',
    slug: 'tooltip',
    displayName: 'Tooltip',
    package: '@ui-construction-library/core',
    version: '0.1.0',
    category: 'overlays',
    description:
      'Non-interactive supplementary label shown on hover or focus of a trigger element.',
    status: 'stable',
    tags: ['overlay', 'help', 'contextual'],
    props: [
      {
        name: 'content',
        type: 'string',
        category: 'content',
        editingSurface: 'content-edit',
        required: true,
        description: 'Tooltip text content.',
      },
      {
        name: 'placement',
        type: 'string',
        category: 'layout',
        editingSurface: 'layout-edit',
        description: 'Preferred placement (top | bottom | left | right).',
        defaultValue: 'top',
      },
      {
        name: 'delay',
        type: 'number',
        category: 'behavior',
        editingSurface: 'advanced-edit',
        description: 'Show delay in milliseconds.',
        defaultValue: '300',
      },
      {
        name: 'disabled',
        type: 'boolean',
        category: 'behavior',
        editingSurface: 'advanced-edit',
        description: 'Prevents tooltip from showing.',
        defaultValue: 'false',
      },
      commonClassNameProp,
      commonChildrenProp,
    ],
    slots: ['default'],
    events: [],
    states: ['hidden', 'visible'],
    a11y: {
      role: 'tooltip',
      ariaRequired: [
        'id on tooltip element',
        'aria-describedby on trigger referencing tooltip id',
      ],
      keyboard: ['Tooltip shows on trigger focus', 'Tooltip hides on Escape'],
      focusBehavior:
        'Tooltip itself is not focusable. Trigger element carries the focus.',
      screenReaderNotes: [
        'Tooltip content must not be the only way to access critical information.',
        'Link tooltip content via aria-describedby on the trigger, not aria-label.',
        'Do not place interactive elements (links, buttons) inside a Tooltip.',
      ],
      invalidCombinations: [
        'interactive children inside Tooltip',
        'Tooltip as primary content label (use aria-label instead)',
      ],
    },
    responsiveBehavior: [
      'touch devices: show on long-press or tap',
      'flip placement if viewport edge detected',
    ],
    styleHooks: [
      'tooltip.bg',
      'tooltip.color',
      'tooltip.radius',
      'tooltip.arrow.color',
    ],
    builder: {
      editingSurface: 'overlay',
      allowChildren: true,
      insertionRules: { blockedInsideInteractive: false },
    },
    recipes: [
      {
        id: 'icon-button-tooltip',
        label: 'Icon Button with Tooltip',
        description:
          'Tooltip wrapping an icon-only Button to provide a visible label on hover/focus.',
        requiredProps: ['content', 'children'],
        recommendedDefaults: { placement: 'top', delay: 300 },
        a11yCaveats: [
          'Ensure aria-describedby is wired between tooltip and trigger.',
        ],
      },
    ],
    antiPatterns: [
      {
        id: 'interactive-tooltip-children',
        description:
          'Placing interactive elements (links, buttons) inside a Tooltip.',
        reason:
          'Users cannot move focus into the tooltip; WCAG 1.4.13 requires hoverable/dismissible persistent content.',
        fix: 'Use a Popover or Dropdown for interactive overlay content.',
      },
      {
        id: 'tooltip-as-primary-label',
        description:
          'Using Tooltip as the only source of a label for its trigger.',
        reason:
          'Tooltip is supplementary; if content is critical it must always be visible.',
        fix: 'Add a visible label; use Tooltip only for additional context.',
      },
    ],
    export: { react: 'supported', next: 'supported' },
    compatibility: baseCompatibility,
  },
];
