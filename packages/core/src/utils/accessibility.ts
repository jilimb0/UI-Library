/**
 * Accessibility utilities for better user experience
 */

// Re-export the canonical trapFocus from primitives so all packages share one
// implementation. The primitive version handles Tab cycling, Shift+Tab, and an
// optional onEscape callback — a strict superset of the old local version.
export {
  getFocusableElements,
  trapFocus,
} from '@ui-construction-library/primitives';

export function announceToScreenReader(message: string): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

export function getAriaProps(
  props: Record<string, unknown>
): Record<string, unknown> {
  const ariaProps: Record<string, unknown> = {};

  Object.keys(props).forEach((key) => {
    if (key.startsWith('aria-') || key.startsWith('data-')) {
      ariaProps[key] = props[key];
    }
  });

  return ariaProps;
}

export function generateId(prefix: string = 'ui'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}
