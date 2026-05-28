import { describe, expect, it } from 'vitest';
import {
  createExportPublicApiSnapshot,
  createExportTargetPlugin,
  createStaticRenderResult,
} from './targets';

describe('export target public contracts', () => {
  it('creates a stable target plugin contract', () => {
    const plugin = createExportTargetPlugin({
      target: 'react-single-page',
      version: '1',
      displayName: 'React single-page',
      supportedStages: ['normalize', 'analyze', 'enrich', 'render'],
      render(input) {
        return createStaticRenderResult(
          [{ path: 'src/App.tsx', content: `// ${input.metadata.renderer}` }],
          input.diagnostics
        );
      },
    });

    expect(plugin.version).toBe('1');
    expect(plugin.supportedStages).toContain('render');
  });

  it('creates a public api snapshot for versioned entrypoints', () => {
    const snapshot = createExportPublicApiSnapshot(
      {
        projectId: 'project-1',
        name: 'Example',
        target: 'html-static',
        pages: [
          {
            pageId: 'page-1',
            name: 'Home',
            path: '/',
            rootNode: {
              nodeId: 'root',
              componentId: 'stack',
              exportKind: 'component',
              props: {},
              children: [],
            },
          },
        ],
      },
      ['normalize', 'analyze', 'render']
    );

    expect(snapshot).toEqual({
      target: 'html-static',
      projectId: 'project-1',
      pageCount: 1,
      stageCount: 3,
    });
  });
});
