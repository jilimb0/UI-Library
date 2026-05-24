import { describe, expect, it } from 'vitest';
import { addChildNode, duplicateNode, findNode, removeNode } from './tree';
import type { LayoutNode } from './types';

const sample: LayoutNode = {
  id: 'root',
  componentId: 'card',
  props: {},
  children: [
    { id: 'a', componentId: 'text', props: {}, children: [] },
    { id: 'b', componentId: 'button', props: {}, children: [] },
  ],
};

describe('tree helpers', () => {
  it('findNode finds nested node', () => {
    expect(findNode(sample, 'b')?.componentId).toBe('button');
  });

  it('addChildNode appends child to target parent', () => {
    const added = addChildNode(sample, 'a', {
      id: 'a-1',
      componentId: 'badge',
      props: {},
      children: [],
    });
    expect(findNode(added, 'a-1')?.componentId).toBe('badge');
  });

  it('removeNode removes node subtree', () => {
    const removed = removeNode(sample, 'b');
    expect(findNode(removed, 'b')).toBeNull();
  });

  it('duplicateNode clones subtree with suffix', () => {
    const duplicated = duplicateNode(sample, 'a', 'copy');
    expect(findNode(duplicated, 'a-copy')).not.toBeNull();
  });
});
