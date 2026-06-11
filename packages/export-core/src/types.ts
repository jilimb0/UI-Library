export type ExportTarget =
  | 'react-single-page'
  // TODO: react-multi-page renderer not yet implemented (see pipeline.ts)
  | 'react-multi-page'
  | 'html-static'
  | 'web-components-static'
  | 'nextjs-app-router'
  | 'vue3';
export type ExportPipelineStage =
  | 'normalize'
  | 'analyze'
  | 'enrich'
  | 'render'
  | 'post-process';

export type ExportRequest = {
  target: ExportTarget;
  project: ExportProjectInput;
};

export type ExportProjectInput = {
  id: string;
  name: string;
  pages: ExportPageInput[];
};

export type ExportPageInput = {
  id: string;
  name: string;
  path: string;
  rootNode: ExportNodeInput;
};

export type ExportNodeInput = {
  id: string;
  componentId: string;
  props: Record<string, unknown>;
  children: ExportNodeInput[];
};

export type BuilderLikeNode = {
  id: string;
  componentId: string;
  props: Record<string, unknown>;
  children: BuilderLikeNode[];
};

export type BuilderLikePage = {
  id: string;
  title: string;
  root: BuilderLikeNode;
};

export type BuilderLikeProject = {
  id: string;
  name: string;
  pages: BuilderLikePage[];
};

export type ExportDiagnosticLevel = 'info' | 'warning' | 'error';
export type ExportDiagnosticCode =
  | 'INVALID_PROJECT_SHAPE'
  | 'UNKNOWN_COMPONENT'
  | 'UNSUPPORTED_PROP_VALUE'
  | 'UNSUPPORTED_COMPONENT'
  | 'NOT_IMPLEMENTED';

export type ExportDiagnostic = {
  level: ExportDiagnosticLevel;
  code: ExportDiagnosticCode;
  message: string;
  pageId?: string;
  nodeId?: string;
  componentId?: string;
  propName?: string;
  /** Dot-separated path from the page root to the node, e.g. "root > card > heading". */
  nodePath?: string;
};

export type ExportIRNode = {
  nodeId: string;
  componentId: string;
  exportKind: 'component' | 'unsupported';
  props: Record<string, string | number | boolean | null>;
  children: ExportIRNode[];
  unsupportedReason?: string;
};

export type ExportIRPage = {
  pageId: string;
  name: string;
  path: string;
  rootNode: ExportIRNode;
};

export type ExportIRProject = {
  projectId: string;
  name: string;
  target: ExportTarget;
  pages: ExportIRPage[];
};

export type NormalizeExportResult = {
  ir: ExportIRProject;
  diagnostics: ExportDiagnostic[];
};

export type AnalyzeExportResult = {
  ir: ExportIRProject;
  diagnostics: ExportDiagnostic[];
  imports: string[];
  dependencies: string[];
  unsupportedNodeIds: string[];
};

export type EnrichExportResult = AnalyzeExportResult & {
  metadata: {
    renderer: ExportTarget;
    generatedAt: string;
    pageCount: number;
  };
};

export type ExportFile = {
  path: string;
  content: string;
};

export type RenderExportResult = {
  files: ExportFile[];
  diagnostics: ExportDiagnostic[];
};

export type ExportAcceptanceChecklist = {
  hasPages: boolean;
  hasDiagnostics: boolean;
  deterministicRenderer: boolean;
  builderFixtureCompatible: boolean;
};
