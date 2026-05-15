import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'localStorage',
      (() => {
        let store: Record<string, string> = {};
        return {
          getItem: (key: string) => store[key] ?? null,
          setItem: (key: string, value: string) => {
            store[key] = value;
          },
          removeItem: (key: string) => {
            delete store[key];
          },
          clear: () => {
            store = {};
          },
          get length() {
            return Object.keys(store).length;
          },
          key: (i: number) => Object.keys(store)[i] ?? null,
        };
      })()
    );
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
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const setItemSpy = vi
      .spyOn(localStorage, 'setItem')
      .mockImplementation(() => {
        throw new Error('Serialization error');
      });

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    setItemSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
});
