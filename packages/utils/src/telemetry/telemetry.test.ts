import { beforeEach, describe, expect, it } from 'vitest';
import {
  initTelemetry,
  redactPII,
  telemetry,
  trackEvent,
  trackFunnelStep,
  trackPageView,
} from './index';

describe('Telemetry & Analytics Module', () => {
  beforeEach(() => {
    telemetry.reset();
  });

  it('redacts sensitive information like emails, auth tokens and passwords', () => {
    const raw = {
      userEmail: 'alice.smith@company.org',
      token: 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      password: 'super-secret-password',
      safeField: 'dashboard_view',
      nested: {
        contact: 'support@domain.co.uk',
        apiKey: 'ghp_1234567890abcdef',
      },
    };

    const sanitized = redactPII(raw);

    expect(sanitized.userEmail).toBe('[REDACTED_EMAIL]');
    expect(sanitized.password).toBe('[REDACTED_SECRET]');
    expect(sanitized.token).toBe('[REDACTED_SECRET]');
    expect(sanitized.safeField).toBe('dashboard_view');
    expect(sanitized.nested.contact).toBe('[REDACTED_EMAIL]');
    expect(sanitized.nested.apiKey).toBe('[REDACTED_SECRET]');
  });

  it('does not dispatch events when disabled', () => {
    let captured: any = null;
    initTelemetry({
      enabled: false,
      onEvent: (e) => {
        captured = e;
      },
    });

    trackEvent('test_click', { button: 'cta' });
    expect(captured).toBeNull();
    expect(telemetry.isEnabled()).toBe(false);
  });

  it('dispatches sanitized events to subscribers when enabled', () => {
    const events: any[] = [];
    initTelemetry({
      enabled: true,
      appId: 'ui-library-showcase',
      onEvent: (e) => events.push(e),
    });

    trackPageView('/showcase', 'Showcase View');
    trackFunnelStep('checkout', 'pricing_selected', 1, {
      tier: 'enterprise',
      email: 'buyer@corp.com',
    });

    expect(events.length).toBe(2);
    expect(events[0].name).toBe('page_view');
    expect(events[0].properties.path).toBe('/showcase');

    expect(events[1].name).toBe('funnel_step');
    expect(events[1].properties.funnel).toBe('checkout');
    expect(events[1].properties.step).toBe('pricing_selected');
    expect(events[1].properties.email).toBe('[REDACTED_EMAIL]');
  });

  it('redacts multiple emails and preserves trailing punctuation', () => {
    expect(redactPII('Contact alice@company.org.')).toBe(
      'Contact [REDACTED_EMAIL].'
    );
    expect(redactPII('a@b.co and c.d+1@sub.domain.org')).toBe(
      '[REDACTED_EMAIL] and [REDACTED_EMAIL]'
    );
  });

  it('does not redact invalid @ tokens', () => {
    expect(redactPII('hello @ world')).toBe('hello @ world');
    expect(redactPII('foo@bar')).toBe('foo@bar');
    expect(redactPII('foo@.com')).toBe('foo@.com');
    expect(redactPII('@example.com')).toBe('@example.com');
  });

  it('redacts in linear time without ReDoS on adversarial inputs', () => {
    const start = performance.now();
    const percents = '%'.repeat(100_000);
    const dots = `a@${'.'.repeat(50_000)}`;
    expect(redactPII(percents)).toBe(percents);
    expect(redactPII(dots)).toBe(dots);
    expect(performance.now() - start).toBeLessThan(100);
  });
});
