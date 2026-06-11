import type { Ref } from 'react';

/**
 * Helper to safely assign a node to a React ref.
 * Handles both function refs and object refs (MutableRefObject).
 */
export function assignRef<T>(ref: Ref<T> | undefined, node: T | null) {
  if (typeof ref === 'function') {
    ref(node);
  } else if (ref) {
    (ref as { current: T | null }).current = node;
  }
}
