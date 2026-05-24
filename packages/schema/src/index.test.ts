import { describe, expect, it } from 'vitest';
import {
  isValidEditingSurface,
  schemas,
  validateFullShape,
  validateRequiredShape,
} from './index';

describe('schema package — exports', () => {
  it('exports baseline schemas with correct titles', () => {
    expect(schemas.component.title).toBe('ComponentMetadata');
    expect(schemas.layout.title).toBe('LayoutNode');
    expect(schemas.project.title).toBe('ProjectConfig');
  });
});

describe('schema package — validateRequiredShape (minimal, backward-compatible)', () => {
  it('validates minimal component shape', () => {
    expect(
      validateRequiredShape('component', {
        id: 'button',
        slug: 'button',
        displayName: 'Button',
        package: '@ui-construction-library/core',
        version: '0.1.0',
        category: 'actions',
        props: [],
      })
    ).toBe(true);
  });

  it('rejects component missing required keys', () => {
    expect(validateRequiredShape('component', { id: 'button' })).toBe(false);
  });

  it('validates layout shape', () => {
    expect(
      validateRequiredShape('layout', {
        id: 'n1',
        componentId: 'button',
        props: {},
        children: [],
      })
    ).toBe(true);
    expect(validateRequiredShape('layout', { id: 'n1' })).toBe(false);
  });

  it('validates project shape', () => {
    expect(
      validateRequiredShape('project', { id: 'p1', name: 'My App', pages: [] })
    ).toBe(true);
    expect(validateRequiredShape('project', { id: 'p1' })).toBe(false);
  });

  it('rejects non-object input', () => {
    expect(validateRequiredShape('component', null)).toBe(false);
    expect(validateRequiredShape('component', 'string')).toBe(false);
  });
});

describe('schema package — validateFullShape (Phase 2 extended)', () => {
  const fullComponent = {
    id: 'button',
    slug: 'button',
    displayName: 'Button',
    package: '@ui-construction-library/core',
    version: '0.1.0',
    category: 'actions',
    props: [],
    slots: [],
    events: [],
    states: [],
    a11y: {},
    responsiveBehavior: [],
    styleHooks: [],
    builder: {},
    recipes: [],
    antiPatterns: [],
    export: {},
    compatibility: {},
  };

  it('passes for fully-shaped component', () => {
    const result = validateFullShape('component', fullComponent);
    expect(result.valid).toBe(true);
    expect(result.missing).toHaveLength(0);
  });

  it('reports missing keys for incomplete component', () => {
    const partial = {
      id: 'button',
      slug: 'button',
      displayName: 'Button',
      package: 'x',
      version: '0.1.0',
      category: 'actions',
      props: [],
    };
    const result = validateFullShape('component', partial);
    expect(result.valid).toBe(false);
    expect(result.missing).toContain('slots');
    expect(result.missing).toContain('a11y');
    expect(result.missing).toContain('builder');
    expect(result.missing).toContain('recipes');
    expect(result.missing).toContain('antiPatterns');
  });

  it('rejects non-object', () => {
    const result = validateFullShape('component', null);
    expect(result.valid).toBe(false);
  });
});

describe('schema package — isValidEditingSurface', () => {
  it('accepts all valid surfaces', () => {
    const surfaces = [
      'inline-editable',
      'prop-driven',
      'data-bound',
      'layout-container',
      'section-block',
      'overlay',
      'advanced',
    ];
    for (const s of surfaces) {
      expect(isValidEditingSurface(s), `should accept "${s}"`).toBe(true);
    }
  });

  it('rejects invalid surface values', () => {
    expect(isValidEditingSurface('editable')).toBe(false);
    expect(isValidEditingSurface('container')).toBe(false);
    expect(isValidEditingSurface('')).toBe(false);
    expect(isValidEditingSurface(42)).toBe(false);
    expect(isValidEditingSurface(null)).toBe(false);
  });
});
