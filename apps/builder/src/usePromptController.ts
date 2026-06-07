import {
  generatePromptDraft,
  toBuilderCompatibleProject,
} from '@ui-construction-library/prompt-engine';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { commitProjects, type createInitialEditorState } from './editorState';
import type { PromptDraftOverrides } from './promptDraftOverrides';
import type { BuilderRoute } from './routes';
import { parseRoute } from './routes';

export function usePromptController({
  setEditorState,
  setNotice,
  setRoute,
  setSelectedNodeId,
}: {
  setEditorState: Dispatch<
    SetStateAction<ReturnType<typeof createInitialEditorState>>
  >;
  setNotice: Dispatch<SetStateAction<string | null>>;
  setRoute: Dispatch<SetStateAction<BuilderRoute>>;
  setSelectedNodeId: Dispatch<SetStateAction<string | null>>;
}) {
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);

  const handleGenerateProjectDraft = (
    promptOverrides?: PromptDraftOverrides
  ) => {
    if (isGeneratingDraft) return;

    const productType = promptOverrides?.productType ?? 'UI Starter';
    const targetAudience = promptOverrides?.targetAudience ?? 'product teams';
    const sections = promptOverrides?.sections ?? ['hero', 'features', 'cta'];
    const styleTone = promptOverrides?.styleTone ?? 'confident';
    const density = promptOverrides?.density ?? 'balanced';
    const domain = promptOverrides?.domain ?? 'ui tooling';
    const detailLevel = promptOverrides?.detailLevel ?? 'medium';
    const generationMode = promptOverrides?.generationMode ?? 'landing-page';

    setIsGeneratingDraft(true);
    setNotice('Generating prompt draft project...');

    window.setTimeout(() => {
      try {
        const result = generatePromptDraft({
          productType,
          targetAudience,
          sections: [...sections],
          styleTone,
          density: density === 'dense' ? 'compact' : density,
          domain,
          frameworkPreference: 'react',
          detailLevel,
          generationMode:
            generationMode === 'docs-page' || generationMode === 'settings-page'
              ? 'dashboard'
              : generationMode === 'pricing-page'
                ? 'landing-page'
                : generationMode,
        });
        const generatedProject = toBuilderCompatibleProject(result.draft);
        const generatedProjectWithReviewState: typeof generatedProject = {
          ...generatedProject,
          pages: generatedProject.pages.map((page) => ({
            ...page,
            root: {
              ...page.root,
              children: page.root.children.map((child) => {
                const existingReviewState = (
                  child.props as Record<string, unknown>
                ).reviewState;
                if (existingReviewState) return child;
                return {
                  ...child,
                  props: {
                    ...child.props,
                    reviewState: 'pending',
                  },
                };
              }),
            },
          })),
        };

        setEditorState((prev) => {
          const withoutExisting = prev.projects.filter(
            (project) => project.id !== generatedProjectWithReviewState.id
          );
          return commitProjects(prev, [
            ...withoutExisting,
            generatedProjectWithReviewState,
          ]);
        });
        setNotice('Generated prompt draft project.');
        setRoute(
          parseRoute(
            `/projects/${generatedProjectWithReviewState.id}/pages/${generatedProjectWithReviewState.pages[0]?.id ?? 'generated-page-1'}`
          )
        );
        setSelectedNodeId(
          generatedProjectWithReviewState.pages[0]?.root.id ?? null
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to generate prompt draft project.';
        setNotice(message);
      } finally {
        setIsGeneratingDraft(false);
      }
    }, 0);
  };

  return {
    handleGenerateProjectDraft,
    isGeneratingDraft,
  };
}
