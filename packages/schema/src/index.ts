import componentSchema from './schemas/component.schema.json';
import layoutSchema from './schemas/layout.schema.json';
import projectSchema from './schemas/project.schema.json';

export const schemas = {
  component: componentSchema,
  layout: layoutSchema,
  project: projectSchema,
} as const;

export type SchemaName = keyof typeof schemas;

export function hasRequiredKeys(
  input: Record<string, unknown>,
  requiredKeys: readonly string[]
): boolean {
  return requiredKeys.every((key) => Object.hasOwn(input, key));
}

// Extended required keys per schema type (Phase 2 additions)
const COMPONENT_REQUIRED_KEYS = [
  'id',
  'slug',
  'displayName',
  'package',
  'version',
  'category',
  'props',
  'slots',
  'events',
  'states',
  'a11y',
  'responsiveBehavior',
  'styleHooks',
  'builder',
  'recipes',
  'antiPatterns',
  'export',
  'compatibility',
] as const;

const LAYOUT_REQUIRED_KEYS = [
  'id',
  'componentId',
  'props',
  'children',
] as const;

const PROJECT_REQUIRED_KEYS = ['id', 'name', 'pages'] as const;

// Minimal check (backward-compatible)
export function validateRequiredShape(
  name: SchemaName,
  input: unknown
): boolean {
  if (!input || typeof input !== 'object') return false;
  const record = input as Record<string, unknown>;

  if (name === 'component')
    return hasRequiredKeys(record, [
      'id',
      'slug',
      'displayName',
      'package',
      'version',
      'category',
      'props',
    ]);
  if (name === 'layout') return hasRequiredKeys(record, LAYOUT_REQUIRED_KEYS);
  return hasRequiredKeys(record, PROJECT_REQUIRED_KEYS);
}

// Strict check — validates against the full Phase 2 contract
export function validateFullShape(
  name: SchemaName,
  input: unknown
): { valid: boolean; missing: string[] } {
  if (!input || typeof input !== 'object')
    return { valid: false, missing: ['<input is not an object>'] };
  const record = input as Record<string, unknown>;

  const required =
    name === 'component'
      ? COMPONENT_REQUIRED_KEYS
      : name === 'layout'
        ? LAYOUT_REQUIRED_KEYS
        : PROJECT_REQUIRED_KEYS;

  const missing = (required as readonly string[]).filter(
    (key) => !Object.hasOwn(record, key)
  );
  return { valid: missing.length === 0, missing };
}

// Builder editingSurface validator
const VALID_EDITING_SURFACES = [
  'inline-editable',
  'prop-driven',
  'data-bound',
  'layout-container',
  'section-block',
  'overlay',
  'advanced',
] as const;

export type EditingSurface = (typeof VALID_EDITING_SURFACES)[number];

export function isValidEditingSurface(value: unknown): value is EditingSurface {
  return (
    typeof value === 'string' &&
    (VALID_EDITING_SURFACES as readonly string[]).includes(value)
  );
}
