import { foundationalComponents } from '@ui-construction-library/registry';
import { describe, expect, it } from 'vitest';
import { collectValidationIssues } from './validation';

describe('collectValidationIssues', () => {
  it('flags invalid interactive nesting and unsupported parents', () => {
    const root = {
      id: 'root',
      componentId: 'core/stack',
      props: {},
      children: [
        {
          id: 'button-1',
          componentId: 'core/button',
          props: {},
          children: [
            {
              id: 'button-2',
              componentId: 'core/button',
              props: {},
              children: [],
            },
          ],
        },
      ],
    };

    const issues = collectValidationIssues(root, foundationalComponents);
    expect(issues.length).toBeGreaterThan(0);
    expect(issues.some((issue) => issue.nodeId === 'button-1')).toBe(true);
    expect(issues.some((issue) => issue.nodeId === 'button-2')).toBe(true);
  });
});
