/**
 * Performance budgets for the export pipeline.
 *
 * These tests focus on medium and larger builder fixtures so regressions in
 * normalization, analysis, enrichment, or rendering show up before the export
 * path is treated as production-ready.
 */

import { performance } from 'node:perf_hooks';
import { describe, expect, it } from 'vitest';
import {
  analyzeExportProject,
  appendDoctorArtifacts,
  createExportRequestFromBuilderProject,
  enrichExportProject,
  normalizeExportProject,
  renderExportProject,
} from '../../packages/export-core/src/index.ts';

function makeNode(id: string, depth = 0, breadth = 3) {
  return {
    id,
    componentId: 'card',
    props: { title: `Node ${id}` },
    children:
      depth > 0
        ? Array.from({ length: breadth }, (_, index) =>
            makeNode(`${id}-${index}`, depth - 1, breadth)
          )
        : [],
  };
}

function makeProject(pageCount: number, depth: number, breadth: number) {
  return {
    id: `export-project-${pageCount}-${depth}-${breadth}`,
    name: `Export fixture ${pageCount}`,
    pages: Array.from({ length: pageCount }, (_, pageIndex) => ({
      id: `page-${pageIndex}`,
      title: `Page ${pageIndex}`,
      root: makeNode(`page-${pageIndex}-root`, depth, breadth),
    })),
  };
}

function runExport(project: ReturnType<typeof makeProject>) {
  const request = createExportRequestFromBuilderProject(
    project,
    'react-single-page'
  );
  const normalized = normalizeExportProject(request);
  const analyzed = analyzeExportProject(normalized);
  const enriched = enrichExportProject(analyzed);
  const rendered = renderExportProject(enriched);
  const withDoctor = appendDoctorArtifacts(enriched, rendered);

  return {
    normalized,
    analyzed,
    enriched,
    rendered,
    withDoctor,
  };
}

describe('Performance budgets — export pipeline', () => {
  it('exports a medium project in under 80 ms', () => {
    const project = makeProject(12, 2, 3);
    const start = performance.now();
    const result = runExport(project);
    const elapsed = performance.now() - start;

    expect(result.withDoctor.files.length).toBeGreaterThan(0);
    expect(result.analyzed.dependencies).toContain('react');
    expect(result.analyzed.dependencies).toContain('react-dom');
    expect(elapsed).toBeLessThan(80);
  });

  it('exports a larger multi-page project in under 160 ms', () => {
    const project = makeProject(24, 3, 3);
    const start = performance.now();
    const result = runExport(project);
    const elapsed = performance.now() - start;

    expect(result.enriched.metadata.pageCount).toBe(24);
    expect(result.rendered.files.map((file) => file.path)).toContain(
      'src/App.tsx'
    );
    expect(result.withDoctor.files.map((file) => file.path)).toContain(
      'EXPORT_DOCTOR.md'
    );
    expect(elapsed).toBeLessThan(160);
  });
});
