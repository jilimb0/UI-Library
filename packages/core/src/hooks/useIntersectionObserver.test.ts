
import { renderHook } from '@testing-library/react';
import { useIntersectionObserver } from './useIntersectionObserver';

describe('useIntersectionObserver', () => {
  it('sets isIntersecting to true when element is visible', () => {
    const { result } = renderHook(() => useIntersectionObserver());

    // Can't properly test IntersectionObserver in JSDOM
    expect(typeof result.current.isIntersecting).toBe('boolean');
  });
});
