import { describe, expect, it } from 'vitest';
import {
  createAuthLimiter,
  createHeavyAiLimiter,
  createStandardApiLimiter,
  SlidingWindowRateLimiter,
} from './rateLimiter';

describe('SlidingWindowRateLimiter', () => {
  it('allows requests within the configured max limit', () => {
    const limiter = new SlidingWindowRateLimiter({
      windowMs: 60_000,
      max: 3,
    });

    const now = 1_000_000;
    const res1 = limiter.consume('client-1', 1, now);
    expect(res1.allowed).toBe(true);
    expect(res1.remaining).toBe(2);
    expect(res1.headers['Retry-After']).toBeUndefined();

    const res2 = limiter.consume('client-1', 1, now + 100);
    expect(res2.allowed).toBe(true);
    expect(res2.remaining).toBe(1);

    const res3 = limiter.consume('client-1', 1, now + 200);
    expect(res3.allowed).toBe(true);
    expect(res3.remaining).toBe(0);

    // 4th request exceeds max
    const res4 = limiter.consume('client-1', 1, now + 300);
    expect(res4.allowed).toBe(false);
    expect(res4.remaining).toBe(0);
    expect(res4.retryAfterSeconds).toBeGreaterThan(0);
    expect(res4.headers['Retry-After']).toBeDefined();
  });

  it('slides the window and frees up quota after windowMs elapses', () => {
    const limiter = new SlidingWindowRateLimiter({
      windowMs: 10_000,
      max: 2,
    });

    const t0 = 100_000;
    limiter.consume('user-a', 1, t0);
    limiter.consume('user-a', 1, t0 + 2_000);

    // Exceeded at t0 + 3s
    const blocked = limiter.consume('user-a', 1, t0 + 3_000);
    expect(blocked.allowed).toBe(false);

    // After 10.1s from first request, first request slides out of window
    const allowedAfterSlide = limiter.consume('user-a', 1, t0 + 10_100);
    expect(allowedAfterSlide.allowed).toBe(true);
    expect(allowedAfterSlide.remaining).toBe(0); // second request (t0+2000) and this new one (t0+10100)
  });

  it('isolates different clients by key', () => {
    const limiter = new SlidingWindowRateLimiter({
      windowMs: 60_000,
      max: 1,
    });

    const now = 50_000;
    expect(limiter.consume('ip-1', 1, now).allowed).toBe(true);
    expect(limiter.consume('ip-1', 1, now).allowed).toBe(false);

    // Separate IP is permitted
    expect(limiter.consume('ip-2', 1, now).allowed).toBe(true);
  });

  it('provides configured presets for standard API, heavy AI, and auth', () => {
    const apiLimiter = createStandardApiLimiter();
    expect(apiLimiter.consume('ip').limit).toBe(60);

    const aiLimiter = createHeavyAiLimiter();
    expect(aiLimiter.consume('ip').limit).toBe(10);

    const authLimiter = createAuthLimiter();
    expect(authLimiter.consume('ip').limit).toBe(5);
  });

  it('allows resetting limit for a key', () => {
    const limiter = new SlidingWindowRateLimiter({ max: 1 });
    limiter.consume('user-1');
    expect(limiter.check('user-1').allowed).toBe(false);

    limiter.reset('user-1');
    expect(limiter.check('user-1').allowed).toBe(true);
  });
});
