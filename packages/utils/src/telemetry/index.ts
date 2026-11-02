/**
 * Privacy-First Telemetry & Analytics Module
 *
 * Provides client and server-safe telemetry with strict PII masking,
 * Do-Not-Track compliance, and conversion funnel tracking.
 */

export interface TelemetryEvent {
  name: string;
  properties: Record<string, unknown>;
  timestamp: string;
  appId?: string;
}

export interface TelemetryOptions {
  /** Explicit enable flag. Defaults to true in production, false otherwise. */
  enabled?: boolean;
  /** Application or environment identifier. */
  appId?: string;
  /** Log telemetry dispatches to console when in debug mode. */
  debug?: boolean;
  /** Respect browser Do-Not-Track header (navigator.doNotTrack === '1'). Defaults to true. */
  respectDoNotTrack?: boolean;
  /** Custom subscriber callback (e.g. PostHog, Plausible, or Google Analytics). */
  onEvent?: (event: TelemetryEvent) => void;
}

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const TOKEN_REGEX =
  /(bearer\s+[a-zA-Z0-9._-]+|ghp_[a-zA-Z0-9]+|eyJ[a-zA-Z0-9_-]+)/gi;
const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'secret',
  'apikey',
  'api_key',
  'auth',
  'authorization',
  'accesstoken',
  'access_token',
  'refreshtoken',
  'refresh_token',
  'creditcard',
  'cardnumber',
  'cvv',
]);

/**
 * Recursively redacts PII and sensitive parameters from event payloads.
 */
export function redactPII<T>(value: T): T {
  if (typeof value === 'string') {
    return value
      .replace(EMAIL_REGEX, '[REDACTED_EMAIL]')
      .replace(TOKEN_REGEX, '[REDACTED_TOKEN]') as unknown as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactPII(item)) as unknown as T;
  }

  if (value !== null && typeof value === 'object') {
    const copy: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (SENSITIVE_KEYS.has(k.toLowerCase())) {
        copy[k] = '[REDACTED_SECRET]';
      } else {
        copy[k] = redactPII(v);
      }
    }
    return copy as T;
  }

  return value;
}

class TelemetryManager {
  private options: TelemetryOptions = {
    enabled: false,
    respectDoNotTrack: true,
  };
  private subscribers: Array<(event: TelemetryEvent) => void> = [];

  public init(options: TelemetryOptions = {}): void {
    const isBrowser = typeof window !== 'undefined';
    const globalProcess =
      typeof globalThis !== 'undefined'
        ? (
            globalThis as unknown as {
              process?: { env?: { NODE_ENV?: string } };
            }
          ).process
        : undefined;
    const isProd = globalProcess?.env?.NODE_ENV === 'production';

    const dnt =
      isBrowser &&
      (window.navigator as unknown as { doNotTrack?: string })?.doNotTrack ===
        '1';

    const enabled =
      options.enabled ??
      (isProd && !(options.respectDoNotTrack !== false && dnt));

    this.options = {
      ...options,
      enabled,
      respectDoNotTrack: options.respectDoNotTrack ?? true,
    };

    if (options.onEvent) {
      this.subscribers.push(options.onEvent);
    }
  }

  public isEnabled(): boolean {
    return Boolean(this.options.enabled);
  }

  public subscribe(handler: (event: TelemetryEvent) => void): () => void {
    this.subscribers.push(handler);
    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== handler);
    };
  }

  public track(
    name: string,
    rawProperties: Record<string, unknown> = {}
  ): void {
    if (!this.isEnabled()) {
      if (this.options.debug) {
        console.debug(`[Telemetry:Disabled] ${name}`, rawProperties);
      }
      return;
    }

    const properties = redactPII(rawProperties);
    const event: TelemetryEvent = {
      name,
      properties,
      timestamp: new Date().toISOString(),
      appId: this.options.appId,
    };

    if (this.options.debug) {
      console.info(`[Telemetry:Track] ${name}`, event);
    }

    for (const subscriber of this.subscribers) {
      try {
        subscriber(event);
      } catch (err) {
        if (this.options.debug) {
          console.error('[Telemetry:SubscriberError]', err);
        }
      }
    }
  }

  public trackPageView(path?: string, title?: string): void {
    const isBrowser = typeof window !== 'undefined';
    const pagePath = path ?? (isBrowser ? window.location.pathname : '/');
    const pageTitle = title ?? (isBrowser ? document.title : '');

    this.track('page_view', {
      path: redactPII(pagePath),
      title: redactPII(pageTitle),
    });
  }

  public trackFunnelStep(
    funnelName: string,
    stepName: string,
    stepIndex: number,
    metadata: Record<string, unknown> = {}
  ): void {
    this.track('funnel_step', {
      funnel: funnelName,
      step: stepName,
      stepIndex,
      ...metadata,
    });
  }

  public trackComponentInteraction(
    componentName: string,
    action: string,
    metadata: Record<string, unknown> = {}
  ): void {
    this.track('component_interacted', {
      component: componentName,
      action,
      ...metadata,
    });
  }

  public reset(): void {
    this.options = { enabled: false, respectDoNotTrack: true };
    this.subscribers = [];
  }
}

export const telemetry = new TelemetryManager();

export function initTelemetry(options?: TelemetryOptions): void {
  telemetry.init(options);
}

export function trackEvent(
  name: string,
  properties?: Record<string, unknown>
): void {
  telemetry.track(name, properties);
}

export function trackPageView(path?: string, title?: string): void {
  telemetry.trackPageView(path, title);
}

export function trackFunnelStep(
  funnelName: string,
  stepName: string,
  stepIndex: number,
  metadata?: Record<string, unknown>
): void {
  telemetry.trackFunnelStep(funnelName, stepName, stepIndex, metadata);
}
