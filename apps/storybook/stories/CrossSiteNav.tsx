import { Button, Card, Link, Text } from '@ui-construction-library/core';

export interface CrossSiteNavProps {
  demoHref?: string;
  docsHref?: string;
  storybookHref?: string;
  current?: 'demo' | 'docs' | 'storybook';
}

export function CrossSiteNav({
  demoHref = '../',
  docsHref = '../docs/',
  storybookHref = '../storybook/',
  current,
}: CrossSiteNavProps) {
  return (
    <Card className="surface-panel" style={{ padding: '1rem 1.25rem' }}>
      <div
        className="inline-cluster"
        style={{ justifyContent: 'space-between', width: '100%' }}
      >
        <div className="stack-vertical" style={{ gap: '0.25rem' }}>
          <Text className="field-label" style={{ textTransform: 'none' }}>
            Cross-site navigation
          </Text>
          <Text className="field-hint">
            Move between demo, docs and Storybook without losing theme context.
          </Text>
        </div>
        <div className="inline-cluster">
          {current !== 'demo' ? (
            <Link href={demoHref}>
              <Button variant="ghost" size="sm">
                Open demo
              </Button>
            </Link>
          ) : null}
          {current !== 'docs' ? (
            <Link href={docsHref}>
              <Button variant="ghost" size="sm">
                Open docs
              </Button>
            </Link>
          ) : null}
          {current !== 'storybook' ? (
            <Link href={storybookHref}>
              <Button size="sm">Open Storybook</Button>
            </Link>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
