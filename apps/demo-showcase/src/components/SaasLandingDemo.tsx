import {
  Badge,
  Button,
  Card,
  Heading,
  Icon,
  Text,
} from '@ui-construction-library/core';

export function SaasLandingDemo() {
  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {/* Hero */}
      <div
        style={{
          textAlign: 'center',
          padding: '2rem 1rem',
          borderRadius: 'var(--radius)',
          background:
            'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
          color: 'var(--primary-foreground)',
        }}
      >
        <Heading as="h2" style={{ color: 'inherit' }}>
          Analytics that drive revenue
        </Heading>
        <Text style={{ marginTop: '0.5rem', opacity: 0.9 }}>
          Turn raw data into actionable insights for your operations team.
        </Text>
        <div
          style={{
            marginTop: '1rem',
            display: 'flex',
            gap: '0.5rem',
            justifyContent: 'center',
          }}
        >
          <Button variant="secondary">Start free trial</Button>
          <Button
            variant="outline"
            style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'inherit' }}
          >
            View demo
          </Button>
        </div>
      </div>

      {/* Social proof */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}
        >
          Trusted by teams at
        </Text>
        {['Acme Corp', 'Globex', 'Initech', 'Hooli'].map((name) => (
          <Badge key={name}>{name}</Badge>
        ))}
      </div>

      {/* Feature grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
        }}
      >
        {[
          {
            icon: 'star',
            title: 'Real-time dashboards',
            desc: 'Live KPIs without refresh.',
          },
          {
            icon: 'users',
            title: 'Team collaboration',
            desc: 'Share insights and comment.',
          },
          {
            icon: 'check',
            title: 'Export ready',
            desc: 'PDF, CSV, and API access.',
          },
        ].map((f) => (
          <Card
            key={f.title}
            className="p-4"
            style={{ display: 'grid', gap: '0.5rem' }}
          >
            <Icon
              name={f.icon as any}
              size={20}
              style={{ color: 'var(--primary)' }}
            />
            <Text style={{ fontWeight: 600 }}>{f.title}</Text>
            <Text
              style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}
            >
              {f.desc}
            </Text>
          </Card>
        ))}
      </div>

      {/* Pricing teaser */}
      <Card
        className="p-5"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div>
          <Heading as="h4">Pro plan</Heading>
          <Text
            style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}
          >
            Everything in Starter plus team workspaces, SSO, and priority
            support.
          </Text>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Text style={{ fontSize: '1.5rem', fontWeight: 700 }}>$49/mo</Text>
          <Button size="sm">Upgrade</Button>
        </div>
      </Card>
    </div>
  );
}
