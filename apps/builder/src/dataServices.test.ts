import { describe, expect, it } from 'vitest';
import { createDataServices } from './dataServices';

describe('dataServices', () => {
  it('creates repositories bundle', () => {
    const s = createDataServices();
    expect(typeof s.projects.loadProjects).toBe('function');
    expect(typeof s.comments.listComments).toBe('function');
    expect(typeof s.versions.listVersions).toBe('function');
    expect(typeof s.publishEvents.listEvents).toBe('function');
    expect(typeof s.members.listMembers).toBe('function');
    expect(typeof s.members.saveMembers).toBe('function');
  });
});
