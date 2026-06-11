import { recordExportAnalyticsEvent } from './analytics';
import { renderHtmlStatic } from './html-target';
import { renderNextjsAppRouter } from './nextjs-renderer';
import { renderReactSinglePage } from './react-target';
import type {
  EnrichExportResult,
  ExportAcceptanceChecklist,
  ExportDiagnostic,
  ExportTarget,
  RenderExportResult,
} from './types';
import { renderWebComponentsStatic } from './web-components-target';

function finishExportRender(
  target: ExportTarget,
  result: RenderExportResult
): RenderExportResult {
  recordExportAnalyticsEvent('export_render_finished', target, {
    fileCount: result.files.length,
  });
  return result;
}

export function createExportAcceptanceChecklist(
  enriched: EnrichExportResult,
  rendered: RenderExportResult
): ExportAcceptanceChecklist {
  return {
    hasPages: enriched.metadata.pageCount > 0,
    hasDiagnostics:
      rendered.diagnostics.length > 0 || enriched.diagnostics.length > 0,
    deterministicRenderer: rendered.files.some(
      (file) =>
        file.path === 'src/App.tsx' ||
        file.path === 'index.html' ||
        file.path === 'app/page.tsx'
    ),
    builderFixtureCompatible: enriched.ir.pages.every(
      (page) => page.rootNode.nodeId.length > 0
    ),
  };
}

export function renderExportProject(
  enriched: EnrichExportResult
): RenderExportResult {
  recordExportAnalyticsEvent('export_render_started', enriched.ir.target, {
    pageCount: enriched.metadata.pageCount,
  });

  let result: RenderExportResult;
  switch (enriched.ir.target) {
    case 'react-single-page':
      result = finishExportRender(
        enriched.ir.target,
        renderReactSinglePage(enriched.ir)
      );
      break;
    case 'nextjs-app-router':
      result = finishExportRender(
        enriched.ir.target,
        renderNextjsAppRouter(enriched.ir)
      );
      break;
    case 'html-static':
      result = finishExportRender(
        enriched.ir.target,
        renderHtmlStatic(enriched.ir)
      );
      break;
    case 'web-components-static':
      result = finishExportRender(
        enriched.ir.target,
        renderWebComponentsStatic(enriched.ir)
      );
      break;
    case 'react-multi-page':
      // TODO: implement renderReactMultiPage — should generate separate
      // per-page files (e.g. src/pages/Home.tsx, src/pages/Pricing.tsx)
      // with a router-aware App.tsx entry point (React Router / TanStack Router).
      // Tracked: https://github.com/jilimbo/UI-Library/issues — "react-multi-page renderer"
      result = finishExportRender(enriched.ir.target, {
        files: [],
        diagnostics: [
          {
            level: 'warn',
            code: 'NOT_IMPLEMENTED',
            message: 'react-multi-page renderer is not yet implemented.',
          },
        ],
      });
      break;
    default:
      result = finishExportRender(enriched.ir.target, {
        files: [],
        diagnostics: [
          {
            level: 'error',
            code: 'UNSUPPORTED_COMPONENT',
            message: `Renderer ${enriched.ir.target} is not implemented.`,
          },
        ],
      });
  }

  // Enforce acceptance checklist — append error diagnostics for failed criteria
  const checklist = createExportAcceptanceChecklist(enriched, result);
  const checklistDiagnostics: ExportDiagnostic[] = [];

  if (!checklist.hasPages) {
    checklistDiagnostics.push({
      level: 'error',
      code: 'INVALID_PROJECT_SHAPE',
      message: 'Acceptance checklist failed: export has no pages.',
    });
  }
  if (!checklist.deterministicRenderer) {
    checklistDiagnostics.push({
      level: 'error',
      code: 'INVALID_PROJECT_SHAPE',
      message:
        'Acceptance checklist failed: no deterministic renderer entry point found in output files.',
    });
  }
  if (!checklist.builderFixtureCompatible) {
    checklistDiagnostics.push({
      level: 'error',
      code: 'INVALID_PROJECT_SHAPE',
      message:
        'Acceptance checklist failed: one or more pages have an empty root node ID.',
    });
  }

  if (checklistDiagnostics.length > 0) {
    return {
      ...result,
      diagnostics: [...result.diagnostics, ...checklistDiagnostics],
    };
  }

  return result;
}
