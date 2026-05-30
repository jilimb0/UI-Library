import { type BuilderRoute, parseRoute } from './routes';

export function buildBrowserBuilderUrl(route: BuilderRoute): string {
  if (typeof window === 'undefined') return route;
  const path = window.location.pathname;
  const builderIndex = path.indexOf('/builder');
  const builderBase =
    builderIndex === -1
      ? '/builder'
      : path.slice(0, builderIndex + '/builder'.length);

  return route === '/' ? builderBase : `${builderBase}${route}`;
}

export function navigate(path: string) {
  if (typeof window === 'undefined') return;
  window.history.pushState({}, '', buildBrowserBuilderUrl(parseRoute(path)));
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function getBrowserBuilderRoute(): BuilderRoute | null {
  if (typeof window === 'undefined') return null;
  const path = window.location.pathname;
  const builderIndex = path.indexOf('/builder');
  if (builderIndex === -1) return null;

  const builderPath = path.slice(builderIndex + '/builder'.length) || '/';
  return parseRoute(builderPath);
}
