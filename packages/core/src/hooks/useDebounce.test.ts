import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useDebounce } from './useDebounce';

vi.useFakeTimers();

describe('useDebounce', () => {
  it('debounces value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'changed', delay: 500 });
    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(result.current).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('changed');
  });
});
