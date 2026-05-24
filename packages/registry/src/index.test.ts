import { describe, expect, it } from 'vitest';
import {
  foundationalComponents,
  getComponentById,
  getComponentsByEditingSurface,
  validateRegistryComponent,
} from './index';

describe('registry package', () => {
  it('returns a component by id', () => {
    expect(getComponentById('button')?.displayName).toBe('Button');
  });

  it('filters components by editing surface', () => {
    expect(getComponentsByEditingSurface('prop-driven').length).toBeGreaterThan(
      0
    );
  });

  it('validates all foundational components', () => {
    for (const component of foundationalComponents) {
      expect(validateRegistryComponent(component)).toEqual({ valid: true });
    }
  });

  it('requires every prop to declare category and prop-level editing surface', () => {
    for (const component of foundationalComponents) {
      for (const prop of component.props) {
        expect(prop.category).toBeTruthy();
        expect(prop.editingSurface).toBeTruthy();
      }
    }
  });

  it('rejects invalid prop categorization metadata', () => {
    const candidate = structuredClone(foundationalComponents[0]);
    candidate.props[0] = {
      ...candidate.props[0],
      category: 'invalid-category' as never,
    };

    expect(validateRegistryComponent(candidate)).toEqual({
      valid: false,
      errors: expect.arrayContaining([
        expect.stringContaining('invalid category'),
      ]),
    });
  });

  it('rejects invalid prop editing surface metadata', () => {
    const candidate = structuredClone(foundationalComponents[0]);
    candidate.props[0] = {
      ...candidate.props[0],
      editingSurface: 'invalid-surface' as never,
    };

    expect(validateRegistryComponent(candidate)).toEqual({
      valid: false,
      errors: expect.arrayContaining([
        expect.stringContaining('invalid editingSurface'),
      ]),
    });
  });
});
