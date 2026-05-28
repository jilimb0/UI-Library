import { performance } from 'node:perf_hooks';
import { describe, expect, it } from 'vitest';
import {
  analyzeExportProject,
  createExportRequestFromBuilderProject,
  enrichExportProject,
  normalizeExportProject,
  renderExportProject,
} from '../../packages/export-core/src/index.ts';

function makeNode(id, depth = 0, breadth = 3) {
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

function makeProject(pageCount = 8) {
  return {
    id: 'memory-audit-project',
    name: 'Memory audit fixture',
    pages: Array.from({ length: pageCount }, (_, pageIndex) => ({
      id: `page-${pageIndex}`,
      title: `Page ${pageIndex}`,
      root: makeNode(`page-${pageIndex}-root`, 3, 3),
    })),
  };
}

function runExportPipeline(project) {
  const request = createExportRequestFromBuilderProject(
    project,
    'react-single-page'
  );
  const normalized = normalizeExportProject(request);
  const analyzed = analyzeExportProject(normalized);
  const enriched = enrichExportProject(analyzed);
  const rendered = renderExportProject(enriched);

  return {
    normalized,
    analyzed,
    enriched,
    rendered,
  };
}

describe('Memory leak smoke', () => {
  it('keeps repeated export pipeline runs bounded', () => {
    const project = makeProject();
    const iterations = 60;
    const results = [];
    const heapBefore = process.memoryUsage().heapUsed;
    const start = performance.now();

    for (let index = 0; index < iterations; index += 1) {
      const result = runExportPipeline(project);
      results.push(result.rendered.files.length);
      expect(result.rendered.files.length).toBeGreaterThan(0);
      expect(result.analyzed.imports.length).toBeGreaterThan(0);
    }

    if (typeof globalThis.gc === 'function') {
      globalThis.gc();
      globalThis.gc();
    }

    const heapAfter = process.memoryUsage().heapUsed;
    const elapsed = performance.now() - start;

    expect(results).toHaveLength(iterations);
    expect(heapAfter - heapBefore).toBeLessThan(25 * 1024 * 1024);
    expect(elapsed).toBeLessThan(1500);
  });
});
