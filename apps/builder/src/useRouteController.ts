import { useEffect, useState } from 'react';
import {
  buildBrowserBuilderUrl,
  getBrowserBuilderRoute,
} from './builderNavigation';
import type { BuilderRoute } from './routes';
import { parseRoute } from './routes';
import type { SessionRepository } from './types';

export function useRouteController({
  sessionRepository,
  onPopState,
}: {
  sessionRepository: SessionRepository;
  onPopState: () => void;
}) {
  const [route, setRoute] = useState<BuilderRoute>(() => {
    const browserRoute = getBrowserBuilderRoute();
    if (browserRoute && browserRoute !== '/') return browserRoute;
    if (
      typeof window !== 'undefined' &&
      window.location.search.includes('landing=true')
    ) {
      return '/';
    }
    const savedRoute = sessionRepository.loadRoute();
    if (savedRoute) return parseRoute(savedRoute);
    return '/projects';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const browserRoute = getBrowserBuilderRoute();
    if (browserRoute !== route) {
      window.history.replaceState(null, '', buildBrowserBuilderUrl(route));
    }
  }, [route]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onPopState = () => {
      setRoute(getBrowserBuilderRoute() ?? '/projects');
      onPopState();
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [onPopState]);

  return { route, setRoute };
}
