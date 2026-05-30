import {
  generatePromptDraft,
  type PromptRequest,
} from '@ui-construction-library/prompt-engine';
import type { PromptTemplate } from './promptModel';
import type { PromptGenerationSummary } from './promptVersioning';

export type PromptDraftPolicy = {
  score: number;
  status: 'allow' | 'warn' | 'block';
  reasons: string[];
};

export type PromptGenerationResult = {
  assumptions: string[];
  unsupportedIntent: string | null;
  fallbackDecisions: string[];
  policy: PromptDraftPolicy;
};

export function analyzePromptDraft(
  prompt: string,
  audience: string,
  template: PromptTemplate
): PromptGenerationResult {
  const normalizedPrompt = prompt.trim();
  const normalizedAudience = audience.trim() || template.targetAudience;
  const promptLower = normalizedPrompt.toLowerCase();
  const assumptions = [
    `Using ${template.label.toLowerCase()} scaffold.`,
    `Targeting ${normalizedAudience}.`,
    `Applying ${template.density} density with ${template.styleTone} tone.`,
  ];
  const unsupportedIntent = promptLower.includes('mobile app')
    ? 'Prompt mentions a mobile app; builder draft stays focused on structured web UI.'
    : promptLower.includes('animation')
      ? 'Prompt mentions advanced animation; generation stays within deterministic layout recipes.'
      : null;
  const policy: PromptDraftPolicy = {
    score: 1,
    status: 'allow',
    reasons: [],
  };
  const fallbackDecisions = [
    `Recipe sections: ${template.sections.join(', ')}.`,
    `Framework locked to ${template.frameworkPreference}.`,
    `Detail level set to ${template.detailLevel}.`,
  ];

  return {
    assumptions,
    unsupportedIntent,
    fallbackDecisions,
    policy,
  };
}

export function buildPromptDraftRequest(
  prompt: string,
  audience: string,
  template: PromptTemplate
) {
  const normalizedPrompt = prompt.trim();
  const normalizedAudience = audience.trim() || template.targetAudience;
  const density = template.density === 'dense' ? 'compact' : template.density;
  const generationMode =
    template.generationMode === 'docs-page' ||
    template.generationMode === 'settings-page'
      ? 'dashboard'
      : template.generationMode === 'pricing-page'
        ? 'landing-page'
        : template.generationMode;

  return {
    productType: normalizedPrompt || template.productType,
    targetAudience: normalizedAudience,
    sections: [...template.sections],
    styleTone: template.styleTone,
    density: density as PromptRequest['density'],
    domain: template.domain,
    frameworkPreference: template.frameworkPreference,
    detailLevel: template.detailLevel,
    generationMode,
  };
}

export function createPromptGenerationSummary(
  template: PromptTemplate,
  audience: string,
  prompt: string,
  analysis: PromptGenerationResult,
  protectedNodeIds: string[],
  diffSummary: PromptGenerationSummary['diffSummary']
): PromptGenerationSummary {
  return {
    id: `generation-${Date.now()}`,
    createdAt: new Date().toISOString(),
    templateId: template.id,
    templateLabel: template.label,
    audience,
    prompt,
    assumptions: analysis.assumptions,
    unsupportedIntent: analysis.unsupportedIntent,
    fallbackDecisions: analysis.fallbackDecisions,
    policyScore: analysis.policy.score,
    policyStatus: analysis.policy.status,
    policyReasons: analysis.policy.reasons,
    protectedNodeIds,
    diffSummary,
  };
}

export function generatePromptDraftPreview(
  prompt: string,
  audience: string,
  template: PromptTemplate
) {
  return generatePromptDraft(
    buildPromptDraftRequest(prompt, audience, template) as PromptRequest
  );
}
