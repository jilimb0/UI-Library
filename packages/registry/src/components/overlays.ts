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
  {
    id: 'dialog',
    slug: 'dialog',
    displayName: 'Dialog',
    package: '@ui-construction-library/core',
    version: '0.1.0',
    category: 'overlays',
    description:
      'Modal dialog overlay that traps focus and requires user interaction.',
    status: 'stable',
    tags: ['overlay', 'modal', 'dialog'],
    props: [
      {
        name: 'open',
        type: 'boolean',
        category: 'behavior',
        editingSurface: 'advanced-edit',
        description: 'Controlled open state.',
      },
      {
        name: 'defaultOpen',
        type: 'boolean',
        category: 'behavior',
        editingSurface: 'advanced-edit',
        description: 'Uncontrolled initial open state.',
        defaultValue: 'false',
      },
      {
        name: 'onOpenChange',
        type: '(open: boolean) => void',
        category: 'behavior',
        editingSurface: 'hidden',
        semantics: 'computed',
        description: 'Callback when open state changes.',
      },
      commonClassNameProp,
      commonChildrenProp,
    ],
    slots: ['trigger', 'default'],
    events: ['onOpenChange'],
    states: ['closed', 'open'],
    a11y: {
      role: 'dialog',
      ariaRequired: ['aria-modal', 'aria-labelledby (title)'],
      keyboard: ['Escape to close', 'Tab traps focus within dialog'],
      focusBehavior:
        'Focus moves to first focusable element when opened. Tab cycles within dialog.',
      screenReaderNotes: [
        'Dialog must have an accessible title (aria-labelledby).',
        'Must provide a close button or equivalent dismiss action.',
      ],
      invalidCombinations: [
        'dialog without title or aria-label',
        'dialog without focus trap',
      ],
    },
    responsiveBehavior: [
      'overlay',
      'centered on desktop',
      'full-screen on mobile',
    ],
    styleHooks: ['dialog.overlay', 'dialog.content', 'dialog.radius'],
    builder: {
      editingSurface: 'overlay',
      allowChildren: true,
      insertionRules: { blockedInsideInteractive: false },
    },
    recipes: [
      {
        id: 'confirmation-dialog',
        label: 'Confirmation Dialog',
        description:
          'Simple confirmation dialog with title, description, and actions.',
        requiredProps: ['children'],
        recommendedDefaults: {},
      },
    ],
    antiPatterns: [
      {
        id: 'dialog-without-close',
        description: 'Dialog without a dismiss mechanism.',
        reason:
          'Users cannot escape without taking action; violates WCAG 2.1.2.',
        fix: 'Always provide Escape key handling and a visible close button.',
      },
    ],
    export: { react: 'supported', next: 'supported' },
    compatibility: baseCompatibility,
  },
  {
    id: 'popover',
    slug: 'popover',
    displayName: 'Popover',
    package: '@ui-construction-library/core',
    version: '0.1.0',
    category: 'overlays',
    description: 'Floating content panel anchored to a trigger element.',
    status: 'stable',
    tags: ['overlay', 'floating', 'popup'],
    props: [
      {
        name: 'side',
        type: 'string',
        category: 'layout',
        editingSurface: 'layout-edit',
        description: 'Preferred side (top | right | bottom | left).',
        defaultValue: 'bottom',
      },
      {
        name: 'sideOffset',
        type: 'number',
        category: 'layout',
        editingSurface: 'layout-edit',
        description: 'Offset in pixels from the trigger.',
        defaultValue: '8',
      },
      {
        name: 'open',
        type: 'boolean',
        category: 'behavior',
        editingSurface: 'advanced-edit',
        description: 'Controlled open state.',
      },
      {
        name: 'defaultOpen',
        type: 'boolean',
        category: 'behavior',
        editingSurface: 'advanced-edit',
        description: 'Uncontrolled initial open state.',
        defaultValue: 'false',
      },
      {
        name: 'onOpenChange',
        type: '(open: boolean) => void',
        category: 'behavior',
        editingSurface: 'hidden',
        semantics: 'computed',
        description: 'Callback when open state changes.',
      },
      {
        name: 'size',
        type: 'string',
        category: 'layout',
        editingSurface: 'layout-edit',
        description: 'Size preset (sm | md | lg).',
        defaultValue: 'md',
      },
      commonClassNameProp,
      commonChildrenProp,
    ],
    slots: ['trigger', 'default'],
    events: ['onOpenChange'],
    states: ['closed', 'open'],
    a11y: {
      role: 'dialog',
      ariaRequired: ['aria-expanded on trigger', 'aria-controls on trigger'],
      keyboard: ['Escape to close', 'Tab moves into popover content'],
      focusBehavior: 'Focus moves to popover content when opened.',
      screenReaderNotes: [
        'Popover trigger must communicate expanded state.',
        'Interactive content inside popover must be keyboard accessible.',
      ],
      invalidCombinations: ['popover without dismiss mechanism'],
    },
    responsiveBehavior: ['flip side if viewport edge detected'],
    styleHooks: [
      'popover.bg',
      'popover.border',
      'popover.radius',
      'popover.shadow',
    ],
    builder: {
      editingSurface: 'overlay',
      allowChildren: true,
      insertionRules: { blockedInsideInteractive: false },
    },
    recipes: [
      {
        id: 'dropdown-popover',
        label: 'Dropdown Popover',
        description: 'Popover used as a dropdown menu with action items.',
        requiredProps: ['children'],
        recommendedDefaults: { side: 'bottom', size: 'md' },
      },
    ],
    antiPatterns: [
      {
        id: 'popover-without-dismiss',
        description: 'Popover without Escape or click-outside dismiss.',
        reason: 'Users cannot easily close the popover; creates a trap.',
        fix: 'Implement Escape and click-outside handlers.',
      },
    ],
    export: { react: 'supported', next: 'supported' },
    compatibility: baseCompatibility,
  },
];
