import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { axe, toHaveNoViolations } from 'jest-axe';

// Provide Jest-like globals for legacy tests
(globalThis as any).jest = {
  fn: vi.fn,
  spyOn: vi.spyOn,
  useFakeTimers: vi.useFakeTimers,
  useRealTimers: vi.useRealTimers,
  runAllTimers: vi.runAllTimers,
  advanceTimersByTime: vi.advanceTimersByTime,
  clearAllTimers: vi.clearAllTimers,
};

// Some tests call axe() without importing it
(globalThis as any).axe = axe;

// Extend Vitest expect with jest-dom + jest-axe matchers
expect.extend(matchers);
expect.extend(toHaveNoViolations);

// Cleanup after each test
afterEach(() => {
  cleanup();
});
