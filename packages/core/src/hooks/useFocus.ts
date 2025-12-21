
import { useEffect, useRef } from 'react';

export function useFocus() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const handleFocus = () => {
      console.log('Element focused');
    };

    const element = ref.current;
    element.addEventListener('focus', handleFocus);

    return () => {
      element.removeEventListener('focus', handleFocus);
    };
  }, []);

  return ref;
}
