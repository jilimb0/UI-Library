import { describe, expect, it } from 'vitest';
import {
  buildClarificationPrompts,
  builderModeSections,
  buildTemplateLibrary,
  getSelectedTemplate,
} from './promptModel';

describe('promptModel', () => {
  it('selects a template by id and falls back to the first entry', () => {
    expect(getSelectedTemplate('dashboard').id).toBe('dashboard');
    expect(getSelectedTemplate('missing').id).toBe('landing-page');
  });

  it('builds a template library with explainability data', () => {
    const library = buildTemplateLibrary();

    expect(library).toHaveLength(6);
    expect(library[0].samplePrompt).toContain('Product landing page');
    expect(library[0].explainabilityPreview[0]).toContain(
      'Recipe: landing-page'
    );
  });

  it('builds clarification prompts from the draft input', () => {
    const prompts = buildClarificationPrompts(
      'pricing page',
      '',
      'pricing-page'
    );

    expect(prompts).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Add a little more product context'),
        expect.stringContaining('Specify who the page is for'),
        expect.stringContaining('pricing pages'),
      ])
    );
  });

  it('exposes the builder mode catalog', () => {
    expect(builderModeSections.export.label).toBe('Export');
  });
});
