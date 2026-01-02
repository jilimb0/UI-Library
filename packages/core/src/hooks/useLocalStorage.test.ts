import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with default value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('should update state and localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('test-key')).toBe('"updated"');
  });

  it('should handle JSON serialization errors gracefully', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Serialization error');
    });

    act(() => {
      result.current[1]('updated');
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    setItemSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
});
