import { describe, expect, it } from 'vitest';
import { sanitizeProject } from './schemaGuard';

describe('Schema Guard corruption protection', () => {
  it('correctly handles undefined, null, or malformed project roots', () => {
    const resultNull = sanitizeProject(null);
    expect(resultNull.project.id).toBe('recovered-project');
    expect(resultNull.issues.length).toBeGreaterThan(0);

    const resultString = sanitizeProject('corrupt data');
    expect(resultString.project.name).toBe('Recovered Project');
    expect(resultString.issues.length).toBeGreaterThan(0);
  });

  it('preserves valid structures and filters circular node references', () => {
    const circularNode: any = {
      id: 'node-1',
      componentId: 'card',
      props: { text: 'Valid scalar text' },
      children: [],
    };
    circularNode.children.push(circularNode); // circular reference

    const projectInput = {
      id: 'my-project',
      name: 'My Custom App',
      publish: {
        status: 'published',
        publishedAt: '2026-05-29T10:00:00Z',
        publishedBy: 'user-1',
        sourceVersionId: 'v1',
      },
      members: [
        { userId: 'user-1', email: 'user1@example.com', role: 'admin' },
      ],
      pages: [
        {
          id: 'page-1',
          title: 'Dashboard page',
          root: {
            id: 'root-node',
            componentId: 'card',
            props: { title: 'Analytics', complexObj: { key: 'val' } },
            children: [circularNode],
          },
        },
      ],
    };

    const { project, issues } = sanitizeProject(projectInput);

    expect(project.id).toBe('my-project');
    expect(project.name).toBe('My Custom App');
    expect(project.publish.status).toBe('published');
    expect(project.members).toHaveLength(1);
    expect(project.pages).toHaveLength(1);

    const root = project.pages[0]?.root;
    expect(root?.props.title).toBe('Analytics');
    // Verify non-scalar prop is stripped
    expect(root?.props.complexObj).toBeUndefined();
    // Verify circular reference is handled (the child is stripped or doesn't have recursive children pointing to itself)
    const child = root?.children[0];
    expect(child?.id).toBe('node-1');
    expect(child?.children).toHaveLength(0); // circular child is stripped

    expect(
      issues.some(
        (issue) => issue.includes('circular') || issue.includes('Circular')
      )
    ).toBe(true);
    expect(issues.some((issue) => issue.includes('non-scalar'))).toBe(true);
  });
});
