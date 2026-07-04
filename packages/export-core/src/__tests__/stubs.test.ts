import { describe, expect, it } from 'vitest';
import {
  createBuilderVisualSnapshot,
  createExportPublicApiSnapshot,
  createExportTargetPlugin,
  createExportVisualFidelityReport,
  createStaticRenderResult,
} from '../index';

describe('createExportPublicApiSnapshot', () => {
  it('should return null', () => {
    const result = createExportPublicApiSnapshot();
    expect(result).toBeNull();
  });
});

describe('createExportTargetPlugin', () => {
  it('should return null', () => {
    const result = createExportTargetPlugin();
    expect(result).toBeNull();
  });
});

describe('createStaticRenderResult', () => {
  it('should return null', () => {
    const result = createStaticRenderResult();
    expect(result).toBeNull();
  });
});

describe('createBuilderVisualSnapshot', () => {
  it('should return null', () => {
    const result = createBuilderVisualSnapshot();
    expect(result).toBeNull();
  });
});

describe('createExportVisualFidelityReport', () => {
  it('should return null', () => {
    const result = createExportVisualFidelityReport();
    expect(result).toBeNull();
  });
});
