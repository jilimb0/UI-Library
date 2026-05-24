import { describe, expect, it } from 'vitest';
import {
  commitProjects,
  createInitialEditorState,
  redoProjects,
  undoProjects,
} from './editorState';
import { createDefaultPublishRecord } from './persistence';
import type { BuilderProject } from './types';

const p1: BuilderProject[] = [
  {
    id: 'p1',
    name: 'A',
    pages: [],
    publish: createDefaultPublishRecord(),
    members: [],
  },
];
const p2: BuilderProject[] = [
  {
    id: 'p1',
    name: 'B',
    pages: [],
    publish: createDefaultPublishRecord(),
    members: [],
  },
];
const p3: BuilderProject[] = [
  {
    id: 'p1',
    name: 'C',
    pages: [],
    publish: createDefaultPublishRecord(),
    members: [],
  },
];

describe('editorState', () => {
  it('commits project snapshots into history', () => {
    const s0 = createInitialEditorState(p1);
    const s1 = commitProjects(s0, p2);
    expect(s1.projects[0].name).toBe('B');
    expect(s1.history).toHaveLength(1);
    expect(s1.history[0][0].name).toBe('A');
  });

  it('supports undo and redo across committed snapshots', () => {
    const s0 = createInitialEditorState(p1);
    const s1 = commitProjects(s0, p2);
    const s2 = commitProjects(s1, p3);
    const sUndo = undoProjects(s2);
    const sRedo = redoProjects(sUndo);
    expect(sUndo.projects[0].name).toBe('B');
    expect(sUndo.future[0][0].name).toBe('C');
    expect(sRedo.projects[0].name).toBe('C');
  });
});
