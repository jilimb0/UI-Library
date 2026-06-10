export type PromptDraftOverrides = {
  productType?: string;
  targetAudience?: string;
  sections?: readonly string[];
  styleTone?: string;
  density?: 'balanced' | 'dense' | 'spacious';
  domain?: string;
  frameworkPreference?: 'react';
  detailLevel?: 'medium' | 'high';
  generationMode?:
    | 'landing-page'
    | 'dashboard'
    | 'docs-page'
    | 'pricing-page'
    | 'settings-page'
    | 'marketing-section';
};
