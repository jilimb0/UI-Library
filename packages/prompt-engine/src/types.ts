export type PromptGenerationMode =
  | 'landing-page'
  | 'dashboard'
  | 'marketing-section'
  | 'settings-app'
  | 'docs-page'
  | 'pricing-page'
  | 'onboarding';

export type PromptRequest = {
  productType: string;
  targetAudience: string;
  sections: string[];
  styleTone: string;
  density: 'compact' | 'balanced' | 'spacious';
  domain: string;
  frameworkPreference: 'react';
  detailLevel: 'low' | 'medium' | 'high';
  generationMode: PromptGenerationMode;
  componentFamily?: string;
};

export type NormalizedPromptRequest = PromptRequest & {
  normalizedSections: string[];
  promptSignature: string;
};

export type PromptAssumption = {
  code: string;
  message: string;
};

export type PromptAlternative = {
  code: string;
  label: string;
  reason: string;
};

export type PromptDraftNode = {
  id: string;
  componentId: string;
  props: Record<string, unknown>;
  children: PromptDraftNode[];
};

export type PromptDraftPage = {
  id: string;
  title: string;
  root: PromptDraftNode;
};

export type PromptDraftProject = {
  id: string;
  name: string;
  pages: PromptDraftPage[];
};

export type PromptRepairDiagnostic = {
  code: string;
  message: string;
  severity: 'info' | 'warning';
};

export type PromptGenerationPolicyScore = {
  score: number;
  status: 'allow' | 'warn' | 'block';
  reasons: string[];
};

export type PromptRepairResult = {
  draft: PromptDraftProject;
  diagnostics: PromptRepairDiagnostic[];
  repaired: boolean;
  valid: boolean;
};

export type BuilderCompatibleProject = {
  id: string;
  name: string;
  pages: PromptDraftPage[];
  publish: {
    status: 'draft';
    publishedAt: null;
    publishedBy: null;
    sourceVersionId: null;
  };
  members: [];
};

export type PromptResponse = {
  chosenIntent: PromptGenerationMode;
  assembledSections: string[];
  assumptions: PromptAssumption[];
  alternatives: PromptAlternative[];
  draft: PromptDraftProject;
  repair: PromptRepairResult;
  policy: PromptGenerationPolicyScore;
  explainability: {
    recipeId: string;
    usedComponents: string[];
    validationPassed: boolean;
    compositionFamily: string;
    layoutRhythm: string;
  };
};

export type PromptDraftReviewSummary = {
  intent: PromptGenerationMode;
  compositionFamily: string;
  layoutRhythm: string;
  sectionCount: number;
  sectionLabels: string[];
  policyStatus: PromptGenerationPolicyScore['status'];
  policyReasons: string[];
};

export type PromptRecipeSummary = {
  signature: string;
  compositionFamily: string;
  layoutRhythm: string;
  componentFamily: string;
};
