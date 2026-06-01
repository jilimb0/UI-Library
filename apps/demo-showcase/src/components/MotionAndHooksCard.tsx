import {
  Alert,
  Badge,
  Button,
  Card,
  Input,
  Spinner,
  Text,
  useAsync,
  useDebounce,
  useIntersectionObserver,
  useMediaQuery,
  usePrevious,
  useToggle,
} from '@ui-construction-library/core';
import {
  FadeIn as MotionFadeIn,
  SlideIn as MotionSlideIn,
} from '@ui-construction-library/motion';
import { useCallback, useRef, useState } from 'react';
import { SectionIntro } from './SectionIntro';

type AsyncDemoStatus = 'idle' | 'loading' | 'success' | 'error';

const ASYNC_STATUS_LABEL: Record<AsyncDemoStatus, string> = {
  idle: 'Idle',
  loading: 'Loading',
  success: 'Success',
  error: 'Error',
};

export function MotionAndHooksCard() {
  const runAsyncDemo = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 900));
    return 'Async hook resolved a demo payload.';
  }, []);
  const { run, loading } = useAsync(runAsyncDemo);
  const [asyncStatus, setAsyncStatus] = useState<AsyncDemoStatus>('idle');
  const [asyncMessage, setAsyncMessage] = useState(
    'Click "Run async" to fetch demo data.'
  );
  const [search, setSearch] = useState('tokens');
  const debouncedSearch = useDebounce(search, 300);
  const previousSearch = usePrevious(search);
  const isDesktop = useMediaQuery('(min-width: 960px)');
  const [toggled, toggle] = useToggle(true);
  const [motionReplay, setMotionReplay] = useState(0);
  const floatingRef = useRef<HTMLDivElement | null>(null);
  const { isIntersecting, targetRef } = useIntersectionObserver();

  const handleRunAsync = async () => {
    setAsyncStatus('loading');
    setAsyncMessage('Fetching demo payload…');

    try {
      const result = await run();
      setAsyncMessage(result);
      setAsyncStatus('success');
    } catch (err) {
      setAsyncMessage(
        err instanceof Error ? err.message : 'Async hook failed. Try again.'
      );
      setAsyncStatus('error');
    }
  };

  return (
    <Card className="panel" id="hooks">
      <SectionIntro
        eyebrow="Hooks and motion"
        title="Utilities and transitions are part of the core layer"
        description="The project already ships useful hooks and motion primitives. This section turns them into visible product proof instead of keeping them hidden in source code."
      />

      <div className="stack">
        <div className="feature-grid feature-grid--three">
          <Card className="compact-panel stack-tight">
            <Text className="eyebrow">useAsync</Text>
            <div
              className="row wrap-row"
              style={{ alignItems: 'center', gap: 10 }}
              role="status"
              aria-live="polite"
            >
              <Badge
                variant={
                  asyncStatus === 'success'
                    ? 'success'
                    : asyncStatus === 'error'
                      ? 'error'
                      : asyncStatus === 'loading'
                        ? 'warning'
                        : 'default'
                }
              >
                {ASYNC_STATUS_LABEL[asyncStatus]}
              </Badge>
              {loading ? <Spinner size={20} /> : null}
            </div>
            <Text>{asyncMessage}</Text>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void handleRunAsync()}
              disabled={loading}
              loading={loading}
            >
              {loading ? 'Running…' : 'Run async'}
            </Button>
          </Card>
          <Card className="compact-panel">
            <Text className="eyebrow">useDebounce</Text>
            <Input
              label="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Text className="text-muted">Live: {search}</Text>
            <Text className="text-muted">Debounced: {debouncedSearch}</Text>
            <Text className="text-muted">
              Previous: {previousSearch ?? '—'}
            </Text>
          </Card>
          <Card className="compact-panel">
            <Text className="eyebrow">Responsive signal</Text>
            <Text>
              {isDesktop ? 'Desktop layout active' : 'Compact layout active'}
            </Text>
          </Card>
        </div>

        <div className="row wrap-row">
          <Button
            variant="outline"
            onClick={() => setMotionReplay((value) => value + 1)}
          >
            Replay motion
          </Button>
        </div>

        <div className="feature-grid feature-grid--dual">
          <MotionFadeIn key={`fade-${motionReplay}`}>
            <div className="motion-band stack-tight">
              <Text className="eyebrow">MotionFadeIn</Text>
              <Text>
                Fade primitives help present success states, callouts and
                section reveals without custom wiring in every screen.
              </Text>
              <Text className="text-muted">
                Useful for inline confirmations, staged reveals and product
                moments that need soft emphasis instead of abrupt appearance.
              </Text>
            </div>
          </MotionFadeIn>

          <MotionSlideIn key={`slide-${motionReplay}`} direction="right">
            <div className="motion-band stack-tight">
              <Text className="eyebrow">MotionSlideIn</Text>
              <Text>
                Slide transitions can frame onboarding, drawers and inline
                workflow hints as part of the same UI system.
              </Text>
              <Text className="text-muted">
                The same primitive can support panels, guided setup flows and
                contextual handoffs between product states.
              </Text>
            </div>
          </MotionSlideIn>
        </div>

        <div className="feature-grid feature-grid--three">
          <Card className="compact-panel">
            <Text className="eyebrow">Fade preset</Text>
            <Text className="text-muted">
              Reusable animation props reduce duplicate Framer Motion wiring in
              app screens and docs surfaces.
            </Text>
          </Card>
          <Card className="compact-panel">
            <Text className="eyebrow">Slide preset</Text>
            <Text className="text-muted">
              Directional transitions give drawers, prompts and helper panels a
              consistent movement language.
            </Text>
          </Card>
          <Card className="compact-panel">
            <Text className="eyebrow">Core utility</Text>
            <Text className="text-muted">
              Motion ships as part of the component system, so teams can treat
              it like another typed primitive instead of ad-hoc animation glue.
            </Text>
          </Card>
        </div>

        <Alert variant="success" title="Motion primitives">
          Motion props are available as reusable building blocks rather than
          one-off showcase animations. This demo now shows how fade and slide
          presets map to real product states.
        </Alert>

        <div className="showcase-grid">
          <div
            className="observer-band stack-tight"
            ref={targetRef as React.RefObject<HTMLDivElement>}
          >
            <Text className="eyebrow">Intersection observer</Text>
            <Text>
              {isIntersecting
                ? 'The observed block is visible.'
                : 'Scroll this block into view.'}
            </Text>
          </div>

          {toggled ? (
            <div className="floating-inspector stack-tight" ref={floatingRef}>
              <Text className="eyebrow">useClickOutside + useToggle</Text>
              <Text>
                Click anywhere outside this card to dismiss it. This pattern is
                useful for menus, inspectors and quick action trays.
              </Text>
            </div>
          ) : (
            <Button variant="outline" onClick={() => toggle()}>
              Re-open floating inspector
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
