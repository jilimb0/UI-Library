import type { Dispatch, SetStateAction } from 'react';
import type { GenerationSummary } from './generationState';
import type { PromptTemplate } from './promptModel';
import {
  createPromptLinkedVersionEntry,
  linkLatestGenerationToVersion,
  reopenGeneration,
} from './promptWorkflow';
import type { BuilderPage, PageVersion } from './types';

type PromptControllerDeps = {
  latestPromptLinkedVersion: PageVersion | undefined;
  generationSummary: GenerationSummary | null;
  editorPage: BuilderPage | null;
  setGenerationSummary: Dispatch<SetStateAction<GenerationSummary | null>>;
  setGenerationHistory: Dispatch<SetStateAction<GenerationSummary[]>>;
  setPromptTemplateId: Dispatch<SetStateAction<string>>;
  setPromptDraft: Dispatch<SetStateAction<string>>;
  setAudienceDraft: Dispatch<SetStateAction<string>>;
  setExplainPrompt: Dispatch<SetStateAction<boolean>>;
  setShowPromptEntry: Dispatch<SetStateAction<boolean>>;
  setShowGenerationHistory: Dispatch<SetStateAction<boolean>>;
  setNotice: Dispatch<SetStateAction<string | null>>;
  getPromptTemplateById: (id: string) => PromptTemplate;
};

export function createPromptController(deps: PromptControllerDeps) {
  return {
    linkLatestGenerationToVersion: () =>
      linkLatestGenerationToVersion(
        deps.latestPromptLinkedVersion,
        deps.generationSummary,
        deps.setGenerationSummary,
        deps.setGenerationHistory,
        (summary) =>
          createPromptLinkedVersionEntry(
            summary,
            deps.editorPage,
            deps.setGenerationSummary,
            deps.setGenerationHistory,
            deps.setNotice
          )
      ),
    reopenGeneration: (summary: GenerationSummary) =>
      reopenGeneration(
        summary,
        deps.setPromptTemplateId,
        deps.setPromptDraft,
        deps.setAudienceDraft,
        deps.setExplainPrompt,
        deps.setGenerationSummary,
        deps.setShowPromptEntry,
        deps.setShowGenerationHistory,
        deps.getPromptTemplateById
      ),
  };
}
