import {
  Badge,
  Button,
  Card,
  Heading,
  Text,
} from '@ui-construction-library/core';
import { lazy, Suspense, useState } from 'react';
import { flagshipFlows } from '../flagshipFlows';

const SaasLandingDemo = lazy(() =>
  import('./SaasLandingDemo').then((m) => ({
    default: m.SaasLandingDemo,
  }))
);
const DashboardShellDemo = lazy(() =>
  import('./DashboardShellDemo').then((m) => ({
    default: m.DashboardShellDemo,
  }))
);
const SettingsAppDemo = lazy(() =>
  import('./SettingsAppDemo').then((m) => ({
    default: m.SettingsAppDemo,
  }))
);
const DocsPageDemo = lazy(() =>
  import('./DocsPageDemo').then((m) => ({ default: m.DocsPageDemo }))
);
const PricingSiteDemo = lazy(() =>
  import('./PricingSiteDemo').then((m) => ({
    default: m.PricingSiteDemo,
  }))
);

const flowDemoMap: Record<string, React.ComponentType> = {
  'saas-landing': SaasLandingDemo,
  'dashboard-shell': DashboardShellDemo,
  'settings-app': SettingsAppDemo,
  'docs-page': DocsPageDemo,
  'pricing-site': PricingSiteDemo,
};

export function FlagshipFlowsSection() {
  const [selectedFlowId, setSelectedFlowId] = useState(flagshipFlows[0].id);
  const [showDemo, setShowDemo] = useState(false);
  const selectedFlow =
    flagshipFlows.find((flow) => flow.id === selectedFlowId) ??
    flagshipFlows[0];

  const DemoComponent = flowDemoMap[selectedFlow.id];

  return (
    <section id="flagship-flows" className="flagship-shell">
      <div className="stack stack-tight flagship-intro">
        <Text className="eyebrow">Flagship flows</Text>
        <Heading as="h2" className="section-heading flagship-heading">
          Five proof flows that show the product end to end
        </Heading>
        <Text className="section-description flagship-description">
          Each flow is represented as prompt input, builder state, exported
          artifact, and runnable demo. The set is meant to prove that the system
          is more than isolated components: it can carry a product idea from
          generation through publishing with predictable output.
        </Text>
      </div>

      <div className="flagship-layout">
        <div className="flagship-rail">
          {flagshipFlows.map((flow, index) => {
            const active = flow.id === selectedFlow.id;
            return (
              <button
                key={flow.id}
                type="button"
                className={active ? 'flagship-chip active' : 'flagship-chip'}
                onClick={() => {
                  setSelectedFlowId(flow.id);
                  setShowDemo(false);
                }}
                aria-pressed={active}
              >
                <span className="flagship-chip-index">0{index + 1}</span>
                <span className="flagship-chip-copy">
                  <strong>{flow.name}</strong>
                  <small>{flow.audience}</small>
                </span>
              </button>
            );
          })}
        </div>

        <Card className="flagship-detail">
          <div className="flagship-detail__header">
            <div className="stack stack-tight">
              <Text className="eyebrow">Selected flow</Text>
              <Heading as="h3" className="card-title">
                {selectedFlow.name}
              </Heading>
            </div>
            <Badge variant="default">{selectedFlow.audience}</Badge>
          </div>

          <div className="flagship-grid">
            <div className="flagship-panel">
              <Text className="eyebrow">Prompt input</Text>
              <Text className="flagship-copy">{selectedFlow.promptInput}</Text>
            </div>
            <div className="flagship-panel">
              <Text className="eyebrow">Builder state</Text>
              <Text className="flagship-copy">{selectedFlow.builderState}</Text>
            </div>
            <div className="flagship-panel">
              <Text className="eyebrow">Exported artifact</Text>
              <Text className="flagship-copy">
                {selectedFlow.exportedArtifact}
              </Text>
            </div>
            <div className="flagship-panel">
              <Text className="eyebrow">Runnable demo</Text>
              <Text className="flagship-copy">{selectedFlow.runnableDemo}</Text>
            </div>
          </div>

          <div className="flagship-proof">
            {selectedFlow.proofPoints.map((proof) => (
              <Badge key={proof}>{proof}</Badge>
            ))}
          </div>

          <div style={{ marginTop: '1rem' }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDemo((prev) => !prev)}
            >
              {showDemo ? 'Hide live demo' : 'View live demo'}
            </Button>
          </div>

          {showDemo && DemoComponent && (
            <div
              style={{
                marginTop: '1rem',
                padding: '1rem',
                borderRadius: 'var(--radius)',
                border: '1px dashed var(--border)',
                background: 'var(--card)',
              }}
            >
              <Suspense fallback={<Text>Loading demo…</Text>}>
                <DemoComponent />
              </Suspense>
            </div>
          )}
        </Card>
      </div>

      <div className="flagship-summary-grid">
        {flagshipFlows.map((flow) => (
          <Card key={flow.id} className="flagship-summary">
            <Text className="eyebrow">{flow.name}</Text>
            <Text className="text-muted">{flow.audience}</Text>
            <div className="flagship-summary__line" />
            <Text className="flagship-copy">{flow.promptInput}</Text>
          </Card>
        ))}
      </div>
    </section>
  );
}
