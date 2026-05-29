import { describe, expect, it } from 'vitest';
import {
  generatePromptDraft,
  getPromptGenerationSafetyRails,
  normalizePromptRequest,
  type PromptRequest,
  repairPromptDraftProject,
  summarizePromptRecipe,
  summarizePromptResponse,
  toBuilderCompatibleProject,
  validatePromptDraftProject,
} from './index';

const request: PromptRequest = {
  productType: 'Design System',
  targetAudience: 'product teams',
  sections: ['hero', 'features', 'cta'],
  styleTone: 'confident',
  density: 'balanced',
  domain: 'ui tooling',
  frameworkPreference: 'react',
  detailLevel: 'medium',
  generationMode: 'landing-page',
};

describe('prompt-engine deterministic baseline', () => {
  it('exposes explicit safety rails per generation mode', () => {
    expect(getPromptGenerationSafetyRails('landing-page')).toEqual([
      'single primary page',
      'foundation registry components only',
    ]);
  });

  it('generates a deterministic builder-compatible draft', () => {
    const first = generatePromptDraft(request);
    const second = generatePromptDraft(request);

    expect(first).toEqual(second);
    expect(first.chosenIntent).toBe('landing-page');
    expect(first.assembledSections).toEqual(['hero', 'features', 'cta']);
    expect(first.draft.pages).toHaveLength(1);
    expect(first.draft.pages[0]?.root.componentId).toBe('card');
    expect(first.explainability.usedComponents).toEqual([
      'card',
      'heading',
      'text',
    ]);
    expect(first.explainability.validationPassed).toBe(true);
  });

  it('falls back to a deterministic default section set when sections are omitted', () => {
    const result = generatePromptDraft({
      ...request,
      sections: [],
      generationMode: 'marketing-section',
    });

    expect(result.assembledSections).toEqual(['hero', 'features', 'cta']);
    expect(result.explainability.recipeId).toBe(
      'deterministic-marketing-section'
    );
  });

  it('validates the generated draft against builder-compatible required shapes', () => {
    const result = generatePromptDraft(request);
    expect(validatePromptDraftProject(result.draft)).toBe(true);
  });

  it('repairs invalid drafts with deterministic fallback values', () => {
    const repaired = repairPromptDraftProject({
      id: '',
      name: '',
      pages: [],
    });

    expect(repaired.repaired).toBe(true);
    expect(repaired.valid).toBe(true);
    expect(repaired.draft.id).toBe('prompt-generated-project');
    expect(repaired.draft.pages).toHaveLength(1);
    expect(repaired.diagnostics.length).toBeGreaterThan(0);
  });

  it('maps repaired drafts into a builder-compatible project shell', () => {
    const result = generatePromptDraft(request);
    const builderProject = toBuilderCompatibleProject(result.draft);

    expect(builderProject.publish.status).toBe('draft');
    expect(builderProject.publish.publishedAt).toBeNull();
    expect(builderProject.members).toEqual([]);
    expect(builderProject.pages).toHaveLength(1);
  });
});

test('generatePromptDraft exposes composition family and layout rhythm for dashboards', () => {
  const result = generatePromptDraft({
    productType: 'Analytics workspace',
    targetAudience: 'ops teams',
    sections: ['hero', 'metrics', 'activity'],
    styleTone: 'confident',
    density: 'compact',
    domain: 'operations',
    frameworkPreference: 'react',
    detailLevel: 'high',
    generationMode: 'dashboard',
  });

  expect(result.explainability.compositionFamily).toBe(
    'signal-first-dashboard'
  );
  expect(result.explainability.layoutRhythm).toBe('summary-detail');
  expect(result.draft.pages[0]?.root.children[0]?.props.layoutRhythm).toBe(
    'summary-detail'
  );
});

test('generatePromptDraft uses feature-grid family for feature-heavy landing pages', () => {
  const result = generatePromptDraft({
    productType: 'Pricing portal',
    targetAudience: 'finance teams',
    sections: ['hero', 'features', 'pricing', 'cta'],
    styleTone: 'structured',
    density: 'balanced',
    domain: 'billing',
    frameworkPreference: 'react',
    detailLevel: 'medium',
    generationMode: 'landing-page',
  });

  expect(result.explainability.compositionFamily).toBe('feature-grid');
  expect(result.draft.pages[0]?.root.children[1]?.props.layoutVariant).toBe(
    'feature'
  );
  expect(result.draft.pages[0]?.root.children[2]?.props.layoutVariant).toBe(
    'cta'
  );
});

test('generatePromptDraft adds semantic child scaffolds for metrics and pricing sections', () => {
  const result = generatePromptDraft({
    productType: 'Revenue control center',
    targetAudience: 'finance operators',
    sections: ['hero', 'metrics', 'pricing', 'cta'],
    styleTone: 'precise',
    density: 'balanced',
    domain: 'finops',
    frameworkPreference: 'react',
    detailLevel: 'high',
    generationMode: 'dashboard',
  });

  const metricsChildren =
    result.draft.pages[0]?.root.children[1]?.children ?? [];
  const pricingChildren =
    result.draft.pages[0]?.root.children[2]?.children ?? [];

  expect(metricsChildren.length).toBeGreaterThanOrEqual(3);
  expect(pricingChildren.length).toBeGreaterThanOrEqual(3);
  expect(String(metricsChildren[2]?.props.children)).toContain('KPI');
  expect(String(pricingChildren[2]?.props.children)).toContain(
    'Plan comparison'
  );
});

test('summarizePromptResponse exposes review-friendly structure metadata', () => {
  const result = generatePromptDraft({
    productType: 'Analytics workspace',
    targetAudience: 'ops teams',
    sections: ['hero', 'metrics', 'activity'],
    styleTone: 'confident',
    density: 'compact',
    domain: 'operations',
    frameworkPreference: 'react',
    detailLevel: 'high',
    generationMode: 'dashboard',
  });

  const summary = summarizePromptResponse(result);

  expect(summary.intent).toBe('dashboard');
  expect(summary.compositionFamily).toBe('signal-first-dashboard');
  expect(summary.layoutRhythm).toBe('summary-detail');
  expect(summary.sectionCount).toBe(3);
  expect(summary.sectionLabels).toEqual(['Hero', 'Metrics', 'Activity']);
  expect(summary.policyStatus).toBe(result.policy.status);
});

test('normalizePromptRequest produces a stable prompt signature', () => {
  const first = normalizePromptRequest({
    productType: 'Analytics workspace',
    targetAudience: 'ops teams',
    sections: ['cta', 'hero', 'metrics'],
    styleTone: 'confident',
    density: 'compact',
    domain: 'operations',
    frameworkPreference: 'react',
    detailLevel: 'high',
    generationMode: 'dashboard',
  });
  const second = normalizePromptRequest({
    productType: 'Analytics workspace',
    targetAudience: 'ops teams',
    sections: ['hero', 'metrics', 'cta'],
    styleTone: 'confident',
    density: 'compact',
    domain: 'operations',
    frameworkPreference: 'react',
    detailLevel: 'high',
    generationMode: 'dashboard',
  });

  expect(first.normalizedSections).toEqual(['cta', 'hero', 'metrics']);
  expect(first.promptSignature).toBe(second.promptSignature);
});

test('summarizePromptRecipe exposes the approved component family', () => {
  const summary = summarizePromptRecipe({
    productType: 'Analytics workspace',
    targetAudience: 'ops teams',
    sections: ['hero', 'metrics', 'activity'],
    styleTone: 'confident',
    density: 'compact',
    domain: 'operations',
    frameworkPreference: 'react',
    detailLevel: 'high',
    generationMode: 'dashboard',
  });

  expect(summary.componentFamily).toBe('approved-dashboard-primitives');
  expect(summary.compositionFamily).toBe('signal-first-dashboard');
  expect(summary.layoutRhythm).toBe('summary-detail');
  expect(summary.signature).toContain('analytics workspace');
});

test('generatePromptDraft supports settings-app generation mode', () => {
  const result = generatePromptDraft({
    productType: 'Account settings portal',
    targetAudience: 'end users',
    sections: ['hero', 'profile', 'notifications', 'security'],
    styleTone: 'structured',
    density: 'balanced',
    domain: 'settings',
    frameworkPreference: 'react',
    detailLevel: 'medium',
    generationMode: 'settings-app',
  });

  expect(result.explainability.compositionFamily).toBe('form-driven-settings');
  expect(result.explainability.layoutRhythm).toBe('balanced-stack');
  const profileSection =
    result.draft.pages[0]?.root.children[1]?.children ?? [];
  expect(String(profileSection[2]?.props.children)).toContain(
    'Governed form controls'
  );
});

test('generatePromptDraft supports docs-page generation mode', () => {
  const result = generatePromptDraft({
    productType: 'API documentation page',
    targetAudience: 'developers',
    sections: ['hero', 'sidebar', 'anchors', 'examples'],
    styleTone: 'precise',
    density: 'compact',
    domain: 'documentation',
    frameworkPreference: 'react',
    detailLevel: 'high',
    generationMode: 'docs-page',
  });

  expect(result.explainability.compositionFamily).toBe('docs-structured');
  expect(result.explainability.layoutRhythm).toBe('summary-detail');
  const examplesSection =
    result.draft.pages[0]?.root.children[3]?.children ?? [];
  expect(String(examplesSection[2]?.props.children)).toContain(
    'Anchor-supported'
  );
});
test('summarizePromptRecipe supports custom componentFamily', () => {
  const summary = summarizePromptRecipe({
    productType: 'Analytics workspace',
    targetAudience: 'ops teams',
    sections: ['hero', 'metrics', 'activity'],
    styleTone: 'confident',
    density: 'compact',
    domain: 'operations',
    frameworkPreference: 'react',
    detailLevel: 'high',
    generationMode: 'dashboard',
    componentFamily: 'my-custom-motion-primitives',
  });

  expect(summary.componentFamily).toBe('my-custom-motion-primitives');
  expect(summary.signature).toContain('my-custom-motion-primitives');
});
