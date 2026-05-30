import { Card, Heading, Text } from '@ui-construction-library/core';
import { SectionIntro } from './SectionIntro';

const integrationPackages = [
  '@ui-construction-library/react-hook-form',
  '@ui-construction-library/integration-tanstack-query',
  '@ui-construction-library/integration-tanstack-router',
  '@ui-construction-library/integration-i18n',
  '@ui-construction-library/integration-next',
] as const;

export function IntegrationsSection() {
  return (
    <section id="integrations" className="stack">
      <SectionIntro
        eyebrow="Integrations"
        title="Framework adapters make the library more than a component bundle"
        description="Separate integration packages are a differentiator. They deserve a visible place in the public demo because they communicate maturity and practical adoption paths."
      />
      <div className="feature-grid feature-grid--three">
        {integrationPackages.map((pkg) => (
          <Card key={pkg} className="panel compact-panel">
            <Text className="eyebrow">Package</Text>
            <Heading as="h3" className="card-title">
              {pkg}
            </Heading>
          </Card>
        ))}
      </div>
    </section>
  );
}
