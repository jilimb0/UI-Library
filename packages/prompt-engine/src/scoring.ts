import type {
  PromptGenerationMode,
  PromptGenerationPolicyScore,
  PromptRequest,
} from './types';

const MODE_SAFETY_RAILS: Record<PromptGenerationMode, readonly string[]> = {
  'landing-page': [
    'single primary page',
    'foundation registry components only',
  ],
  dashboard: ['summary-first layout', 'read-only placeholder metrics'],
  'marketing-section': ['single section output', 'copy kept deterministic'],
  'settings-app': ['form fields validated', 'grouped configuration layout'],
  'docs-page': ['anchored content headers', 'code examples formatted'],
  'pricing-page': [
    'plan tiers deterministic',
    'comparison table scaffold only',
    'no live billing integration',
  ],
  onboarding: [
    'step-by-step linear flow',
    'progress indicator required',
    'no external auth calls',
  ],
};

export function scorePromptRequest(
  request: PromptRequest
): PromptGenerationPolicyScore {
  const reasons: string[] = [];
  let score = 100;

  if (request.productType.trim().split(/\s+/).length < 2) {
    score -= 20;
    reasons.push('Product type is underspecified for a reliable scaffold.');
  }

  if (request.targetAudience.trim().length === 0) {
    score -= 20;
    reasons.push('Target audience is missing.');
  }

  if (request.sections.length < 2) {
    score -= 10;
    reasons.push(
      'Very few sections were requested, which weakens layout planning.'
    );
  }

  if (/mobile app|native app/i.test(request.productType)) {
    score -= 35;
    reasons.push(
      'Request implies a native/mobile app while the generator targets structured web UI.'
    );
  }

  if (
    /animation|motion-heavy|3d/i.test(
      `${request.productType} ${request.domain}`
    )
  ) {
    score -= 15;
    reasons.push(
      'Advanced motion requirements exceed the deterministic layout recipe baseline.'
    );
  }

  const status = score < 50 ? 'block' : score < 75 ? 'warn' : 'allow';

  if (reasons.length === 0) {
    reasons.push(
      'Prompt fits the deterministic structured-UI generation policy.'
    );
  }

  return { score, status, reasons };
}

export function getPromptGenerationSafetyRails(
  mode: PromptGenerationMode
): readonly string[] {
  return MODE_SAFETY_RAILS[mode];
}
