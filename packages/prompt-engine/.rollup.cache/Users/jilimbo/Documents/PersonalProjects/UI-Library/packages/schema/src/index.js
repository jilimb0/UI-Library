import componentSchema from './schemas/component.schema.json';
import layoutSchema from './schemas/layout.schema.json';
import projectSchema from './schemas/project.schema.json';
export const schemas = {
  component: componentSchema,
  layout: layoutSchema,
  project: projectSchema,
};
export function hasRequiredKeys(input, requiredKeys) {
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
];
const LAYOUT_REQUIRED_KEYS = ['id', 'componentId', 'props', 'children'];
const PROJECT_REQUIRED_KEYS = ['id', 'name', 'pages'];
// Minimal check (backward-compatible)
export function validateRequiredShape(name, input) {
  if (!input || typeof input !== 'object') return false;
  const record = input;
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
export function validateFullShape(name, input) {
  if (!input || typeof input !== 'object')
    return { valid: false, missing: ['<input is not an object>'] };
  const record = input;
  const required =
    name === 'component'
      ? COMPONENT_REQUIRED_KEYS
      : name === 'layout'
        ? LAYOUT_REQUIRED_KEYS
        : PROJECT_REQUIRED_KEYS;
  const missing = required.filter((key) => !Object.hasOwn(record, key));
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
];
export function isValidEditingSurface(value) {
  return typeof value === 'string' && VALID_EDITING_SURFACES.includes(value);
}
