/**
 * Sliding Window Rate Limiter
 *
 * Provides in-memory sliding window rate limiting for public and AI-heavy endpoints,
 * preventing DoS, credential stuffing, and quota exhaustion.
 */

export interface RateLimiterOptions {
  /** Window duration in milliseconds. Defaults to 60,000 ms (1 minute). */
  windowMs?: number;
  /** Maximum number of allowed requests within the window. Defaults to 60. */
  max?: number;
  /** Custom error message returned when limit is exceeded. */
  message?: string;
  /** Function to extract a unique client identifier (e.g., IP or token). */
  keyGenerator?: (identifier: string) => string;
}

export interface RateLimitResult {
  /** Whether the request is permitted. */
  allowed: boolean;
  /** The maximum limit configured. */
  limit: number;
  /** Number of remaining requests in the current window. */
  remaining: number;
  /** Timestamp in ms when the earliest request in the window expires. */
  resetMs: number;
  /** Number of seconds to wait before retrying (for Retry-After header). */
  retryAfterSeconds: number;
  /** Standard HTTP rate limit headers. */
  headers: {
    'Retry-After'?: string;
    'X-RateLimit-Limit': string;
    'X-RateLimit-Remaining': string;
    'X-RateLimit-Reset': string;
  };
}

export class SlidingWindowRateLimiter {
  private readonly windowMs: number;
  private readonly max: number;
  private readonly message: string;
  private readonly keyGenerator: (id: string) => string;

  /** Map storing request timestamps per key */
  private readonly timestampsByKey: Map<string, number[]> = new Map();
  private lastCleanup: number = Date.now();

  constructor(options: RateLimiterOptions = {}) {
    this.windowMs = options.windowMs ?? 60_000;
    this.max = options.max ?? 60;
    this.message =
      options.message ?? 'Too many requests, please try again later.';
    this.keyGenerator = options.keyGenerator ?? ((id) => id);
  }

  /**
   * Consumes one or more tokens for the given client identifier.
   */
  public consume(rawKey: string, cost = 1, now = Date.now()): RateLimitResult {
    this.periodicCleanup(now);

    const key = this.keyGenerator(rawKey);
    const windowStart = now - this.windowMs;

    let timestamps = this.timestampsByKey.get(key);
    if (!timestamps) {
      timestamps = [];
      this.timestampsByKey.set(key, timestamps);
    }

    // Filter out timestamps outside the active sliding window
    timestamps = timestamps.filter((ts) => ts > windowStart);
    this.timestampsByKey.set(key, timestamps);

    const currentCount = timestamps.length;
    const allowed = currentCount + cost <= this.max;

    if (allowed) {
      for (let i = 0; i < cost; i++) {
        timestamps.push(now);
      }
    }

    const remaining = Math.max(0, this.max - timestamps.length);
    const earliestTimestamp = timestamps[0] ?? now;
    const resetMs = earliestTimestamp + this.windowMs;
    const retryAfterSeconds = allowed
      ? 0
      : Math.max(1, Math.ceil((resetMs - now) / 1000));

    const headers: RateLimitResult['headers'] = {
      'X-RateLimit-Limit': String(this.max),
      'X-RateLimit-Remaining': String(remaining),
      'X-RateLimit-Reset': String(Math.ceil(resetMs / 1000)),
    };

    if (!allowed) {
      headers['Retry-After'] = String(retryAfterSeconds);
    }

    return {
      allowed,
      limit: this.max,
      remaining,
      resetMs,
      retryAfterSeconds,
      headers,
    };
  }

  /**
   * Checks the status without consuming a token.
   */
  public check(rawKey: string, now = Date.now()): RateLimitResult {
    const key = this.keyGenerator(rawKey);
    const windowStart = now - this.windowMs;

    const timestamps = (this.timestampsByKey.get(key) ?? []).filter(
      (ts) => ts > windowStart
    );

    const remaining = Math.max(0, this.max - timestamps.length);
    const allowed = remaining > 0;
    const earliestTimestamp = timestamps[0] ?? now;
    const resetMs = earliestTimestamp + this.windowMs;
    const retryAfterSeconds = allowed
      ? 0
      : Math.max(1, Math.ceil((resetMs - now) / 1000));

    const headers: RateLimitResult['headers'] = {
      'X-RateLimit-Limit': String(this.max),
      'X-RateLimit-Remaining': String(remaining),
      'X-RateLimit-Reset': String(Math.ceil(resetMs / 1000)),
    };

    if (!allowed) {
      headers['Retry-After'] = String(retryAfterSeconds);
    }

    return {
      allowed,
      limit: this.max,
      remaining,
      resetMs,
      retryAfterSeconds,
      headers,
    };
  }

  /**
   * Resets rate limit for a specific key.
   */
  public reset(rawKey: string): void {
    const key = this.keyGenerator(rawKey);
    this.timestampsByKey.delete(key);
  }

  /**
   * Clears all recorded request timestamps.
   */
  public clear(): void {
    this.timestampsByKey.clear();
  }

  /**
   * Periodic eviction of stale keys to prevent memory leaks in long-running processes.
   */
  private periodicCleanup(now: number): void {
    if (now - this.lastCleanup < this.windowMs) return;
    this.lastCleanup = now;

    const cutoff = now - this.windowMs;
    for (const [key, timestamps] of this.timestampsByKey.entries()) {
      const active = timestamps.filter((ts) => ts > cutoff);
      if (active.length === 0) {
        this.timestampsByKey.delete(key);
      } else {
        this.timestampsByKey.set(key, active);
      }
    }
  }

  public getMessage(): string {
    return this.message;
  }
}

/**
 * Standard public API rate limiter: 60 requests per minute.
 */
export function createStandardApiLimiter(
  options?: Partial<RateLimiterOptions>
): SlidingWindowRateLimiter {
  return new SlidingWindowRateLimiter({
    windowMs: 60_000,
    max: 60,
    message: 'Too many API requests. Limit is 60 requests per minute.',
    ...options,
  });
}

/**
 * Heavy / AI operations rate limiter: 10 requests per minute.
 */
export function createHeavyAiLimiter(
  options?: Partial<RateLimiterOptions>
): SlidingWindowRateLimiter {
  return new SlidingWindowRateLimiter({
    windowMs: 60_000,
    max: 10,
    message:
      'AI and heavy computation limit exceeded. Max 10 requests per minute.',
    ...options,
  });
}

/**
 * Strict authentication rate limiter: 5 requests per minute.
 */
export function createAuthLimiter(
  options?: Partial<RateLimiterOptions>
): SlidingWindowRateLimiter {
  return new SlidingWindowRateLimiter({
    windowMs: 60_000,
    max: 5,
    message: 'Too many authentication attempts. Please wait before retrying.',
    ...options,
  });
}
