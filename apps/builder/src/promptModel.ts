export const promptTemplates = [
  {
    id: 'landing-page',
    label: 'Landing page',
    productType: 'Product landing page',
    targetAudience: 'product teams',
    sections: ['hero', 'social-proof', 'features', 'cta'],
    styleTone: 'confident',
    density: 'spacious' as const,
    domain: 'product marketing',
    frameworkPreference: 'react',
    detailLevel: 'medium' as const,
    generationMode: 'landing-page' as const,
    summary: 'For a focused launch or feature landing page.',
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    productType: 'Analytics dashboard',
    targetAudience: 'ops and product teams',
    sections: ['kpis', 'trend-chart', 'activity', 'table'],
    styleTone: 'calm',
    density: 'dense' as const,
    domain: 'analytics',
    frameworkPreference: 'react',
    detailLevel: 'high' as const,
    generationMode: 'dashboard' as const,
    summary: 'For data-heavy internal tools and admin surfaces.',
  },
  {
    id: 'docs-page',
    label: 'Docs page',
    productType: 'Documentation page',
    targetAudience: 'developers',
    sections: ['intro', 'usage', 'api', 'examples'],
    styleTone: 'clear',
    density: 'balanced' as const,
    domain: 'developer documentation',
    frameworkPreference: 'react',
    detailLevel: 'medium' as const,
    generationMode: 'docs-page' as const,
    summary: 'For product docs, guides, and reference content.',
  },
  {
    id: 'pricing-page',
    label: 'Pricing page',
    productType: 'Pricing page',
    targetAudience: 'buyers and evaluators',
    sections: ['plans', 'comparison', 'faq', 'cta'],
    styleTone: 'trustworthy',
    density: 'balanced' as const,
    domain: 'go-to-market',
    frameworkPreference: 'react',
    detailLevel: 'medium' as const,
    generationMode: 'pricing-page' as const,
    summary: 'For plan comparison and conversion-focused pages.',
  },
  {
    id: 'settings-page',
    label: 'Settings page',
    productType: 'Settings page',
    targetAudience: 'authenticated users',
    sections: ['profile', 'preferences', 'security', 'danger-zone'],
    styleTone: 'practical',
    density: 'dense' as const,
    domain: 'account management',
    frameworkPreference: 'react',
    detailLevel: 'medium' as const,
    generationMode: 'settings-page' as const,
    summary: 'For account and application preferences.',
  },
  {
    id: 'marketing-section',
    label: 'Marketing section',
    productType: 'Marketing section',
    targetAudience: 'website visitors',
    sections: ['headline', 'benefits', 'supporting-visual', 'cta'],
    styleTone: 'expressive',
    density: 'spacious' as const,
    domain: 'brand storytelling',
    frameworkPreference: 'react',
    detailLevel: 'medium' as const,
    generationMode: 'marketing-section' as const,
    summary: 'For a reusable section inside a larger page.',
  },
] as const;

export type PromptTemplate = (typeof promptTemplates)[number];

export const builderModeSections = {
  generate: {
    label: 'Generate',
    description: 'Shape a deterministic prompt request and create a draft.',
  },
  edit: {
    label: 'Edit',
    description: 'Refine layout, content, and structure inside the canvas.',
  },
  review: {
    label: 'Review',
    description:
      'Inspect validation, generation rationale, and readiness signals.',
  },
  publish: {
    label: 'Publish',
    description:
      'Review versioning and publish lifecycle state before release.',
  },
  export: {
    label: 'Export',
    description:
      'Prepare deterministic handoff and downstream implementation work.',
  },
} as const satisfies Record<
  'generate' | 'edit' | 'review' | 'publish' | 'export',
  { label: string; description: string }
>;

export function getSelectedTemplate(templateId: string) {
  return (
    promptTemplates.find((template) => template.id === templateId) ??
    promptTemplates[0]
  );
}

export function buildTemplateLibrary() {
  return promptTemplates.map((template) => ({
    ...template,
    samplePrompt: `${template.productType} for ${template.targetAudience}`,
    explainabilityPreview: [
      `Recipe: ${template.generationMode}`,
      `Sections: ${template.sections.join(', ')}`,
      `Tone: ${template.styleTone} · Density: ${template.density}`,
    ],
  }));
}

export function buildClarificationPrompts(
  promptDraft: string,
  audienceDraft: string,
  selectedTemplateId: PromptTemplate['id']
) {
  const normalizedPromptDraft = promptDraft.trim().toLowerCase();
  return [
    !promptDraft.trim()
      ? 'Describe the product or page outcome so generation can pick a better scaffold.'
      : null,
    promptDraft.trim().split(/\s+/).filter(Boolean).length < 4
      ? 'Add a little more product context, such as the feature area or customer problem.'
      : null,
    !audienceDraft.trim()
      ? 'Specify who the page is for so information density and hierarchy can be tuned.'
      : null,
    normalizedPromptDraft.includes('mobile app')
      ? 'This builder currently generates structured web UI; clarify the primary web surface you want first.'
      : null,
    normalizedPromptDraft.includes('animation')
      ? 'If motion is important, name the exact area that should feel animated so layout stays deterministic.'
      : null,
    selectedTemplateId === 'dashboard' &&
    !/(metric|kpi|chart|table|analytics|report)/.test(normalizedPromptDraft)
      ? 'For dashboards, mention the key metrics or views you expect to see.'
      : null,
    selectedTemplateId === 'pricing-page' &&
    !/(plan|tier|pricing|billing)/.test(normalizedPromptDraft)
      ? 'For pricing pages, mention plan structure or billing expectations.'
      : null,
  ].filter(Boolean) as string[];
}
