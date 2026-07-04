import { describe, expect, it } from 'vitest';
import {
  nextjsAppRouterTarget,
  renderExportProject,
  renderHtmlStatic,
  renderNextjsAppRouter,
  renderReactSinglePage,
  renderWebComponentsStatic,
  vue3Target,
} from '../index';

describe('renderExportProject', () => {
  it('should always include the 5 expected files', () => {
    const result = renderExportProject({ pages: [{ id: 'p1' }] }) as {
      files: Array<{ path: string; content: string }>;
    };

    const paths = result.files.map((f) => f.path);
    expect(paths).toContain('README.md');
    expect(paths).toContain('src/App.tsx');
    expect(paths).toContain('package.json');
    expect(paths).toContain('tokens/design-tokens.json');
    expect(paths).toContain('tokens/design-tokens.css');
  });

  it('should return empty content strings for all files', () => {
    const result = renderExportProject({}) as {
      files: Array<{ path: string; content: string }>;
    };

    for (const file of result.files) {
      expect(file.content).toBe('');
    }
  });

  it('should handle null pages gracefully', () => {
    const input = { pages: null };
    const result = renderExportProject(input) as Record<string, unknown>;

    expect(result.files).toBeDefined();
    expect(Array.isArray(result.files)).toBe(true);
  });

  it('should handle non-array pages gracefully', () => {
    const input = { pages: 'not-an-array' };
    const result = renderExportProject(input) as Record<string, unknown>;

    expect(result.files).toBeDefined();
  });
});

describe('renderHtmlStatic', () => {
  it('should return an empty string', () => {
    const result = renderHtmlStatic({ pages: [] });
    expect(result).toBe('');
  });

  it('should return empty string even with null input', () => {
    const result = renderHtmlStatic(null);
    expect(result).toBe('');
  });
});

describe('renderReactSinglePage', () => {
  it('should return an empty string', () => {
    const result = renderReactSinglePage({ pages: [] });
    expect(result).toBe('');
  });

  it('should return empty string even with undefined input', () => {
    const result = renderReactSinglePage(undefined);
    expect(result).toBe('');
  });
});

describe('renderWebComponentsStatic', () => {
  it('should return an empty string', () => {
    const result = renderWebComponentsStatic({ pages: [] });
    expect(result).toBe('');
  });
});

describe('renderNextjsAppRouter', () => {
  it('should return an empty string', () => {
    const result = renderNextjsAppRouter({ pages: [] });
    expect(result).toBe('');
  });
});

describe('nextjsAppRouterTarget', () => {
  it('should return null', () => {
    const result = nextjsAppRouterTarget();
    expect(result).toBeNull();
  });
});

describe('vue3Target', () => {
  it('should return null', () => {
    const result = vue3Target();
    expect(result).toBeNull();
  });
});
