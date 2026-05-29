import { describe, expect, it } from 'vitest';
import { diffPromptDrafts } from './diff';
import type { PromptDraftProject } from './index';

describe('Prompt Engine Semantic Diff', () => {
  it('detects changes between project structures', () => {
    const before: PromptDraftProject = {
      id: 'p1',
      name: 'Old Project Name',
      pages: [
        {
          id: 'page-1',
          title: 'Home',
          root: {
            id: 'root-1',
            componentId: 'card',
            props: { padding: 'sm' },
            children: [
              {
                id: 'child-1',
                componentId: 'text',
                props: { text: 'Hello' },
                children: [],
              },
            ],
          },
        },
      ],
    };

    const after: PromptDraftProject = {
      id: 'p1',
      name: 'New Project Name',
      pages: [
        {
          id: 'page-1',
          title: 'Main Home',
          root: {
            id: 'root-1',
            componentId: 'card',
            props: { padding: 'lg' },
            children: [
              {
                id: 'child-2',
                componentId: 'heading',
                props: { text: 'Title' },
                children: [],
              },
            ],
          },
        },
        {
          id: 'page-2',
          title: 'About Us',
          root: {
            id: 'root-2',
            componentId: 'card',
            props: {},
            children: [],
          },
        },
      ],
    };

    const result = diffPromptDrafts(before, after);

    expect(result.nameChanged).toBe(true);
    expect(result.pageDiffs).toHaveLength(2);

    const modifiedPage = result.pageDiffs.find((p) => p.pageId === 'page-1');
    expect(modifiedPage?.action).toBe('modified');
    expect(modifiedPage?.titleChanged).toBe(true);

    const textNodeDiff = modifiedPage?.nodeDiffs?.find(
      (n) => n.nodeId === 'child-1'
    );
    expect(textNodeDiff?.action).toBe('removed');

    const headingNodeDiff = modifiedPage?.nodeDiffs?.find(
      (n) => n.nodeId === 'child-2'
    );
    expect(headingNodeDiff?.action).toBe('added');

    const rootNodeDiff = modifiedPage?.nodeDiffs?.find(
      (n) => n.nodeId === 'root-1'
    );
    expect(rootNodeDiff?.action).toBe('modified');
    expect(rootNodeDiff?.propChanges).toEqual([
      { name: 'padding', before: 'sm', after: 'lg' },
    ]);

    expect(result.summary).toContain(
      'Renamed project from "Old Project Name" to "New Project Name"'
    );
    expect(result.summary).toContain('Created new page "About Us"');
  });
});
