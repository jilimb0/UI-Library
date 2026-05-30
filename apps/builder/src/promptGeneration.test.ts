import { describe, expect, it } from 'vitest';
import {
  analyzePromptDraft,
  buildPromptDraftRequest,
  createPromptGenerationSummary,
} from './promptGeneration';
import { getSelectedTemplate } from './promptModel';

describe('promptGeneration', () => {
  const template = getSelectedTemplate('dashboard');

  it('builds a prompt draft request from the selected template', () => {
    expect(
      buildPromptDraftRequest('  Build dashboard  ', '', template)
    ).toMatchObject({
      productType: 'Build dashboard',
      targetAudience: template.targetAudience,
      frameworkPreference: 'react',
      generationMode: 'dashboard',
    });
  });

  it('analyzes prompt draft content', () => {
    const analysis = analyzePromptDraft(
      'Build a dashboard with metrics',
      '',
      template
    );

    expect(analysis.policy.status).toBe('allow');
    expect(analysis.assumptions[0]).toContain('dashboard');
  });

  it('creates a prompt generation summary', () => {
    const analysis = analyzePromptDraft(
      'Build a dashboard',
      'ops teams',
      template
    );
    const summary = createPromptGenerationSummary(
      template,
      'ops teams',
      'Build a dashboard',
      analysis,
      ['node-1'],
      null
    );

    expect(summary.templateId).toBe('dashboard');
    expect(summary.protectedNodeIds).toEqual(['node-1']);
    expect(summary.prompt).toBe('Build a dashboard');
    expect(summary.policyStatus).toBe('allow');
    expect(summary.createdAt).toMatch(/T/);
  });
});
