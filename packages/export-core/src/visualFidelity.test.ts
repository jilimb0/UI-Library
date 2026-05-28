import { describe, expect, it } from 'vitest';
import type { BuilderLikeProject } from './index';
import { createExportVisualFidelityReport } from './index';

const goldenKitFixture: BuilderLikeProject = {
  id: 'golden-kit',
  name: 'Golden Kit',
  pages: [
    {
      id: 'landing',
      title: 'Landing',
      root: {
        id: 'landing-root',
        componentId: 'card',
        props: { padding: 'lg', interactive: false },
        children: [
          {
            id: 'landing-heading',
            componentId: 'heading',
            props: { level: '1', children: 'Ship polished exports' },
            children: [],
          },
          {
            id: 'landing-copy',
            componentId: 'text',
            props: {
              children: 'Builder fidelity should survive every export target.',
            },
            children: [],
          },
        ],
      },
    },
    {
      id: 'pricing',
      title: 'Pricing',
      root: {
        id: 'pricing-root',
        componentId: 'card',
        props: { padding: 'md', interactive: false },
        children: [
          {
            id: 'pricing-heading',
            componentId: 'heading',
            props: { level: '2', children: 'Predictable handoff' },
            children: [],
          },
          {
            id: 'pricing-copy',
            componentId: 'text',
            props: {
              children: 'Tokens, icons, and app shells should stay aligned.',
            },
            children: [],
          },
        ],
      },
    },
  ],
};

describe('visual fidelity coverage', () => {
  it('compares builder snapshots to react exports for a golden kit fixture', () => {
    const report = createExportVisualFidelityReport(
      goldenKitFixture,
      'react-single-page'
    );

    expect(report.matchesBuilderPages).toBe(true);
    expect(report.preservesTextContent).toBe(true);
    expect(report.preservesRegisteredComponents).toBe(true);
    expect(report.exportedFilePaths).toContain('src/App.tsx');
    expect(report.exportedFilePaths).toContain('tokens/design-tokens.json');
  });

  it('compares builder snapshots to html exports for a golden kit fixture', () => {
    const htmlReport = createExportVisualFidelityReport(
      goldenKitFixture,
      'html-static'
    );

    expect(htmlReport.matchesBuilderPages).toBe(true);
    expect(htmlReport.preservesTextContent).toBe(true);
    expect(htmlReport.preservesRegisteredComponents).toBe(true);
    expect(htmlReport.exportedFilePaths).toContain('index.html');
  });

  it('compares builder snapshots to web-components exports for a golden kit fixture', () => {
    const webComponentsReport = createExportVisualFidelityReport(
      goldenKitFixture,
      'web-components-static'
    );

    expect(webComponentsReport.matchesBuilderPages).toBe(true);
    expect(webComponentsReport.preservesRegisteredComponents).toBe(true);
    expect(webComponentsReport.exportedFilePaths).toContain('components.js');
    expect(webComponentsReport.exportedFilePaths).toContain('README.md');
    expect(webComponentsReport.exportSnapshot.componentIds).toContain('card');
    expect(webComponentsReport.exportSnapshot.componentIds).toContain(
      'heading'
    );
    expect(webComponentsReport.exportSnapshot.componentIds).toContain('text');
  });
});
