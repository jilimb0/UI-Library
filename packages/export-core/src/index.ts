export * from './analysis';
// Re-exports from sibling modules to preserve complete API surface
export {
  appendDoctorArtifacts,
  createDesignTokenArtifactFiles,
  createExportAssetManifest,
  createExportDoctorMarkdown,
  createExportDoctorReport,
  type ExportAssetManifest,
  type ExportDoctorReport,
} from './fidelity';
export { renderHtmlStatic } from './html-target';
export { renderNextjsAppRouter } from './nextjs-renderer';
export { nextjsAppRouterTarget } from './nextjs-target';
export * from './normalization';
export * from './pipeline';
// Target-specific public exports
export { renderReactSinglePage } from './react-target';
export {
  createExportPublicApiSnapshot,
  createExportTargetPlugin,
  createStaticRenderResult,
  type ExportPipelineArtifacts,
  type ExportPublicApiSnapshot,
  type ExportTargetPlugin,
} from './targets';
export { vue3Target } from './targets/vue3-target';
export * from './types';
export {
  createBuilderVisualSnapshot,
  createExportVisualFidelityReport,
  type ExportVisualFidelityReport,
  type VisualFidelitySnapshot,
} from './visualFidelity';
export { renderWebComponentsStatic } from './web-components-target';
