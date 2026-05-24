import { describe, expect, it } from 'vitest';
import {
  generatePromptDraft,
  getPromptGenerationSafetyRails,
  type PromptRequest,
  repairPromptDraftProject,
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
