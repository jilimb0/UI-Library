export type BuilderRoute =
  | '/'
  | '/projects'
  | `/projects/${string}`
  | `/projects/${string}/pages/${string}`;

export function parseRoute(path: string): BuilderRoute {
  if (path === '/' || path === '/projects') return path;
  if (path.startsWith('/projects/') && path.includes('/pages/'))
    return path as BuilderRoute;
  if (path.startsWith('/projects/')) return path as BuilderRoute;
  return '/';
}

export function parseEditorRoute(
  path: string
): { projectId: string; pageId: string } | null {
  const match = path.match(/^\/projects\/([^/]+)\/pages\/([^/]+)$/);
  if (!match) return null;
  return { projectId: match[1], pageId: match[2] };
}

export function parseProjectRoute(path: string): { projectId: string } | null {
  const match = path.match(/^\/projects\/([^/]+)$/);
  if (!match) return null;
  return { projectId: match[1] };
}
