import { describe, expect, it } from 'vitest';
import * as exportCore from '../index';

const expectedExports = [
  'analyzeExportProject',
  'appendDoctorArtifacts',
  'createExportAcceptanceChecklist',
  'createExportRequestFromBuilderProject',
  'enrichExportProject',
  'normalizeExportProject',
  'renderExportProject',
  'renderHtmlStatic',
  'renderNextjsAppRouter',
  'nextjsAppRouterTarget',
  'renderReactSinglePage',
  'createExportPublicApiSnapshot',
  'createExportTargetPlugin',
  'createStaticRenderResult',
  'vue3Target',
  'createBuilderVisualSnapshot',
  'createExportVisualFidelityReport',
  'renderWebComponentsStatic',
];

describe('export-core', () => {
  it('should be importable without errors', () => {
    expect(exportCore).toBeDefined();
    expect(typeof exportCore).toBe('object');
  });

  it.each(expectedExports)('should export %s as a function', (name) => {
    expect(exportCore).toHaveProperty(name);
    expect(typeof (exportCore as Record<string, unknown>)[name]).toBe(
      'function'
    );
  });

  it('should have exactly the expected public exports', () => {
    const actualExports = Object.keys(exportCore).sort();
    expect(actualExports).toEqual([...expectedExports].sort());
  });
});
