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

export const baseCompatibility: RegistryComponent['compatibility'] = {
  react: true,
  next: true,
  static: false,
  webComponents: false,
  vue: false,
  angular: false,
};

export const interactiveRule: InsertionRules = {
  blockedInsideInteractive: true,
};

// ─── standardized common props ─────────────────────────────────────────────

export const commonVariantProp: RegistryProp = {
  name: 'variant',
  type: 'string',
  category: 'style',
  editingSurface: 'quick-edit',
  description: 'Visual style variant of the component.',
  defaultValue: 'default',
};

export const commonSizeProp: RegistryProp = {
  name: 'size',
  type: 'string',
  category: 'layout',
  editingSurface: 'layout-edit',
  description: 'Size preset (sm | md | lg).',
  defaultValue: 'md',
};

export const commonToneProp: RegistryProp = {
  name: 'tone',
  type: 'string',
  category: 'style',
  editingSurface: 'quick-edit',
  description:
    'Semantic color tone (neutral | primary | success | warning | error).',
  defaultValue: 'neutral',
};

export const commonDisabledProp: RegistryProp = {
  name: 'disabled',
  type: 'boolean',
  category: 'behavior',
  editingSurface: 'advanced-edit',
  description: 'Disables the component and prevents interaction.',
  defaultValue: 'false',
};

export const commonLoadingProp: RegistryProp = {
  name: 'loading',
  type: 'boolean',
  category: 'behavior',
  editingSurface: 'advanced-edit',
  description: 'Shows a loading indicator and prevents interaction.',
  defaultValue: 'false',
};

export const commonFullWidthProp: RegistryProp = {
  name: 'fullWidth',
  type: 'boolean',
  category: 'layout',
  editingSurface: 'layout-edit',
  description: 'Makes the component span the full width of its container.',
  defaultValue: 'false',
};

export const commonAsProp: RegistryProp = {
  name: 'as',
  type: 'ElementType',
  category: 'accessibility',
  editingSurface: 'advanced-edit',
  semantics: 'locked',
  description: 'Polymorphic element type override.',
};

export const commonClassNameProp: RegistryProp = {
  name: 'className',
  type: 'string',
  category: 'style',
  editingSurface: 'hidden',
  semantics: 'locked',
  description: 'Additional CSS class names.',
};

export const commonChildrenProp: RegistryProp = {
  name: 'children',
  type: 'ReactNode',
  category: 'content',
  editingSurface: 'content-edit',
  description: 'Child content.',
};

export const commonIconProp: RegistryProp = {
  name: 'icon',
  type: 'ReactNode',
  category: 'content',
  editingSurface: 'content-edit',
  description: 'Leading icon element.',
};

export const commonLabelProp: RegistryProp = {
  name: 'label',
  type: 'string',
  category: 'content',
  editingSurface: 'content-edit',
  description:
    'Accessible label; visible or used as aria-label when no visible text is present.',
};

export const commonDescriptionProp: RegistryProp = {
  name: 'description',
  type: 'string',
  category: 'content',
  editingSurface: 'content-edit',
  description:
    'Supplementary description text rendered below the primary label.',
};

export const commonErrorProp: RegistryProp = {
  name: 'error',
  type: 'string',
  category: 'behavior',
  editingSurface: 'advanced-edit',
  description:
    'Inline error message. When set, the field enters an error state.',
};

export const commonRequiredProp: RegistryProp = {
  name: 'required',
  type: 'boolean',
  category: 'accessibility',
  editingSurface: 'advanced-edit',
  description: 'Marks the field as required in forms.',
  defaultValue: 'false',
};

export const commonValueProp: RegistryProp = {
  name: 'value',
  type: 'string',
  category: 'content',
  editingSurface: 'content-edit',
  description: 'Controlled value.',
};

export const commonDefaultValueProp: RegistryProp = {
  name: 'defaultValue',
  type: 'string',
  category: 'content',
  editingSurface: 'content-edit',
  description: 'Uncontrolled initial value.',
};

export const commonOnChangeProp: RegistryProp = {
  name: 'onChange',
  type: '(value: string) => void',
  category: 'behavior',
  editingSurface: 'hidden',
  semantics: 'computed',
  description: 'Change handler for controlled usage.',
};
