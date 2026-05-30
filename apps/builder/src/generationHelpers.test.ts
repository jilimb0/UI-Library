import { describe, expect, it } from 'vitest';
import {
  buildDiffSummary,
  formatDiffSummary,
  getCurrentBuilderSections,
  getPromptTemplateById,
} from './generationHelpers';
import { promptTemplates } from './promptModel';

describe('generationHelpers', () => {
  it('builds diff summaries from section lists', () => {
    expect(buildDiffSummary(['a', 'b'], ['b', 'c'])).toEqual({
      addedSections: ['c'],
      removedSections: ['a'],
      persistedSections: ['b'],
    });
  });

  it('formats diff summaries for display', () => {
    expect(
      formatDiffSummary({
        addedSections: ['a'],
        removedSections: ['b', 'c'],
        persistedSections: ['d'],
      })
    ).toContain('adds 1 section');
  });

  it('returns the requested template or falls back to the first one', () => {
    expect(getPromptTemplateById(promptTemplates, 'dashboard').id).toBe(
      'dashboard'
    );
    expect(getPromptTemplateById(promptTemplates, 'missing').id).toBe(
      promptTemplates[0].id
    );
  });

  it('extracts section ids from builder children', () => {
    expect(
      getCurrentBuilderSections([
        { id: 'a', componentId: 'x', props: {}, children: [] },
        { id: 'b', componentId: 'y', props: {}, children: [] },
      ])
    ).toEqual(['a', 'b']);
  });
});
