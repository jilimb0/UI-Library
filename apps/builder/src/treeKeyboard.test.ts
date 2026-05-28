import { describe, expect, it } from 'vitest';
import { findParentNode, listNodeIdsDepthFirst } from './tree';

const root = {
  id: 'root',
  componentId: 'core/stack',
  props: {},
  children: [
    { id: 'a', componentId: 'core/section', props: {}, children: [] },
    {
      id: 'b',
      componentId: 'core/section',
      props: {},
      children: [
        { id: 'c', componentId: 'core/text', props: {}, children: [] },
      ],
    },
  ],
};

describe('tree keyboard helpers', () => {
  it('lists ids in depth-first order', () => {
    expect(listNodeIdsDepthFirst(root)).toEqual(['root', 'a', 'b', 'c']);
  });

  it('finds parent nodes', () => {
    expect(findParentNode(root, 'c')?.id).toBe('b');
    expect(findParentNode(root, 'root')).toBeNull();
  });
});
