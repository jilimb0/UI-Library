import type {
  AnalyzeExportResult,
  EnrichExportResult,
  ExportDiagnostic,
  ExportFile,
  ExportIRProject,
  ExportPipelineStage,
  ExportTarget,
  NormalizeExportResult,
  RenderExportResult,
} from './index';

export type ExportTargetPlugin = {
  target: ExportTarget;
  version: '1';
  displayName: string;
  supportedStages: ExportPipelineStage[];
  render(input: EnrichExportResult): RenderExportResult;
};

export function createExportTargetPlugin(
  plugin: ExportTargetPlugin
): ExportTargetPlugin {
  return plugin;
}

export function createStaticRenderResult(
  files: ExportFile[],
  diagnostics: ExportDiagnostic[]
): RenderExportResult {
  return { files, diagnostics };
}

export type ExportPipelineArtifacts = {
  normalized: NormalizeExportResult;
  analyzed: AnalyzeExportResult;
  enriched: EnrichExportResult;
};

export type ExportPublicApiSnapshot = {
  target: ExportTarget;
  projectId: string;
  pageCount: number;
  stageCount: number;
};

export function createExportPublicApiSnapshot(
  ir: ExportIRProject,
  stages: ExportPipelineStage[]
): ExportPublicApiSnapshot {
  return {
    target: ir.target,
    projectId: ir.projectId,
    pageCount: ir.pages.length,
    stageCount: stages.length,
  };
}
