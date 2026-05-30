import { type RefObject, useEffect, useRef } from 'react';

export function useFocus<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.focus();
  }, []);

  return ref;
}
