// Phase 2.1 — standardized prop conventions
// Phase 2.2 — builder editing surface classification (editable + editingSurface)
// Phase 2.3 — full accessibility contract per component

export type PropType =
  | 'string'
  | 'boolean'
  | 'number'
  | 'ReactNode'
  | 'string | undefined'
  | 'boolean | undefined'
  | 'number | undefined'
  | '1|2|3|4|5|6'
  | 'ElementType'
  | '(value: string) => void'
  | '(checked: boolean) => void'
  | '(event: React.MouseEvent) => void';

export type PropCategory =
  | 'content'
  | 'layout'
  | 'style'
  | 'behavior'
  | 'accessibility'
  | 'data';

export type PropEditingSurface =
  | 'quick-edit'
  | 'content-edit'
  | 'layout-edit'
  | 'advanced-edit'
  | 'hidden';

export type PropEditingSemantics = 'editable' | 'computed' | 'locked';

export type RegistryProp = {
  name: string;
  type: PropType | string;
  category: PropCategory;
  editingSurface: PropEditingSurface;
  semantics?: PropEditingSemantics;
  required?: boolean;
  description?: string;
  defaultValue?: string;
};

export type InsertionRules = {
  allowedParentIds?: string[];
  blockedParentIds?: string[];
  blockedInsideInteractive?: boolean;
  requiresSelectedParent?: boolean;
};

// Phase 2.2: editing surface taxonomy
export type EditingSurface =
  | 'inline-editable' // text content editable directly on canvas
  | 'prop-driven' // controlled via inspector props only
  | 'data-bound' // driven by external data / bindings
  | 'layout-container' // positions / wraps children
  | 'section-block' // top-level page section
  | 'overlay' // renders above document flow (modal, tooltip)
  | 'advanced'; // complex; builder palette disabled by default

// Phase 2.3: full a11y contract
export type A11yContract = {
  role?: string;
  ariaRequired?: string[]; // required aria-* attributes
  keyboard: string[]; // key interactions
  focusBehavior?: string; // focus management notes
  screenReaderNotes: string[];
  invalidCombinations?: string[]; // e.g. "icon-only without aria-label"
  localizationNotes?: string[];
};

export type RegistryComponent = {
  id: string;
  slug: string;
  displayName: string;
  package: string;
  version: string;
  category: string;
  description: string;
  status: 'stable' | 'beta' | 'experimental' | 'deprecated';
  tags: string[];

  // Phase 2.1: standardized props
  props: RegistryProp[];

  slots: string[];
  events: string[];
  states: string[];

  // Phase 2.3: full a11y contract
  a11y: A11yContract;

  responsiveBehavior: string[];
  styleHooks: string[];

  builder: {
    editingSurface: EditingSurface; // Phase 2.2
    /** @deprecated use editingSurface */
    editable?: string;
    allowChildren: boolean;
    insertionRules?: InsertionRules;
  };

  // Phase 2.4: machine-readable recipes
  recipes: Array<{
    id: string;
    label: string;
    description: string;
    requiredProps: string[];
    recommendedDefaults: Record<string, unknown>;
    a11yCaveats?: string[];
    doExample?: string;
    dontExample?: string;
  }>;

  // Phase 2.5: machine-readable anti-patterns
  antiPatterns: Array<{
    id: string;
    description: string;
    reason: string;
    fix?: string;
  }>;

  export: {
    react: 'supported' | 'partial' | 'unsupported';
    next: 'supported' | 'partial' | 'unsupported';
  };

  compatibility: {
    react: boolean;
    next: boolean;
    static: boolean;
    webComponents: boolean;
    vue: boolean;
    angular: boolean;
  };
};

// ─── shared constants ──────────────────────────────────────────────────────

const baseCompatibility: RegistryComponent['compatibility'] = {
  react: true,
  next: true,
  static: false,
  webComponents: false,
  vue: false,
  angular: false,
};

const interactiveRule: InsertionRules = { blockedInsideInteractive: true };

// ─── standardized common props ─────────────────────────────────────────────

const commonVariantProp: RegistryProp = {
  name: 'variant',
  type: 'string',
  category: 'style',
  editingSurface: 'quick-edit',
  description: 'Visual style variant of the component.',
  defaultValue: 'default',
};

const commonSizeProp: RegistryProp = {
  name: 'size',
  type: 'string',
  category: 'layout',
  editingSurface: 'layout-edit',
  description: 'Size preset (sm | md | lg).',
  defaultValue: 'md',
};

const commonToneProp: RegistryProp = {
  name: 'tone',
  type: 'string',
  category: 'style',
  editingSurface: 'quick-edit',
  description:
    'Semantic color tone (neutral | primary | success | warning | error).',
  defaultValue: 'neutral',
};

const commonDisabledProp: RegistryProp = {
  name: 'disabled',
  type: 'boolean',
  category: 'behavior',
  editingSurface: 'advanced-edit',
  description: 'Disables the component and prevents interaction.',
  defaultValue: 'false',
};

const commonLoadingProp: RegistryProp = {
  name: 'loading',
  type: 'boolean',
  category: 'behavior',
  editingSurface: 'advanced-edit',
  description: 'Shows a loading indicator and prevents interaction.',
  defaultValue: 'false',
};

const commonFullWidthProp: RegistryProp = {
  name: 'fullWidth',
  type: 'boolean',
  category: 'layout',
  editingSurface: 'layout-edit',
  description: 'Makes the component span the full width of its container.',
  defaultValue: 'false',
};

const commonAsProp: RegistryProp = {
  name: 'as',
  type: 'ElementType',
  category: 'accessibility',
  editingSurface: 'advanced-edit',
  semantics: 'locked',
  description: 'Polymorphic element type override.',
};

const commonClassNameProp: RegistryProp = {
  name: 'className',
  type: 'string',
  category: 'style',
  editingSurface: 'hidden',
  semantics: 'locked',
  description: 'Additional CSS class names.',
};

const commonChildrenProp: RegistryProp = {
  name: 'children',
  type: 'ReactNode',
  category: 'content',
  editingSurface: 'content-edit',
  description: 'Child content.',
};

const commonIconProp: RegistryProp = {
  name: 'icon',
  type: 'ReactNode',
  category: 'content',
  editingSurface: 'content-edit',
  description: 'Leading icon element.',
};

const commonLabelProp: RegistryProp = {
  name: 'label',
  type: 'string',
  category: 'content',
  editingSurface: 'content-edit',
  description:
    'Accessible label; visible or used as aria-label when no visible text is present.',
};

const commonDescriptionProp: RegistryProp = {
  name: 'description',
  type: 'string',
  category: 'content',
  editingSurface: 'content-edit',
  description:
    'Supplementary description text rendered below the primary label.',
};

const commonErrorProp: RegistryProp = {
  name: 'error',
  type: 'string',
  category: 'behavior',
  editingSurface: 'advanced-edit',
  description:
    'Inline error message. When set, the field enters an error state.',
};

const commonRequiredProp: RegistryProp = {
  name: 'required',
  type: 'boolean',
  category: 'accessibility',
  editingSurface: 'advanced-edit',
  description: 'Marks the field as required in forms.',
  defaultValue: 'false',
};

const commonValueProp: RegistryProp = {
  name: 'value',
  type: 'string',
  category: 'content',
  editingSurface: 'content-edit',
  description: 'Controlled value.',
};

const commonDefaultValueProp: RegistryProp = {
  name: 'defaultValue',
  type: 'string',
  category: 'content',
  editingSurface: 'content-edit',
  description: 'Uncontrolled initial value.',
};

const commonOnChangeProp: RegistryProp = {
  name: 'onChange',
  type: '(value: string) => void',
  category: 'behavior',
  editingSurface: 'hidden',
  semantics: 'computed',
  description: 'Change handler for controlled usage.',
};

// ─── component registry ────────────────────────────────────────────────────

export const foundationalComponents: RegistryComponent[] = [
  // ── Button ──────────────────────────────────────────────────────────────
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

  // ── Link ────────────────────────────────────────────────────────────────
  {
    id: 'link',
    slug: 'link',
    displayName: 'Link',
    package: '@ui-construction-library/core',
    version: '0.1.0',
    category: 'navigation',
    description: 'Navigation text link. Renders as <a> by default.',
    status: 'stable',
    tags: ['navigation', 'interactive'],
    props: [
      {
        name: 'href',
        type: 'string',
        category: 'content',
        editingSurface: 'content-edit',
        required: true,
        description: 'Link destination URL.',
      },
      {
        name: 'target',
        type: 'string',
        category: 'behavior',
        editingSurface: 'advanced-edit',
        description: 'Browsing context (_blank | _self | _parent | _top).',
        defaultValue: '_self',
      },
      {
        name: 'rel',
        type: 'string',
        category: 'accessibility',
        editingSurface: 'advanced-edit',
        description:
          'Link relationship. Defaults to "noopener noreferrer" when target="_blank".',
      },
      commonVariantProp,
      commonSizeProp,
      commonToneProp,
      commonClassNameProp,
      commonChildrenProp,
      commonIconProp,
      {
        name: 'onClick',
        type: '(event: React.MouseEvent) => void',
        category: 'behavior',
        editingSurface: 'hidden',
        semantics: 'computed',
        description: 'Click handler.',
      },
    ],
    slots: ['default'],
    events: ['onClick'],
    states: ['default', 'hover', 'focus', 'visited', 'active'],
    a11y: {
      role: 'link',
      ariaRequired: [],
      keyboard: ['Enter'],
      focusBehavior: 'Focusable via Tab. Activates on Enter.',
      screenReaderNotes: [
        'Link text must be meaningful out of context.',
        'External links (target="_blank") should announce opening in new tab via visually-hidden text or aria-label.',
      ],
      invalidCombinations: [
        'empty or whitespace-only href',
        'onClick without href for navigation (use Button instead)',
      ],
      localizationNotes: [
        'Avoid directional language ("click here", "see above") in link text.',
      ],
    },
    responsiveBehavior: [
      'inline wrapping',
      'touch target padding applies at mobile viewports',
    ],
    styleHooks: ['link.color', 'link.decoration', 'link.visited.color'],
    builder: {
      editingSurface: 'inline-editable',
      allowChildren: true,
      insertionRules: interactiveRule,
    },
    recipes: [
      {
        id: 'sidebar-nav-link',
        label: 'Sidebar Navigation Link',
        description: 'Link inside a sidebar nav group with icon and label.',
        requiredProps: ['href', 'children'],
        recommendedDefaults: { variant: 'ghost', tone: 'neutral' },
        doExample:
          '<Link href="/dashboard" icon={<DashboardIcon />}>Dashboard</Link>',
        dontExample: '<Link href="/dashboard">Click here</Link>',
      },
    ],
    antiPatterns: [
      {
        id: 'empty-href',
        description: 'Link with empty, "#", or "javascript:void(0)" href.',
        reason:
          'Not a real navigation target; breaks keyboard and assistive technology behaviour.',
        fix: 'Use Button with onClick for non-navigation actions.',
      },
      {
        id: 'generic-link-text',
        description:
          'Link text is "click here", "read more", or similarly non-descriptive.',
        reason:
          'Screen reader users navigating by links cannot determine the destination.',
        fix: 'Describe the destination or action in the link text.',
      },
    ],
    export: { react: 'supported', next: 'supported' },
    compatibility: baseCompatibility,
  },

  // ── Text ────────────────────────────────────────────────────────────────
  {
    id: 'text',
    slug: 'text',
    displayName: 'Text',
    package: '@ui-construction-library/core',
    version: '0.1.0',
    category: 'typography',
    description:
      'Body text primitive. Renders as <p> by default; use `as` to change semantic element.',
    status: 'stable',
    tags: ['content', 'typography'],
    props: [
      commonSizeProp,
      commonToneProp,
      commonAsProp,
      commonClassNameProp,
      commonChildrenProp,
      {
        name: 'truncate',
        type: 'boolean',
        category: 'layout',
        editingSurface: 'layout-edit',
        description: 'Truncates overflowing text with an ellipsis.',
        defaultValue: 'false',
      },
      {
        name: 'align',
        type: 'string',
        category: 'layout',
        editingSurface: 'layout-edit',
        description: 'Text alignment (start | center | end).',
        defaultValue: 'start',
      },
      {
        name: 'weight',
        type: 'string',
        category: 'style',
        editingSurface: 'quick-edit',
        description: 'Font weight (regular | medium | semibold | bold).',
        defaultValue: 'regular',
      },
    ],
    slots: ['default'],
    events: [],
    states: ['default'],
    a11y: {
      keyboard: [],
      focusBehavior: 'Non-interactive; not focusable.',
      screenReaderNotes: [
        'Do not use as a heading substitute; use Heading component instead.',
      ],
      invalidCombinations: [
        '<Text as="h1|h2|h3"> — use Heading component for semantic headings',
      ],
      localizationNotes: [
        'Bidirectional text handled by browser; ensure dir attribute set on parent for RTL.',
      ],
    },
    responsiveBehavior: ['wrap', 'fluid font size via token'],
    styleHooks: ['text.color', 'text.size', 'text.weight'],
    builder: {
      editingSurface: 'inline-editable',
      allowChildren: true,
    },
    recipes: [
      {
        id: 'empty-state-body',
        label: 'Empty State Body Text',
        description: 'Supportive description in an empty state.',
        requiredProps: ['children'],
        recommendedDefaults: { size: 'md', tone: 'muted', align: 'center' },
        doExample:
          '<Text tone="muted">No projects yet. Create your first to get started.</Text>',
        dontExample: '<Text>No items</Text>',
      },
    ],
    antiPatterns: [
      {
        id: 'text-as-heading',
        description:
          'Using <Text as="h1"> or styling Text to look like a heading.',
        reason:
          'Heading landmark semantics are lost; document outline breaks for screen readers.',
        fix: 'Use the Heading component.',
      },
      {
        id: 'very-low-contrast',
        description:
          'Applying a custom tone or className that results in contrast below 4.5:1.',
        reason: 'Fails WCAG AA for normal-size text.',
        fix: 'Use semantic tone tokens; verify contrast with design tokens.',
      },
    ],
    export: { react: 'supported', next: 'supported' },
    compatibility: baseCompatibility,
  },

  // ── Heading ─────────────────────────────────────────────────────────────
  {
    id: 'heading',
    slug: 'heading',
    displayName: 'Heading',
    package: '@ui-construction-library/core',
    version: '0.1.0',
    category: 'typography',
    description: 'Semantic section heading h1–h6.',
    status: 'stable',
    tags: ['content', 'typography', 'title'],
    props: [
      {
        name: 'level',
        type: '1|2|3|4|5|6',
        category: 'accessibility',
        editingSurface: 'advanced-edit',
        required: true,
        description: 'HTML heading level and semantic rank.',
        defaultValue: '2',
      },
      {
        name: 'visualSize',
        type: 'string',
        category: 'style',
        editingSurface: 'quick-edit',
        description:
          'Override visual size independently from semantic level (1|2|3|4|5|6).',
      },
      commonToneProp,
      commonAsProp,
      commonClassNameProp,
      commonChildrenProp,
      {
        name: 'truncate',
        type: 'boolean',
        category: 'layout',
        editingSurface: 'layout-edit',
        description: 'Truncates overflowing text with an ellipsis.',
        defaultValue: 'false',
      },
    ],
    slots: ['default'],
    events: [],
    states: ['default'],
    a11y: {
      keyboard: [],
      focusBehavior:
        'Non-interactive; not focusable by default. May receive focus programmatically after route navigation.',
      screenReaderNotes: [
        'Do not skip heading levels (e.g. h1 → h3).',
        'One h1 per page.',
        'Heading text must describe the section it introduces.',
      ],
      invalidCombinations: [
        'Multiple h1 on one page',
        'Skipped heading levels',
      ],
      localizationNotes: ['Heading text must be translatable.'],
    },
    responsiveBehavior: ['wrap', 'fluid font size via token'],
    styleHooks: [
      'heading.color',
      'heading.size',
      'heading.weight',
      'heading.lineHeight',
    ],
    builder: {
      editingSurface: 'inline-editable',
      allowChildren: true,
    },
    recipes: [
      {
        id: 'page-title',
        label: 'Page Title',
        description: 'Primary h1 for a page.',
        requiredProps: ['level', 'children'],
        recommendedDefaults: { level: 1, visualSize: '2xl' },
        a11yCaveats: ['Only one h1 per page.'],
      },
    ],
    antiPatterns: [
      {
        id: 'heading-level-misuse',
        description:
          'Choosing heading level for visual size rather than semantic rank.',
        reason: 'Screen reader outline and landmark navigation break.',
        fix: 'Set level semantically; use visualSize prop to adjust appearance.',
      },
    ],
    export: { react: 'supported', next: 'supported' },
    compatibility: baseCompatibility,
  },

  // ── Badge ────────────────────────────────────────────────────────────────
  {
    id: 'badge',
    slug: 'badge',
    displayName: 'Badge',
    package: '@ui-construction-library/core',
    version: '0.1.0',
    category: 'feedback',
    description: 'Compact inline label conveying status, count, or category.',
    status: 'stable',
    tags: ['status', 'label'],
    props: [
      commonToneProp,
      commonVariantProp,
      commonSizeProp,
      commonClassNameProp,
      commonChildrenProp,
      commonIconProp,
      {
        name: 'dot',
        type: 'boolean',
        category: 'style',
        editingSurface: 'quick-edit',
        description: 'Shows a coloured dot indicator instead of text.',
        defaultValue: 'false',
      },
    ],
    slots: ['default'],
    events: [],
    states: ['default'],
    a11y: {
      keyboard: [],
      focusBehavior: 'Non-interactive; not focusable.',
      screenReaderNotes: [
        'Do not rely on color alone to convey status — include visible text.',
        'For dot variant, provide aria-label describing the status.',
      ],
      invalidCombinations: ['dot=true without aria-label or adjacent text'],
      localizationNotes: [
        'Status labels must be translatable; avoid icon-only status.',
      ],
    },
    responsiveBehavior: ['inline', 'does not wrap'],
    styleHooks: ['badge.bg', 'badge.color', 'badge.border', 'badge.radius'],
    builder: {
      editingSurface: 'prop-driven',
      allowChildren: true,
    },
    recipes: [
      {
        id: 'status-badge',
        label: 'Status Badge',
        description: 'Inline status indicator on a table row or card.',
        requiredProps: ['children'],
        recommendedDefaults: { tone: 'success', variant: 'soft' },
        doExample: '<Badge tone="success">Active</Badge>',
        dontExample: '<Badge tone="success" dot />',
      },
    ],
    antiPatterns: [
      {
        id: 'color-only-status',
        description: 'Conveying status using color without text.',
        reason:
          'Fails WCAG 1.4.1 (Use of Color); color-blind users cannot distinguish states.',
        fix: 'Always include text label; use dot variant only with accompanying visible text or aria-label.',
      },
    ],
    export: { react: 'supported', next: 'supported' },
    compatibility: baseCompatibility,
  },

  // ── Avatar ───────────────────────────────────────────────────────────────
  {
    id: 'avatar',
    slug: 'avatar',
    displayName: 'Avatar',
    package: '@ui-construction-library/core',
    version: '0.1.0',
    category: 'media',
    description:
      'User or entity visual identity — image, initials, or icon fallback.',
    status: 'stable',
    tags: ['user', 'image', 'profile'],
    props: [
      {
        name: 'src',
        type: 'string',
        category: 'content',
        editingSurface: 'content-edit',
        description: 'Image source URL.',
      },
      {
        name: 'alt',
        type: 'string',
        category: 'accessibility',
        editingSurface: 'advanced-edit',
        description: 'Accessible alt text for the image.',
        required: true,
      },
      {
        name: 'name',
        type: 'string',
        category: 'content',
        editingSurface: 'content-edit',
        description: 'Name used to derive initials fallback.',
      },
      commonSizeProp,
      commonToneProp,
      commonClassNameProp,
      {
        name: 'shape',
        type: 'string',
        category: 'style',
        editingSurface: 'quick-edit',
        description: 'Shape of the avatar (circle | square).',
        defaultValue: 'circle',
      },
      {
        name: 'status',
        type: 'string',
        category: 'behavior',
        editingSurface: 'advanced-edit',
        description: 'Presence indicator (online | away | busy | offline).',
      },
    ],
    slots: ['fallback'],
    events: [],
    states: ['default', 'loading', 'error'],
    a11y: {
      role: 'img',
      ariaRequired: ['alt when src is set'],
      keyboard: [],
      focusBehavior: 'Non-interactive; not focusable.',
      screenReaderNotes: [
        'alt must describe the person or entity, not the visual style.',
        'Decorative avatars use alt="".',
        'Status indicator must be communicated via aria-label or visually-hidden text.',
      ],
      invalidCombinations: [
        'src without alt',
        'status indicator without accessible label',
      ],
    },
    responsiveBehavior: ['fixed size; use size prop for responsive variants'],
    styleHooks: ['avatar.bg', 'avatar.color', 'avatar.border', 'avatar.radius'],
    builder: {
      editingSurface: 'prop-driven',
      allowChildren: false,
    },
    recipes: [
      {
        id: 'user-avatar-with-name',
        label: 'Avatar with Name',
        description: 'Avatar alongside display name and secondary label.',
        requiredProps: ['alt'],
        recommendedDefaults: { size: 'md', shape: 'circle' },
      },
    ],
    antiPatterns: [
      {
        id: 'avatar-no-alt',
        description: 'Avatar image without alt attribute.',
        reason:
          'Image is invisible to screen readers; user identity is not communicated.',
        fix: 'Always provide alt with the person\'s name or alt="" for purely decorative avatars.',
      },
    ],
    export: { react: 'supported', next: 'supported' },
    compatibility: baseCompatibility,
  },

  // ── Icon ─────────────────────────────────────────────────────────────────
  {
    id: 'icon',
    slug: 'icon',
    displayName: 'Icon',
    package: '@ui-construction-library/core',
    version: '0.1.0',
    category: 'media',
    description:
      'Wrapper for SVG icon primitives from the design system icon set.',
    status: 'stable',
    tags: ['icon', 'svg', 'visual'],
    props: [
      {
        name: 'name',
        type: 'string',
        category: 'content',
        editingSurface: 'content-edit',
        required: true,
        description: 'Icon identifier from the icon set.',
      },
      commonSizeProp,
      commonToneProp,
      commonClassNameProp,
      commonLabelProp,
      {
        name: 'decorative',
        type: 'boolean',
        category: 'accessibility',
        editingSurface: 'advanced-edit',
        description:
          'When true, the icon is hidden from assistive technology (aria-hidden).',
        defaultValue: 'false',
      },
    ],
    slots: [],
    events: [],
    states: ['default'],
    a11y: {
      role: 'img',
      ariaRequired: ['aria-label when decorative=false'],
      keyboard: [],
      focusBehavior: 'Non-interactive; not focusable.',
      screenReaderNotes: [
        'Standalone meaningful icons require aria-label or label prop.',
        'Icons inside labelled buttons should use decorative=true.',
        'Never convey information through icon shape alone without a text alternative.',
      ],
      invalidCombinations: ['decorative=false without label or aria-label'],
    },
    responsiveBehavior: ['fixed size; scales with size prop'],
    styleHooks: ['icon.color', 'icon.size'],
    builder: {
      editingSurface: 'prop-driven',
      allowChildren: false,
    },
    recipes: [],
    antiPatterns: [
      {
        id: 'icon-only-no-accessible-name',
        description: 'Meaningful icon without accessible name.',
        reason: 'Icon purpose is invisible to screen readers.',
        fix: 'Set decorative=false and provide label, or ensure parent element carries the label.',
      },
    ],
    export: { react: 'supported', next: 'supported' },
    compatibility: baseCompatibility,
  },

  // ── Input ────────────────────────────────────────────────────────────────
  {
    id: 'input',
    slug: 'input',
    displayName: 'Input',
    package: '@ui-construction-library/core',
    version: '0.1.0',
    category: 'forms',
    description: 'Single-line text input field.',
    status: 'stable',
    tags: ['form', 'input', 'interactive'],
    props: [
      commonLabelProp,
      commonDescriptionProp,
      commonErrorProp,
      commonRequiredProp,
      commonDisabledProp,
      commonSizeProp,
      commonVariantProp,
      commonFullWidthProp,
      commonClassNameProp,
      commonValueProp,
      commonDefaultValueProp,
      commonOnChangeProp,
      commonIconProp,
      {
        name: 'placeholder',
        type: 'string',
        category: 'content',
        editingSurface: 'content-edit',
        description: 'Placeholder text shown when value is empty.',
      },
      {
        name: 'type',
        type: 'string',
        category: 'behavior',
        editingSurface: 'advanced-edit',
        description:
          'HTML input type (text | email | password | number | search | tel | url).',
        defaultValue: 'text',
      },
      {
        name: 'autoComplete',
        type: 'string',
        category: 'behavior',
        editingSurface: 'advanced-edit',
        description: 'HTML autocomplete attribute.',
      },
      {
        name: 'maxLength',
        type: 'number',
        category: 'behavior',
        editingSurface: 'advanced-edit',
        description: 'Maximum number of characters.',
      },
      {
        name: 'readOnly',
        type: 'boolean',
        category: 'behavior',
        editingSurface: 'advanced-edit',
        description: 'Makes the field read-only.',
        defaultValue: 'false',
      },
    ],
    slots: ['leading', 'trailing'],
    events: ['onChange', 'onBlur', 'onFocus', 'onKeyDown'],
    states: ['default', 'focus', 'error', 'disabled', 'readOnly'],
    a11y: {
      role: 'textbox',
      ariaRequired: ['aria-label or associated <label>'],
      keyboard: ['Tab to focus', 'Type to input', 'Escape to clear optional'],
      focusBehavior: 'Focusable via Tab. Visible focus ring required.',
      screenReaderNotes: [
        'Every Input must have an associated visible label or aria-label.',
        'Error message must be linked via aria-describedby.',
        'Placeholder is not a substitute for label.',
        'required=true should also set aria-required="true".',
      ],
      invalidCombinations: [
        'no label and no aria-label',
        'error without error message text',
      ],
      localizationNotes: [
        'placeholder and label must be translatable; avoid English-only defaults.',
      ],
    },
    responsiveBehavior: ['fullWidth optional', 'min touch target height 44px'],
    styleHooks: [
      'input.bg',
      'input.border',
      'input.color',
      'input.focus.ring',
      'input.error.border',
    ],
    builder: {
      editingSurface: 'prop-driven',
      allowChildren: false,
      insertionRules: interactiveRule,
    },
    recipes: [
      {
        id: 'form-field-input',
        label: 'Standard Form Field Input',
        description:
          'Labelled input with optional description and error message.',
        requiredProps: ['label'],
        recommendedDefaults: { size: 'md', fullWidth: true },
        a11yCaveats: [
          'Always provide label; do not rely on placeholder alone.',
        ],
        doExample: '<Input label="Email address" type="email" required />',
        dontExample: '<Input placeholder="Email address" />',
      },
    ],
    antiPatterns: [
      {
        id: 'placeholder-as-label',
        description: 'Using placeholder instead of a visible label.',
        reason: 'Placeholder disappears on focus; fails WCAG 1.3.1 and 3.3.2.',
        fix: 'Always use label prop or an associated <label> element.',
      },
      {
        id: 'uncontrolled-controlled-mismatch',
        description: 'Providing both value and defaultValue.',
        reason:
          'React will throw a warning and component behaviour is undefined.',
        fix: 'Use either value+onChange (controlled) or defaultValue (uncontrolled).',
      },
    ],
    export: { react: 'supported', next: 'supported' },
    compatibility: baseCompatibility,
  },

  // ── TextArea ─────────────────────────────────────────────────────────────
  {
    id: 'text-area',
    slug: 'text-area',
    displayName: 'TextArea',
    package: '@ui-construction-library/core',
    version: '0.1.0',
    category: 'forms',
    description: 'Multi-line text input field.',
    status: 'stable',
    tags: ['form', 'input', 'interactive', 'multiline'],
    props: [
      commonLabelProp,
      commonDescriptionProp,
      commonErrorProp,
      commonRequiredProp,
      commonDisabledProp,
      commonSizeProp,
      commonFullWidthProp,
      commonClassNameProp,
      commonValueProp,
      commonDefaultValueProp,
      commonOnChangeProp,
      {
        name: 'placeholder',
        type: 'string',
        category: 'content',
        editingSurface: 'content-edit',
        description: 'Placeholder text.',
      },
      {
        name: 'rows',
        type: 'number',
        category: 'layout',
        editingSurface: 'layout-edit',
        description: 'Initial visible row count.',
        defaultValue: '3',
      },
      {
        name: 'maxLength',
        type: 'number',
        category: 'behavior',
        editingSurface: 'advanced-edit',
        description: 'Maximum character count.',
      },
      {
        name: 'resize',
        type: 'string',
        category: 'layout',
        editingSurface: 'layout-edit',
        description: 'Resize behaviour (none | vertical | horizontal | both).',
        defaultValue: 'vertical',
      },
      {
        name: 'readOnly',
        type: 'boolean',
        category: 'behavior',
        editingSurface: 'advanced-edit',
        description: 'Makes the field read-only.',
        defaultValue: 'false',
      },
    ],
    slots: [],
    events: ['onChange', 'onBlur', 'onFocus', 'onKeyDown'],
    states: ['default', 'focus', 'error', 'disabled', 'readOnly'],
    a11y: {
      role: 'textbox',
      ariaRequired: [
        'aria-label or associated <label>',
        'aria-multiline="true" (implicit on <textarea>)',
      ],
      keyboard: ['Tab to focus', 'Type to input'],
      focusBehavior: 'Focusable via Tab.',
      screenReaderNotes: [
        'Requires visible label or aria-label.',
        'Error message linked via aria-describedby.',
        'Character count (if shown) should update aria-live region.',
      ],
      invalidCombinations: ['no label and no aria-label'],
      localizationNotes: ['placeholder and label must be translatable.'],
    },
    responsiveBehavior: ['fullWidth optional', 'min touch target height 44px'],
    styleHooks: [
      'textarea.bg',
      'textarea.border',
      'textarea.color',
      'textarea.focus.ring',
      'textarea.error.border',
    ],
    builder: {
      editingSurface: 'prop-driven',
      allowChildren: false,
      insertionRules: interactiveRule,
    },
    recipes: [
      {
        id: 'notes-textarea',
        label: 'Notes Field',
        description: 'Resizable multi-line notes input with character count.',
        requiredProps: ['label'],
        recommendedDefaults: { rows: 4, resize: 'vertical', fullWidth: true },
      },
    ],
    antiPatterns: [
      {
        id: 'placeholder-as-label',
        description: 'Using placeholder instead of a visible label.',
        reason: 'Placeholder disappears on focus; fails WCAG 1.3.1.',
        fix: 'Always provide label prop.',
      },
    ],
    export: { react: 'supported', next: 'supported' },
    compatibility: baseCompatibility,
  },

  // ── Select ───────────────────────────────────────────────────────────────
  {
    id: 'select',
    slug: 'select',
    displayName: 'Select',
    package: '@ui-construction-library/core',
    version: '0.1.0',
    category: 'forms',
    description:
      'Dropdown selection field backed by native <select> or a custom listbox.',
    status: 'stable',
    tags: ['form', 'dropdown', 'interactive'],
    props: [
      commonLabelProp,
      commonDescriptionProp,
      commonErrorProp,
      commonRequiredProp,
      commonDisabledProp,
      commonSizeProp,
      commonFullWidthProp,
      commonClassNameProp,
      commonValueProp,
      commonDefaultValueProp,
      commonOnChangeProp,
      {
        name: 'options',
        type: 'string',
        category: 'data',
        editingSurface: 'advanced-edit',
        required: true,
        description:
          'Array of { value: string; label: string; disabled?: boolean } option objects.',
      },
      {
        name: 'placeholder',
        type: 'string',
        category: 'content',
        editingSurface: 'content-edit',
        description: 'Placeholder option shown when no value is selected.',
      },
      {
        name: 'multiple',
        type: 'boolean',
        category: 'behavior',
        editingSurface: 'advanced-edit',
        description: 'Allows multiple selections.',
        defaultValue: 'false',
      },
    ],
    slots: ['option'],
    events: ['onChange', 'onBlur', 'onFocus'],
    states: ['default', 'focus', 'error', 'disabled'],
    a11y: {
      role: 'combobox',
      ariaRequired: [
        'aria-label or associated <label>',
        'aria-expanded on custom listbox trigger',
      ],
      keyboard: [
        'Tab to focus',
        'Arrow keys to navigate options',
        'Enter/Space to select',
        'Escape to close',
      ],
      focusBehavior: 'Focusable via Tab. Focus moves into listbox when opened.',
      screenReaderNotes: [
        'Requires visible label or aria-label.',
        'Custom listbox must implement ARIA combobox or listbox pattern fully.',
        'Selected option announced on change.',
      ],
      invalidCombinations: [
        'no label and no aria-label',
        'empty options array',
      ],
    },
    responsiveBehavior: ['fullWidth optional'],
    styleHooks: [
      'select.bg',
      'select.border',
      'select.color',
      'select.focus.ring',
    ],
    builder: {
      editingSurface: 'prop-driven',
      allowChildren: false,
      insertionRules: interactiveRule,
    },
    recipes: [
      {
        id: 'filter-select',
        label: 'Filter Select',
        description: 'Select used as a filter control in a table toolbar.',
        requiredProps: ['label', 'options'],
        recommendedDefaults: { size: 'sm', placeholder: 'All' },
      },
    ],
    antiPatterns: [
      {
        id: 'select-no-label',
        description: 'Select without a visible label.',
        reason: 'Purpose is unclear for screen reader and keyboard users.',
        fix: 'Always provide label prop or associated <label>.',
      },
    ],
    export: { react: 'supported', next: 'supported' },
    compatibility: baseCompatibility,
  },

  // ── Checkbox ─────────────────────────────────────────────────────────────
  {
    id: 'checkbox',
    slug: 'checkbox',
    displayName: 'Checkbox',
    package: '@ui-construction-library/core',
    version: '0.1.0',
    category: 'forms',
    description: 'Binary or indeterminate toggle for boolean form values.',
    status: 'stable',
    tags: ['form', 'toggle', 'interactive'],
    props: [
      commonLabelProp,
      commonDescriptionProp,
      commonErrorProp,
      commonRequiredProp,
      commonDisabledProp,
      commonClassNameProp,
      {
        name: 'checked',
        type: 'boolean',
        category: 'behavior',
        editingSurface: 'advanced-edit',
        description: 'Controlled checked state.',
        defaultValue: 'false',
      },
      {
        name: 'defaultChecked',
        type: 'boolean',
        category: 'behavior',
        editingSurface: 'advanced-edit',
        description: 'Uncontrolled initial checked state.',
        defaultValue: 'false',
      },
      {
        name: 'indeterminate',
        type: 'boolean',
        category: 'behavior',
        editingSurface: 'advanced-edit',
        description: 'Indeterminate/partial selection state.',
        defaultValue: 'false',
      },
      {
        name: 'onChange',
        type: '(checked: boolean) => void',
        category: 'behavior',
        editingSurface: 'hidden',
        semantics: 'computed',
        description: 'Change handler.',
      },
    ],
    slots: [],
    events: ['onChange'],
    states: ['default', 'checked', 'indeterminate', 'focus', 'disabled'],
    a11y: {
      role: 'checkbox',
      ariaRequired: ['aria-checked', 'aria-label or associated <label>'],
      keyboard: ['Tab to focus', 'Space to toggle'],
      focusBehavior: 'Focusable via Tab. Space toggles state.',
      screenReaderNotes: [
        'Label must describe what is being toggled.',
        'Indeterminate state must be set via aria-checked="mixed".',
        'Group of checkboxes should be wrapped in <fieldset> with <legend>.',
      ],
      invalidCombinations: [
        'no label and no aria-label',
        'indeterminate + checked simultaneously',
      ],
    },
    responsiveBehavior: ['min touch target 44×44px'],
    styleHooks: [
      'checkbox.bg',
      'checkbox.border',
      'checkbox.check.color',
      'checkbox.focus.ring',
    ],
    builder: {
      editingSurface: 'prop-driven',
      allowChildren: false,
      insertionRules: interactiveRule,
    },
    recipes: [
      {
        id: 'form-checkbox',
        label: 'Form Checkbox',
        description: 'Labelled checkbox inside a form.',
        requiredProps: ['label'],
        recommendedDefaults: {},
        doExample: '<Checkbox label="I agree to the terms" required />',
        dontExample: '<Checkbox />',
      },
    ],
    antiPatterns: [
      {
        id: 'checkbox-no-label',
        description: 'Checkbox without a visible label.',
        reason: 'Purpose is opaque to screen reader users.',
        fix: 'Always provide label prop.',
      },
    ],
    export: { react: 'supported', next: 'supported' },
    compatibility: baseCompatibility,
  },

  // ── RadioButton ──────────────────────────────────────────────────────────
  {
    id: 'radio-button',
    slug: 'radio-button',
    displayName: 'RadioButton',
    package: '@ui-construction-library/core',
    version: '0.1.0',
    category: 'forms',
    description: 'Single option within an exclusive-choice radio group.',
    status: 'stable',
    tags: ['form', 'radio', 'interactive'],
    props: [
      commonLabelProp,
      commonDescriptionProp,
      commonRequiredProp,
      commonDisabledProp,
      commonClassNameProp,
      {
        name: 'value',
        type: 'string',
        category: 'content',
        editingSurface: 'content-edit',
        required: true,
        description: 'Value submitted with the form when selected.',
      },
      {
        name: 'checked',
        type: 'boolean',
        category: 'behavior',
        editingSurface: 'advanced-edit',
        description: 'Controlled checked state.',
      },
      {
        name: 'defaultChecked',
        type: 'boolean',
        category: 'behavior',
        editingSurface: 'advanced-edit',
        description: 'Uncontrolled initial checked state.',
        defaultValue: 'false',
      },
      {
        name: 'name',
        type: 'string',
        category: 'behavior',
        editingSurface: 'advanced-edit',
        description: 'Radio group name binding for native form behaviour.',
      },
      {
        name: 'onChange',
        type: '(value: string) => void',
        category: 'behavior',
        editingSurface: 'hidden',
        semantics: 'computed',
        description: 'Change handler.',
      },
    ],
    slots: [],
    events: ['onChange'],
    states: ['default', 'checked', 'focus', 'disabled'],
    a11y: {
      role: 'radio',
      ariaRequired: ['aria-checked', 'name attribute for grouping'],
      keyboard: [
        'Tab to enter group',
        'Arrow keys to move between options',
        'Space to select',
      ],
      focusBehavior:
        'Tab moves into the group; arrow keys navigate within the group (roving tabindex pattern).',
      screenReaderNotes: [
        'RadioButtons must be grouped inside a <fieldset> with <legend> describing the group.',
        'Each option must have a label.',
      ],
      invalidCombinations: [
        'RadioButton without a parent group / fieldset',
        'no label',
      ],
    },
    responsiveBehavior: ['min touch target 44×44px'],
    styleHooks: [
      'radio.bg',
      'radio.border',
      'radio.dot.color',
      'radio.focus.ring',
    ],
    builder: {
      editingSurface: 'prop-driven',
      allowChildren: false,
      insertionRules: interactiveRule,
    },
    recipes: [
      {
        id: 'radio-group',
        label: 'Radio Group',
        description: 'Group of RadioButton inside a fieldset with legend.',
        requiredProps: ['value', 'label'],
        recommendedDefaults: {},
      },
    ],
    antiPatterns: [
      {
        id: 'isolated-radio',
        description: 'RadioButton used outside of a named group.',
        reason:
          'Arrow-key navigation and form submission are broken without name grouping.',
        fix: 'Always place RadioButtons in a group with matching name or a RadioGroup wrapper.',
      },
    ],
    export: { react: 'supported', next: 'supported' },
    compatibility: baseCompatibility,
  },

  // ── Card ─────────────────────────────────────────────────────────────────
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

  // ── Alert ────────────────────────────────────────────────────────────────
  {
    id: 'alert',
    slug: 'alert',
    displayName: 'Alert',
    package: '@ui-construction-library/core',
    version: '0.1.0',
    category: 'feedback',
    description:
      'Inline contextual message with optional title, icon, and dismissal.',
    status: 'stable',
    tags: ['feedback', 'message', 'notification'],
    props: [
      commonToneProp,
      commonVariantProp,
      commonClassNameProp,
      commonChildrenProp,
      {
        name: 'title',
        type: 'string',
        category: 'content',
        editingSurface: 'content-edit',
        description: 'Optional bold title above the message body.',
      },
      {
        name: 'icon',
        type: 'ReactNode',
        category: 'content',
        editingSurface: 'content-edit',
        description: 'Leading icon; defaults to tone-appropriate icon.',
      },
      {
        name: 'dismissible',
        type: 'boolean',
        category: 'behavior',
        editingSurface: 'advanced-edit',
        description: 'Shows a dismiss button.',
        defaultValue: 'false',
      },
      {
        name: 'onDismiss',
        type: '(event: React.MouseEvent) => void',
        category: 'behavior',
        editingSurface: 'hidden',
        semantics: 'computed',
        description: 'Dismiss handler; required when dismissible=true.',
      },
    ],
    slots: ['default', 'action'],
    events: ['onDismiss'],
    states: ['default', 'dismissed'],
    a11y: {
      role: 'alert',
      ariaRequired: [],
      keyboard: [
        'Tab to dismiss button when dismissible=true',
        'Enter/Space to dismiss',
      ],
      focusBehavior:
        'Dynamically injected alerts use role="alert" (live region). Persistent alerts are static.',
      screenReaderNotes: [
        'Dynamically inserted alerts are announced automatically via role="alert".',
        'Avoid injecting multiple alerts simultaneously as live regions may overlap.',
        'Dismiss button requires aria-label="Dismiss alert" or equivalent.',
      ],
      invalidCombinations: ['dismissible=true without onDismiss handler'],
    },
    responsiveBehavior: [
      'full width',
      'stacks vertically with adjacent alerts',
    ],
    styleHooks: ['alert.bg', 'alert.color', 'alert.border', 'alert.icon.color'],
    builder: {
      editingSurface: 'prop-driven',
      allowChildren: true,
    },
    recipes: [
      {
        id: 'alert-banner',
        label: 'Alert Banner',
        description:
          'Full-width inline alert for form-level or page-level feedback.',
        requiredProps: ['children'],
        recommendedDefaults: { tone: 'error', variant: 'soft' },
        a11yCaveats: [
          'Use role="alert" for dynamically rendered alerts so screen readers announce them.',
        ],
      },
    ],
    antiPatterns: [
      {
        id: 'alert-as-toast',
        description: 'Using Alert as an auto-dismissing floating notification.',
        reason:
          'Alert is an inline component; use a Toast/Notification system for floating messages.',
        fix: 'Use a dedicated Toast component with aria-live="polite".',
      },
    ],
    export: { react: 'supported', next: 'supported' },
    compatibility: baseCompatibility,
  },

  // ── Tooltip ──────────────────────────────────────────────────────────────
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

  // ── Missing core components added for registry completeness ───────────
  {
    id: 'code',
    slug: 'code',
    displayName: 'Code',
    package: '@ui-construction-library/core',
    version: '0.1.0',
    category: 'typography',
    description: 'Inline code styling primitive.',
    status: 'stable',
    tags: ['code', 'inline'],
    props: [commonClassNameProp, commonChildrenProp],
    slots: ['default'],
    events: [],
    states: ['default'],
    a11y: {
      keyboard: [],
      focusBehavior: 'Non-interactive; not focusable.',
      screenReaderNotes: ['Used for inline code snippets.'],
    },
    responsiveBehavior: ['inline'],
    styleHooks: ['code.bg', 'code.color'],
    builder: { editingSurface: 'inline-editable', allowChildren: true },
    recipes: [],
    antiPatterns: [],
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
  {
    id: 'progress',
    slug: 'progress',
    displayName: 'Progress',
    package: '@ui-construction-library/core',
    version: '0.1.0',
    category: 'feedback',
    description: 'Progress indicator for bounded tasks.',
    status: 'stable',
    tags: ['status', 'feedback'],
    props: [commonValueProp, commonLabelProp, commonClassNameProp],
    slots: ['bar'],
    events: [],
    states: ['default'],
    a11y: {
      role: 'progressbar',
      keyboard: [],
      focusBehavior: 'Non-interactive; not focusable.',
      screenReaderNotes: ['Expose numeric progress via aria-valuenow.'],
    },
    responsiveBehavior: ['fluid width'],
    styleHooks: ['progress.bg', 'progress.bar'],
    builder: { editingSurface: 'prop-driven', allowChildren: false },
    recipes: [],
    antiPatterns: [],
    export: { react: 'supported', next: 'supported' },
    compatibility: baseCompatibility,
  },
  {
    id: 'switch',
    slug: 'switch',
    displayName: 'Switch',
    package: '@ui-construction-library/core',
    version: '0.1.0',
    category: 'forms',
    description: 'Binary toggle control.',
    status: 'stable',
    tags: ['form', 'toggle'],
    props: [commonLabelProp, commonDescriptionProp, commonDisabledProp],
    slots: ['thumb'],
    events: ['onCheckedChange'],
    states: ['unchecked', 'checked', 'disabled'],
    a11y: {
      role: 'switch',
      keyboard: ['Space', 'Enter'],
      focusBehavior: 'Focusable via Tab.',
      screenReaderNotes: ['Label should describe the setting being toggled.'],
    },
    responsiveBehavior: ['touch friendly'],
    styleHooks: ['switch.track', 'switch.thumb'],
    builder: { editingSurface: 'prop-driven', allowChildren: false },
    recipes: [],
    antiPatterns: [],
    export: { react: 'supported', next: 'supported' },
    compatibility: baseCompatibility,
  },
  {
    id: 'tag',
    slug: 'tag',
    displayName: 'Tag',
    package: '@ui-construction-library/core',
    version: '0.1.0',
    category: 'feedback',
    description: 'Inline tag with optional removal action.',
    status: 'stable',
    tags: ['label', 'chip'],
    props: [commonChildrenProp, commonIconProp, commonClassNameProp],
    slots: ['default', 'icon'],
    events: ['onRemove'],
    states: ['default', 'removable'],
    a11y: {
      keyboard: ['Tab', 'Enter', 'Space'],
      focusBehavior: 'Remove button receives focus when present.',
      screenReaderNotes: ['Removal action must have a clear accessible label.'],
    },
    responsiveBehavior: ['inline'],
    styleHooks: ['tag.bg', 'tag.color'],
    builder: { editingSurface: 'prop-driven', allowChildren: true },
    recipes: [],
    antiPatterns: [],
    export: { react: 'supported', next: 'supported' },
    compatibility: baseCompatibility,
  },
  {
    id: 'breadcrumb',
    slug: 'breadcrumb',
    displayName: 'Breadcrumb',
    package: '@ui-construction-library/core',
    version: '0.1.0',
    category: 'navigation',
    description: 'Navigation trail for hierarchical pages.',
    status: 'stable',
    tags: ['navigation', 'trail'],
    props: [commonChildrenProp, commonClassNameProp],
    slots: ['default'],
    events: [],
    states: ['default'],
    a11y: {
      role: 'navigation',
      keyboard: ['Tab'],
      focusBehavior: 'Links and buttons within the trail are focusable.',
      screenReaderNotes: [
        'Wrap in a nav landmark with aria-label="Breadcrumb".',
      ],
    },
    responsiveBehavior: ['wrap'],
    styleHooks: ['breadcrumb.color'],
    builder: { editingSurface: 'layout-container', allowChildren: true },
    recipes: [],
    antiPatterns: [],
    export: { react: 'supported', next: 'supported' },
    compatibility: baseCompatibility,
  },
  {
    id: 'color-picker',
    slug: 'color-picker',
    displayName: 'ColorPicker',
    package: '@ui-construction-library/core',
    version: '0.1.0',
    category: 'forms',
    description: 'Color input with hex and preview feedback.',
    status: 'stable',
    tags: ['color', 'input'],
    props: [commonValueProp, commonOnChangeProp, commonClassNameProp],
    slots: ['preview'],
    events: ['onChange', 'onValueChange'],
    states: ['default'],
    a11y: {
      role: 'group',
      keyboard: ['Tab', 'Type', 'Arrow keys in native color input'],
      focusBehavior: 'Native color and text inputs are focusable.',
      screenReaderNotes: [
        'Provide context if color value has business meaning.',
      ],
    },
    responsiveBehavior: ['stack'],
    styleHooks: ['color-picker.border'],
    builder: { editingSurface: 'prop-driven', allowChildren: false },
    recipes: [],
    antiPatterns: [],
    export: { react: 'supported', next: 'supported' },
    compatibility: baseCompatibility,
  },
  {
    id: 'combo-box',
    slug: 'combo-box',
    displayName: 'ComboBox',
    package: '@ui-construction-library/core',
    version: '0.1.0',
    category: 'forms',
    description: 'Searchable single-select listbox.',
    status: 'stable',
    tags: ['select', 'search'],
    props: [commonValueProp, commonOnChangeProp, commonClassNameProp],
    slots: ['input', 'listbox'],
    events: ['onChange', 'onValueChange'],
    states: ['closed', 'open', 'filtering'],
    a11y: {
      role: 'combobox',
      keyboard: ['ArrowDown', 'ArrowUp', 'Enter', 'Escape'],
      focusBehavior: 'Input receives focus and manages listbox selection.',
      screenReaderNotes: ['Link input to listbox with aria-controls.'],
    },
    responsiveBehavior: ['fullWidth optional'],
    styleHooks: ['combo-box.border'],
    builder: { editingSurface: 'prop-driven', allowChildren: false },
    recipes: [],
    antiPatterns: [],
    export: { react: 'supported', next: 'supported' },
    compatibility: baseCompatibility,
  },
  {
    id: 'file-upload',
    slug: 'file-upload',
    displayName: 'FileUpload',
    package: '@ui-construction-library/core',
    version: '0.1.0',
    category: 'forms',
    description: 'Drag-and-drop file upload zone.',
    status: 'stable',
    tags: ['upload', 'files'],
    props: [commonClassNameProp],
    slots: ['dropzone'],
    events: ['onChange', 'onFilesChange'],
    states: ['empty', 'over', 'populated'],
    a11y: {
      role: 'group',
      keyboard: ['Tab', 'Space', 'Enter'],
      focusBehavior: 'Native file input remains focusable.',
      screenReaderNotes: ['Describe accepted file types and size limits.'],
    },
    responsiveBehavior: ['stack'],
    styleHooks: ['file-upload.border'],
    builder: { editingSurface: 'layout-container', allowChildren: true },
    recipes: [],
    antiPatterns: [],
    export: { react: 'supported', next: 'supported' },
    compatibility: baseCompatibility,
  },
  {
    id: 'otp-input',
    slug: 'otp-input',
    displayName: 'OTPInput',
    package: '@ui-construction-library/core',
    version: '0.1.0',
    category: 'forms',
    description: 'Multi-slot one-time password input.',
    status: 'stable',
    tags: ['otp', 'verification'],
    props: [commonValueProp, commonOnChangeProp, commonClassNameProp],
    slots: ['slot'],
    events: ['onChange', 'onValueChange'],
    states: ['default'],
    a11y: {
      role: 'group',
      keyboard: ['Tab', 'Backspace', 'Digits'],
      focusBehavior: 'Sequential slot focus.',
      screenReaderNotes: ['Treat each slot as part of one verification code.'],
    },
    responsiveBehavior: ['inline wrap'],
    styleHooks: ['otp-input.border'],
    builder: { editingSurface: 'prop-driven', allowChildren: false },
    recipes: [],
    antiPatterns: [],
    export: { react: 'supported', next: 'supported' },
    compatibility: baseCompatibility,
  },
  {
    id: 'command-palette',
    slug: 'command-palette',
    displayName: 'CommandPalette',
    package: '@ui-construction-library/core',
    version: '0.1.0',
    category: 'navigation',
    description: 'Keyboard-driven command palette overlay.',
    status: 'stable',
    tags: ['overlay', 'commands'],
    props: [commonClassNameProp],
    slots: ['input', 'listbox'],
    events: ['onOpenChange'],
    states: ['closed', 'open', 'filtering'],
    a11y: {
      role: 'dialog',
      keyboard: ['ArrowDown', 'ArrowUp', 'Enter', 'Escape'],
      focusBehavior: 'Focus moves to search input when opened.',
      screenReaderNotes: [
        'Use dialog semantics and expose results as options.',
      ],
    },
    responsiveBehavior: ['overlay'],
    styleHooks: ['command-palette.bg'],
    builder: { editingSurface: 'overlay', allowChildren: true },
    recipes: [],
    antiPatterns: [],
    export: { react: 'supported', next: 'supported' },
    compatibility: baseCompatibility,
  },
  {
    id: 'drawer',
    slug: 'drawer',
    displayName: 'Drawer',
    package: '@ui-construction-library/core',
    version: '0.1.0',
    category: 'navigation',
    description: 'Side sheet panel overlay.',
    status: 'stable',
    tags: ['overlay', 'panel'],
    props: [commonClassNameProp],
    slots: ['default'],
    events: ['onOpenChange'],
    states: ['closed', 'open'],
    a11y: {
      role: 'dialog',
      keyboard: ['Escape'],
      focusBehavior: 'Focus trapped while open.',
      screenReaderNotes: [
        'Provide title and description when content is not obvious.',
      ],
    },
    responsiveBehavior: ['overlay'],
    styleHooks: ['drawer.bg'],
    builder: { editingSurface: 'overlay', allowChildren: true },
    recipes: [],
    antiPatterns: [],
    export: { react: 'supported', next: 'supported' },
    compatibility: baseCompatibility,
  },
  {
    id: 'calendar',
    slug: 'calendar',
    displayName: 'Calendar',
    package: '@ui-construction-library/core',
    version: '0.1.0',
    category: 'data-display',
    description: 'Month grid with event markers.',
    status: 'stable',
    tags: ['date', 'schedule'],
    props: [commonClassNameProp],
    slots: ['grid'],
    events: [],
    states: ['default'],
    a11y: {
      role: 'grid',
      keyboard: ['Arrow keys', 'PageUp', 'PageDown'],
      focusBehavior: 'Month controls are keyboard accessible.',
      screenReaderNotes: ['Month and events should be announced clearly.'],
    },
    responsiveBehavior: ['fluid'],
    styleHooks: ['calendar.cell'],
    builder: { editingSurface: 'layout-container', allowChildren: false },
    recipes: [],
    antiPatterns: [],
    export: { react: 'supported', next: 'supported' },
    compatibility: baseCompatibility,
  },
  {
    id: 'empty-state',
    slug: 'empty-state',
    displayName: 'EmptyState',
    package: '@ui-construction-library/core',
    version: '0.1.0',
    category: 'feedback',
    description: 'Placeholder shown when content is absent.',
    status: 'stable',
    tags: ['empty', 'placeholder'],
    props: [commonChildrenProp, commonClassNameProp],
    slots: ['icon', 'action'],
    events: [],
    states: ['default'],
    a11y: {
      role: 'status',
      keyboard: [],
      focusBehavior: 'Non-interactive; not focusable.',
      screenReaderNotes: ['Use clear title and action for recovery.'],
    },
    responsiveBehavior: ['stack'],
    styleHooks: ['empty-state.icon'],
    builder: { editingSurface: 'section-block', allowChildren: true },
    recipes: [],
    antiPatterns: [],
    export: { react: 'supported', next: 'supported' },
    compatibility: baseCompatibility,
  },
];
