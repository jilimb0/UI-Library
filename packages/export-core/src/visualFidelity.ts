import type {
  BuilderLikeProject,
  EnrichExportResult,
  ExportTarget,
  RenderExportResult,
} from './index';
import {
  analyzeExportProject,
  createExportRequestFromBuilderProject,
  enrichExportProject,
  normalizeExportProject,
  renderExportProject,
} from './index';

export type VisualFidelitySnapshot = {
  pageIds: string[];
  textContent: string[];
  componentIds: string[];
};

export type ExportVisualFidelityReport = {
  target: ExportTarget;
  matchesBuilderPages: boolean;
  preservesTextContent: boolean;
  preservesRegisteredComponents: boolean;
  exportedFilePaths: string[];
  builderSnapshot: VisualFidelitySnapshot;
  exportSnapshot: VisualFidelitySnapshot;
};

function collectBuilderText(
  node: BuilderLikeProject['pages'][number]['root'],
  bucket: string[]
): void {
  const childrenProp = node.props.children;
  if (typeof childrenProp === 'string' && childrenProp.trim().length > 0) {
    bucket.push(childrenProp.trim());
  }

  node.children.forEach((child) => {
    collectBuilderText(child, bucket);
  });
}

function collectBuilderComponents(
  node: BuilderLikeProject['pages'][number]['root'],
  bucket: string[]
): void {
  bucket.push(node.componentId);
  node.children.forEach((child) => {
    collectBuilderComponents(child, bucket);
  });
}

export function createBuilderVisualSnapshot(
  project: BuilderLikeProject
): VisualFidelitySnapshot {
  const textContent: string[] = [];
  const componentIds: string[] = [];

  project.pages.forEach((page) => {
    collectBuilderText(page.root, textContent);
    collectBuilderComponents(page.root, componentIds);
  });

  return {
    pageIds: project.pages.map((page) => page.id),
    textContent: [...new Set(textContent)].sort(),
    componentIds: [...new Set(componentIds)].sort(),
  };
}

function decodeQuotedString(value: string): string {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function createExportTextSnapshot(rendered: RenderExportResult): string[] {
  const bucket = new Set<string>();

  rendered.files
    .filter((file) => /\.(html|tsx|js)$/i.test(file.path))
    .forEach((file) => {
      [...file.content.matchAll(/children=\{("(?:[^"\\]|\\.)*")\}/g)].forEach(
        (match) => {
          const raw = match[1];
          if (raw) {
            const decoded = decodeQuotedString(raw).trim();
            if (decoded.length > 0) bucket.add(decoded);
          }
        }
      );

      [...file.content.matchAll(/appendText\(("(?:[^"\\]|\\.)*")\)/g)].forEach(
        (match) => {
          const raw = match[1];
          if (raw) {
            const decoded = decodeQuotedString(raw).trim();
            if (decoded.length > 0) bucket.add(decoded);
          }
        }
      );

      [
        ...file.content.matchAll(/textContent\s*=\s*("(?:[^"\\]|\\.)*")/g),
      ].forEach((match) => {
        const raw = match[1];
        if (raw) {
          const decoded = decodeQuotedString(raw).trim();
          if (decoded.length > 0) bucket.add(decoded);
        }
      });

      [...file.content.matchAll(/>([^<>]+)</g)].forEach((match) => {
        const value = (match[1] ?? '').trim();
        if (value.length > 0) bucket.add(value);
      });
    });

  return [...bucket].sort();
}

function createExportComponentSnapshot(enriched: EnrichExportResult): string[] {
  const bucket = new Set<string>();

  const walk = (
    node: EnrichExportResult['ir']['pages'][number]['rootNode']
  ) => {
    bucket.add(node.componentId);
    node.children.forEach(walk);
  };

  enriched.ir.pages.forEach((page) => {
    walk(page.rootNode);
  });
  return [...bucket].sort();
}

export function createExportVisualFidelityReport(
  project: BuilderLikeProject,
  target: ExportTarget
): ExportVisualFidelityReport {
  const request = createExportRequestFromBuilderProject(project, target);
  const normalized = normalizeExportProject(request);
  const analyzed = analyzeExportProject(normalized);
  const enriched = enrichExportProject(analyzed);
  const rendered = renderExportProject(enriched);

  const builderSnapshot = createBuilderVisualSnapshot(project);
  const exportSnapshot: VisualFidelitySnapshot = {
    pageIds: enriched.ir.pages.map((page) => page.pageId),
    textContent: createExportTextSnapshot(rendered),
    componentIds: createExportComponentSnapshot(enriched),
  };

  return {
    target,
    matchesBuilderPages:
      JSON.stringify(builderSnapshot.pageIds) ===
      JSON.stringify(exportSnapshot.pageIds),
    preservesTextContent: builderSnapshot.textContent.every((text) =>
      exportSnapshot.textContent.includes(text)
    ),
    preservesRegisteredComponents:
      JSON.stringify(builderSnapshot.componentIds) ===
      JSON.stringify(exportSnapshot.componentIds),
    exportedFilePaths: rendered.files.map((file) => file.path),
    builderSnapshot,
    exportSnapshot,
  };
}
