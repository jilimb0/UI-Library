  it('should handle serialization errors gracefully', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Serialization error');
    });

    act(() => {
      result.current[1]('updated');
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    jest.spyOn(Storage.prototype, 'setItem').mockRestore();
    consoleErrorSpy.mockRestore();
  });  it('should handle serialization errors gracefully', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Serialization error');
    });

    act(() => {
      result.current[1]('updated');
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    jest.spyOn(Storage.prototype, 'setItem').mockRestore();
    consoleErrorSpy.mockRestore();
  });  it('should handle serialization errors gracefully', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Serialization error');
    });

    act(() => {
      result.current[1]('updated');
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    jest.spyOn(Storage.prototype, 'setItem').mockRestore();
    consoleErrorSpy.mockRestore();
  });  it('should handle serialization errors gracefully', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Serialization error');
    });

    act(() => {
      result.current[1]('updated');
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    jest.spyOn(Storage.prototype, 'setItem').mockRestore();
    consoleErrorSpy.mockRestore();
  });  it('should handle serialization errors gracefully', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Serialization error');
    });

    act(() => {
      result.current[1]('updated');
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    jest.spyOn(Storage.prototype, 'setItem').mockRestore();
    consoleErrorSpy.mockRestore();
  });import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  const originalError = console.error;

  beforeEach(() => {
    localStorage.clear();
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalError;
  });

  it('should return initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('test-key')).toBe('"updated"');
  });

  it('should handle function updaters', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 0));

    act(() => {
      result.current[1](prev => prev + 1);
    });

    expect(result.current[0]).toBe(1);
  });

  it('should handle JSON serialization errors gracefully', () => {
    localStorage.setItem('test-key', 'invalid-json');

    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'));
    expect(result.current[0]).toBe('fallback');
    expect(console.error).toHaveBeenCalled();
  });
});