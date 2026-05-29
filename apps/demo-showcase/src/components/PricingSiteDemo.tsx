import {
  Badge,
  Button,
  Card,
  Heading,
  Icon,
  Text,
} from '@ui-construction-library/core';

const TIERS = [
  {
    name: 'Starter',
    price: '$0',
    period: 'forever',
    features: ['Up to 3 projects', 'Community support', 'Basic analytics'],
    cta: 'Get started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/mo',
    features: [
      'Unlimited projects',
      'Priority support',
      'Advanced analytics',
      'SSO',
    ],
    cta: 'Start trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    features: ['Dedicated infra', 'SLA', 'Audit logs', 'Custom contracts'],
    cta: 'Contact sales',
    highlighted: false,
  },
];

export function PricingSiteDemo() {
  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <Heading as="h3">Simple, transparent pricing</Heading>
        <Text style={{ color: 'var(--muted-foreground)', marginTop: '0.5rem' }}>
          Start free and scale as your team grows.
        </Text>
      </div>

      {/* Tiers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
        }}
      >
        {TIERS.map((tier) => (
          <Card
            key={tier.name}
            className="p-5"
            style={{
              display: 'grid',
              gap: '0.75rem',
              borderColor: tier.highlighted ? 'var(--primary)' : undefined,
              borderWidth: tier.highlighted ? '2px' : undefined,
            }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Heading as="h4">{tier.name}</Heading>
              {tier.highlighted && <Badge>Popular</Badge>}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.25rem',
              }}
            >
              <Text style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                {tier.price}
              </Text>
              <Text
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--muted-foreground)',
                }}
              >
                {tier.period}
              </Text>
            </div>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'grid',
                gap: '0.375rem',
              }}
            >
              {tier.features.map((feature) => (
                <li
                  key={feature}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    fontSize: '0.875rem',
                  }}
                >
                  <Icon
                    name="check"
                    size={14}
                    style={{ color: 'var(--success)' }}
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              variant={tier.highlighted ? 'default' : 'outline'}
              style={{ marginTop: '0.5rem' }}
            >
              {tier.cta}
            </Button>
          </Card>
        ))}
      </div>

      {/* Trust */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
        }}
      >
        <Icon name="star" size={16} style={{ color: 'var(--warning)' }} />
        <Text
          style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}
        >
          Trusted by 2,000+ teams worldwide
        </Text>
      </div>
    </div>
  );
}
