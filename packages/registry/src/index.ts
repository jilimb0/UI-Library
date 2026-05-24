import {
  type A11yContract,
  type EditingSurface,
  foundationalComponents,
  type InsertionRules,
  type PropCategory,
  type PropEditingSemantics,
  type PropEditingSurface,
  type RegistryComponent,
  type RegistryProp,
} from './components/foundations';

export {
  type A11yContract,
  type EditingSurface,
  foundationalComponents,
  type InsertionRules,
  type PropCategory,
  type PropEditingSemantics,
  type PropEditingSurface,
  type RegistryComponent,
  type RegistryProp,
};

export function getComponentById(id: string): RegistryComponent | undefined {
  return foundationalComponents.find((c) => c.id === id);
}

export function getComponentsByCategory(category: string): RegistryComponent[] {
  return foundationalComponents.filter((c) => c.category === category);
}

export function getComponentsByEditingSurface(
  surface: EditingSurface
): RegistryComponent[] {
  return foundationalComponents.filter(
    (c) => c.builder.editingSurface === surface
  );
}

export function getComponentsByTag(tag: string): RegistryComponent[] {
  return foundationalComponents.filter((c) => c.tags.includes(tag));
}

export function getAntiPatternById(
  componentId: string,
  antiPatternId: string
): RegistryComponent['antiPatterns'][number] | undefined {
  return getComponentById(componentId)?.antiPatterns.find(
    (ap) => ap.id === antiPatternId
  );
}

export function getRecipeById(
  componentId: string,
  recipeId: string
): RegistryComponent['recipes'][number] | undefined {
  return getComponentById(componentId)?.recipes.find((r) => r.id === recipeId);
}

// ── validation ─────────────────────────────────────────────────────

const VALID_EDITING_SURFACES: EditingSurface[] = [
  'inline-editable',
  'prop-driven',
  'data-bound',
  'layout-container',
  'section-block',
  'overlay',
  'advanced',
];

const VALID_STATUSES = [
  'stable',
  'beta',
  'experimental',
  'deprecated',
] as const;
const VALID_PROP_CATEGORIES: PropCategory[] = [
  'content',
  'layout',
  'style',
  'behavior',
  'accessibility',
  'data',
];
const VALID_PROP_EDITING_SURFACES: PropEditingSurface[] = [
  'quick-edit',
  'content-edit',
  'layout-edit',
  'advanced-edit',
  'hidden',
];
const VALID_PROP_SEMANTICS: PropEditingSemantics[] = [
  'editable',
  'computed',
  'locked',
];

export type ValidationResult =
  | { valid: true }
  | { valid: false; errors: string[] };

export function validateRegistryComponent(
  item: RegistryComponent
): ValidationResult {
  const errors: string[] = [];

  // identity
  if (!item.id) errors.push('missing id');
  if (!item.slug) errors.push('missing slug');
  if (!item.displayName) errors.push('missing displayName');
  if (!item.package) errors.push('missing package');
  if (!item.version) errors.push('missing version');
  if (!item.category) errors.push('missing category');

  // status
  if (!VALID_STATUSES.includes(item.status)) {
    errors.push(`invalid status: ${item.status}`);
  }

  // arrays
  if (!Array.isArray(item.tags)) errors.push('tags must be an array');
  if (!Array.isArray(item.props)) errors.push('props must be an array');
  if (!Array.isArray(item.slots)) errors.push('slots must be an array');
  if (!Array.isArray(item.events)) errors.push('events must be an array');
  if (!Array.isArray(item.states)) errors.push('states must be an array');
  if (!Array.isArray(item.responsiveBehavior))
    errors.push('responsiveBehavior must be an array');
  if (!Array.isArray(item.styleHooks))
    errors.push('styleHooks must be an array');
  if (!Array.isArray(item.recipes)) errors.push('recipes must be an array');
  if (!Array.isArray(item.antiPatterns))
    errors.push('antiPatterns must be an array');

  // props shape (Phase 2.1)
  for (const prop of item.props) {
    if (!prop.name) errors.push(`prop missing name in ${item.id}`);
    if (!prop.type)
      errors.push(`prop "${prop.name}" missing type in ${item.id}`);
    if (!VALID_PROP_CATEGORIES.includes(prop.category)) {
      errors.push(`prop "${prop.name}" has invalid category in ${item.id}`);
    }
    if (!VALID_PROP_EDITING_SURFACES.includes(prop.editingSurface)) {
      errors.push(
        `prop "${prop.name}" has invalid editingSurface in ${item.id}`
      );
    }
    if (prop.semantics && !VALID_PROP_SEMANTICS.includes(prop.semantics)) {
      errors.push(`prop "${prop.name}" has invalid semantics in ${item.id}`);
    }
  }

  // a11y contract (Phase 2.3)
  if (!item.a11y || typeof item.a11y !== 'object') {
    errors.push('a11y must be an object');
  } else {
    if (!Array.isArray(item.a11y.keyboard))
      errors.push('a11y.keyboard must be an array');
    if (!Array.isArray(item.a11y.screenReaderNotes))
      errors.push('a11y.screenReaderNotes must be an array');
  }

  // builder (Phase 2.2)
  if (!item.builder || typeof item.builder !== 'object') {
    errors.push('builder must be an object');
  } else {
    if (!VALID_EDITING_SURFACES.includes(item.builder.editingSurface)) {
      errors.push(
        `invalid builder.editingSurface: ${item.builder.editingSurface}`
      );
    }
    if (typeof item.builder.allowChildren !== 'boolean') {
      errors.push('builder.allowChildren must be boolean');
    }
  }

  // recipes shape (Phase 2.4)
  for (const recipe of item.recipes) {
    if (!recipe.id) errors.push(`recipe missing id in ${item.id}`);
    if (!recipe.label)
      errors.push(`recipe "${recipe.id}" missing label in ${item.id}`);
    if (!recipe.description)
      errors.push(`recipe "${recipe.id}" missing description in ${item.id}`);
  }

  // antiPatterns shape (Phase 2.5)
  for (const ap of item.antiPatterns) {
    if (!ap.id) errors.push(`antiPattern missing id in ${item.id}`);
    if (!ap.description)
      errors.push(`antiPattern "${ap.id}" missing description in ${item.id}`);
    if (!ap.reason)
      errors.push(`antiPattern "${ap.id}" missing reason in ${item.id}`);
  }

  // export + compatibility
  if (!item.export || typeof item.export !== 'object')
    errors.push('export must be an object');
  if (!item.compatibility || typeof item.compatibility !== 'object')
    errors.push('compatibility must be an object');

  return errors.length === 0 ? { valid: true } : { valid: false, errors };
}

export function validateRegistryComponents(
  items: RegistryComponent[]
): boolean {
  return items.every((item) => validateRegistryComponent(item).valid);
}

export function validateRegistryComponentsStrict(
  items: RegistryComponent[]
): ValidationResult {
  const allErrors: string[] = [];
  for (const item of items) {
    const result = validateRegistryComponent(item);
    if (!result.valid) allErrors.push(...result.errors);
  }
  return allErrors.length === 0
    ? { valid: true }
    : { valid: false, errors: allErrors };
}
