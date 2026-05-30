import { summarizePromptResponse } from '@ui-construction-library/prompt-engine';
import type { Dispatch, SetStateAction } from 'react';
import { recordAnalyticsEvent } from './analytics';
import {
  buildDiffSummary,
  getCurrentBuilderSections,
} from './generationHelpers';
import type { GenerationSummary } from './generationState';
import {
  applyPromptVersionLink,
  createBlockedGenerationSummary,
} from './generationState';
import {
  analyzePromptDraft,
  createPromptGenerationSummary,
  generatePromptDraftPreview,
} from './promptGeneration';
import type { PromptTemplate } from './promptModel';
import {
  createPromptLinkedVersion,
  linkGenerationToVersion,
} from './promptVersioning';
import type { BuilderPage, PageVersion } from './types';

type PromptWorkflowArgs = {
  editorPage: BuilderPage | null;
  promptDraft: string;
  audienceDraft: string;
  selectedTemplate: PromptTemplate;
  protectedNodeIds: string[];
  pendingDiffSummary: GenerationSummary['diffSummary'];
  setNotice: Dispatch<SetStateAction<string | null>>;
  setGenerationSummary: Dispatch<SetStateAction<GenerationSummary | null>>;
  setGenerationHistory: Dispatch<SetStateAction<GenerationSummary[]>>;
  setPendingDiffSummary: Dispatch<
    SetStateAction<GenerationSummary['diffSummary']>
  >;
  setPromptTemplateId: Dispatch<SetStateAction<string>>;
  setPromptDraft: Dispatch<SetStateAction<string>>;
  setAudienceDraft: Dispatch<SetStateAction<string>>;
  setExplainPrompt: Dispatch<SetStateAction<boolean>>;
  setShowPromptEntry: Dispatch<SetStateAction<boolean>>;
  setShowGenerationHistory: Dispatch<SetStateAction<boolean>>;
  handleGenerateProjectDraft: (input: {
    productType: string;
    targetAudience: string;
    sections: string[];
    styleTone: string;
    density: 'balanced' | 'dense' | 'spacious';
    domain: string;
    frameworkPreference: 'react';
    detailLevel: 'medium' | 'high';
    generationMode:
      | 'landing-page'
      | 'dashboard'
      | 'docs-page'
      | 'pricing-page'
      | 'settings-page'
      | 'marketing-section';
  }) => void;
};

export function generateDiffPreview({
  editorPage,
  promptDraft,
  audienceDraft,
  selectedTemplate,
  setPendingDiffSummary,
  setNotice,
}: Pick<
  PromptWorkflowArgs,
  | 'editorPage'
  | 'promptDraft'
  | 'audienceDraft'
  | 'selectedTemplate'
  | 'setPendingDiffSummary'
  | 'setNotice'
>) {
  recordAnalyticsEvent('prompt_diff_previewed', 'builder', {
    templateId: selectedTemplate.id,
  });
  const generated = generatePromptDraftPreview(
    promptDraft,
    audienceDraft,
    selectedTemplate
  );
  const semanticSummary = summarizePromptResponse(generated);
  const currentBuilderSections = getCurrentBuilderSections(
    editorPage?.root.children
  );
  const nextSectionIds =
    generated.draft.pages[0]?.root.children.map((node) => node.id) ?? [];
  setPendingDiffSummary(
    buildDiffSummary(currentBuilderSections, nextSectionIds)
  );
  setNotice(
    `Prepared ${semanticSummary.compositionFamily} preview with ${semanticSummary.sectionCount} sections.`
  );
}

export function reopenGeneration(
  summary: GenerationSummary,
  setPromptTemplateId: Dispatch<SetStateAction<string>>,
  setPromptDraft: Dispatch<SetStateAction<string>>,
  setAudienceDraft: Dispatch<SetStateAction<string>>,
  setExplainPrompt: Dispatch<SetStateAction<boolean>>,
  setGenerationSummary: Dispatch<SetStateAction<GenerationSummary | null>>,
  setShowPromptEntry: Dispatch<SetStateAction<boolean>>,
  setShowGenerationHistory: Dispatch<SetStateAction<boolean>>,
  getPromptTemplateById: (id: string) => PromptTemplate
) {
  const template = getPromptTemplateById(summary.templateId);
  setPromptTemplateId(template.id);
  setPromptDraft(summary.prompt);
  setAudienceDraft(summary.audience);
  setExplainPrompt(true);
  setGenerationSummary(summary);
  setShowPromptEntry(true);
  setShowGenerationHistory(false);
}

export function createPromptLinkedVersionEntry(
  summary: GenerationSummary,
  editorPage: BuilderPage | null,
  setGenerationSummary: Dispatch<SetStateAction<GenerationSummary | null>>,
  setGenerationHistory: Dispatch<SetStateAction<GenerationSummary[]>>,
  setNotice: Dispatch<SetStateAction<string | null>>
) {
  if (!editorPage) return;
  const version = createPromptLinkedVersion(summary, editorPage);
  setGenerationSummary((current) =>
    current && current.id === summary.id
      ? applyPromptVersionLink(
          {
            ...current,
            ...linkGenerationToVersion(version, version.snapshot.id),
          },
          version
        )
      : current
  );
  setGenerationHistory((history) =>
    history.map((entry) =>
      entry.id === summary.id
        ? (applyPromptVersionLink(
            {
              ...entry,
              ...linkGenerationToVersion(version, version.snapshot.id),
            },
            version
          ) ?? entry)
        : entry
    )
  );
  setNotice('Prepared prompt-linked version metadata.');
}

export function linkLatestGenerationToVersion(
  version: PageVersion | undefined,
  generationSummary: GenerationSummary | null,
  setGenerationSummary: Dispatch<SetStateAction<GenerationSummary | null>>,
  setGenerationHistory: Dispatch<SetStateAction<GenerationSummary[]>>,
  createLinkedEntry: (summary: GenerationSummary) => void
) {
  if (!version && generationSummary) {
    createLinkedEntry(generationSummary);
    return;
  }
  if (!version) return;
  setGenerationSummary((current) => applyPromptVersionLink(current, version));
  setGenerationHistory((history) =>
    history.map((entry, index) =>
      index === 0 ? (applyPromptVersionLink(entry, version) ?? entry) : entry
    )
  );
}

export function runPromptTemplate(args: PromptWorkflowArgs) {
  const {
    promptDraft,
    audienceDraft,
    selectedTemplate,
    protectedNodeIds,
    pendingDiffSummary,
    setNotice,
    setGenerationSummary,
    setGenerationHistory,
    setShowPromptEntry,
    setShowGenerationHistory,
    handleGenerateProjectDraft,
  } = args;

  recordAnalyticsEvent('prompt_draft_generated', 'builder', {
    templateId: selectedTemplate.id,
    audience: audienceDraft.trim() || selectedTemplate.targetAudience,
  });
  const normalizedPrompt = promptDraft.trim();
  const normalizedAudience =
    audienceDraft.trim() || selectedTemplate.targetAudience;
  const analysis = analyzePromptDraft(
    promptDraft,
    audienceDraft,
    selectedTemplate
  );

  if (analysis.policy.status === 'block') {
    setGenerationSummary(
      createBlockedGenerationSummary(
        createPromptGenerationSummary(
          selectedTemplate,
          normalizedAudience,
          normalizedPrompt || selectedTemplate.productType,
          analysis,
          protectedNodeIds,
          pendingDiffSummary
        ),
        protectedNodeIds,
        pendingDiffSummary
      )
    );
    setShowPromptEntry(false);
    setShowGenerationHistory(false);
    setNotice('Prompt blocked before entering the canvas. Refine the request.');
    return;
  }

  generatePromptDraftPreview(promptDraft, audienceDraft, selectedTemplate);

  handleGenerateProjectDraft({
    productType: normalizedPrompt || selectedTemplate.productType,
    targetAudience: normalizedAudience,
    sections: [...selectedTemplate.sections],
    styleTone: selectedTemplate.styleTone,
    density: selectedTemplate.density,
    domain: selectedTemplate.domain,
    frameworkPreference: selectedTemplate.frameworkPreference,
    detailLevel: selectedTemplate.detailLevel,
    generationMode: selectedTemplate.generationMode,
  });

  const nextSummary: GenerationSummary = createPromptGenerationSummary(
    selectedTemplate,
    normalizedAudience,
    normalizedPrompt || selectedTemplate.productType,
    analysis,
    protectedNodeIds,
    pendingDiffSummary
  );

  setGenerationSummary(nextSummary);
  setGenerationHistory((history) => [nextSummary, ...history].slice(0, 8));
  setShowPromptEntry(false);
  setShowGenerationHistory(false);
}
