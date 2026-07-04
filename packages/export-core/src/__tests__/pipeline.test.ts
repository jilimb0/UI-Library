import { describe, expect, it } from 'vitest';
import {
  analyzeExportProject,
  createExportAcceptanceChecklist,
  createExportRequestFromBuilderProject,
  enrichExportProject,
  normalizeExportProject,
  renderExportProject,
} from '../index';

type ProjectInput = Record<string, unknown> & {
  pages?: Array<Record<string, unknown>>;
};

describe('export pipeline', () => {
  describe('createExportRequestFromBuilderProject', () => {
    it('should create an export request with target when given a valid project', () => {
      const project = { pages: [{ id: 'p1', title: 'Home' }] };

      const result = createExportRequestFromBuilderProject(project, 'react');

      expect(result).toEqual(
        expect.objectContaining({
          target: 'react',
          pages: [{ id: 'p1', title: 'Home' }],
        })
      );
    });

    it('should return default object when project is null', () => {
      const result = createExportRequestFromBuilderProject(null, 'react');

      expect(result).toEqual({ target: 'react', pages: [] });
    });

    it('should return default object when project is undefined', () => {
      const result = createExportRequestFromBuilderProject(undefined, 'html');

      expect(result).toEqual({ target: 'html', pages: [] });
    });

    it('should return default object when project is a primitive', () => {
      const result = createExportRequestFromBuilderProject('invalid', 'next');

      expect(result).toEqual({ target: 'next', pages: [] });
    });
  });

  describe('normalizeExportProject', () => {
    it('should return the input unchanged', () => {
      const input = { target: 'react', pages: [] };

      const result = normalizeExportProject(input);

      expect(result).toBe(input);
    });

    it('should handle null input', () => {
      const result = normalizeExportProject(null);

      expect(result).toBeNull();
    });

    it('should handle undefined input', () => {
      const result = normalizeExportProject(undefined);

      expect(result).toBeUndefined();
    });
  });

  describe('analyzeExportProject', () => {
    it('should return diagnostics, unsupportedNodeIds, dependencies, and imports', () => {
      const input = { target: 'react', pages: [] };

      const result = analyzeExportProject(input);

      expect(result).toEqual(
        expect.objectContaining({
          ...input,
          diagnostics: [],
          unsupportedNodeIds: [],
          dependencies: ['react', 'react-dom'],
          imports: ['react', 'react-dom'],
        })
      );
    });

    it('should spread input properties onto result', () => {
      const input = { customField: 'hello', pages: [{ id: 'p1' }] };

      const result = analyzeExportProject(input) as Record<string, unknown>;

      expect(result.customField).toBe('hello');
    });

    it('should handle null input gracefully', () => {
      const result = analyzeExportProject(null) as Record<string, unknown>;

      expect(result.diagnostics).toEqual([]);
      expect(result.dependencies).toEqual(['react', 'react-dom']);
    });
  });

  describe('enrichExportProject', () => {
    it('should add metadata with pageCount', () => {
      const input = { target: 'react', pages: [{ id: 'p1' }, { id: 'p2' }] };

      const result = enrichExportProject(input) as Record<string, unknown>;
      const metadata = result.metadata as Record<string, unknown>;

      expect(metadata.pageCount).toBe(2);
    });

    it('should set pageCount to 0 when pages array is empty', () => {
      const input = { target: 'react', pages: [] };

      const result = enrichExportProject(input) as Record<string, unknown>;
      const metadata = result.metadata as Record<string, unknown>;

      expect(metadata.pageCount).toBe(0);
    });

    it('should set pageCount to 0 when input has no pages', () => {
      const input = { target: 'react' };

      const result = enrichExportProject(input) as Record<string, unknown>;
      const metadata = result.metadata as Record<string, unknown>;

      expect(metadata.pageCount).toBe(0);
    });

    it('should handle null input gracefully', () => {
      const result = enrichExportProject(null) as Record<string, unknown>;

      expect(result.metadata).toEqual({ pageCount: 0 });
    });
  });

  describe('renderExportProject', () => {
    it('should return files array with expected entries', () => {
      const input = { target: 'react', pages: [{ id: 'p1' }] };

      const result = renderExportProject(input) as {
        files: Array<{ path: string; content: string }>;
        diagnostics: unknown[];
      };

      expect(result.files).toBeDefined();
      expect(Array.isArray(result.files)).toBe(true);
      expect(result.files.length).toBeGreaterThan(0);
      expect(result.files.map((f) => f.path)).toContain('README.md');
      expect(result.files.map((f) => f.path)).toContain('src/App.tsx');
      expect(result.files.map((f) => f.path)).toContain('package.json');
    });

    it('should include diagnostics array', () => {
      const result = renderExportProject({}) as Record<string, unknown>;

      expect(result.diagnostics).toEqual([]);
    });

    it('should include pageCount derived from metadata', () => {
      const input = {
        pages: [{ id: 'p1' }],
        metadata: { pageCount: 5 },
      };

      const result = renderExportProject(input) as Record<string, unknown>;

      expect(result.pageCount).toBe(5);
    });

    it('should calculate pageCount from pages when metadata is missing', () => {
      const input = { pages: [{ id: 'p1' }, { id: 'p2' }, { id: 'p3' }] };

      const result = renderExportProject(input) as Record<string, unknown>;

      expect(result.pageCount).toBe(3);
    });

    it('should handle null/undefined input gracefully', () => {
      const result = renderExportProject(null) as Record<string, unknown>;

      expect(result.files).toBeDefined();
      expect(result.diagnostics).toEqual([]);
    });
  });

  describe('createExportAcceptanceChecklist', () => {
    it('should return hasPages true when enriched has pages', () => {
      const result = createExportAcceptanceChecklist(
        { pages: [{ id: 'p1' }] },
        { files: [{ path: 'test.ts' }] }
      );

      expect(result).toEqual({
        hasPages: true,
        deterministicRenderer: true,
        builderFixtureCompatible: true,
      });
    });

    it('should return hasPages false when enriched has no pages', () => {
      const result = createExportAcceptanceChecklist(
        { pages: [] },
        { files: [] }
      );

      expect(result).toEqual({
        hasPages: false,
        deterministicRenderer: true,
        builderFixtureCompatible: false,
      });
    });

    it('should handle null/undefined enriched gracefully', () => {
      const result = createExportAcceptanceChecklist(undefined, null);

      expect(result).toEqual({
        hasPages: false,
        deterministicRenderer: false,
        builderFixtureCompatible: false,
      });
    });
  });

  describe('full pipeline integration', () => {
    it('should process a project through the full export pipeline', () => {
      const project: ProjectInput = {
        name: 'Test Project',
        pages: [
          { id: 'p1', title: 'Home' },
          { id: 'p2', title: 'About' },
        ],
      };

      const request = createExportRequestFromBuilderProject(project, 'react');
      const normalized = normalizeExportProject(request);
      const analyzed = analyzeExportProject(normalized) as Record<
        string,
        unknown
      >;
      const enriched = enrichExportProject(analyzed) as Record<string, unknown>;
      const rendered = renderExportProject(enriched) as Record<string, unknown>;
      const checklist = createExportAcceptanceChecklist(enriched, rendered);

      expect(analyzed.dependencies).toEqual(['react', 'react-dom']);
      expect((enriched.metadata as Record<string, unknown>).pageCount).toBe(2);
      expect(rendered.files).toBeDefined();
      expect(rendered.diagnostics).toEqual([]);
      expect(checklist.hasPages).toBe(true);
      expect(checklist.deterministicRenderer).toBe(true);
    });

    it('should handle a project with zero pages through the pipeline', () => {
      const project = { name: 'Empty Project', pages: [] };

      const request = createExportRequestFromBuilderProject(project, 'html');
      const enriched = enrichExportProject(
        analyzeExportProject(normalizeExportProject(request))
      ) as Record<string, unknown>;
      const rendered = renderExportProject(enriched) as Record<string, unknown>;
      const checklist = createExportAcceptanceChecklist(enriched, rendered);

      expect((enriched.metadata as Record<string, unknown>).pageCount).toBe(0);
      expect(checklist.hasPages).toBe(false);
      expect(Array.isArray(rendered.files)).toBe(true);
    });

    it('should handle a pipeline with null/empty input at every stage', () => {
      const request = createExportRequestFromBuilderProject(null, 'react');
      const normalized = normalizeExportProject(request);
      const analyzed = analyzeExportProject(normalized) as Record<
        string,
        unknown
      >;
      const enriched = enrichExportProject(analyzed) as Record<string, unknown>;

      expect(request).toEqual({ target: 'react', pages: [] });
      expect(normalized).toEqual({ target: 'react', pages: [] });
      expect(analyzed.dependencies).toEqual(['react', 'react-dom']);
      expect((enriched.metadata as Record<string, unknown>).pageCount).toBe(0);
    });
  });
});
