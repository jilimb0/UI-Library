import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { afterEach, expect, vi } from 'vitest';

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

// Provide localStorage mock for happy-dom environments that lack it
if (typeof window !== 'undefined' && window.localStorage === undefined) {
  const store: Record<string, string> = {};
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = String(value);
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        for (const k of Object.keys(store)) delete store[k];
      },
      get length() {
        return Object.keys(store).length;
      },
      key: (index: number) => Object.keys(store)[index] ?? null,
    },
    configurable: true,
    writable: true,
  });
}

// Cleanup after each test
afterEach(() => {
  cleanup();
});
