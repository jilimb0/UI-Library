const FOCUSABLE =
  'a[href],button:not([disabled]),textarea,input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute('disabled') && el.tabIndex !== -1
  );
}

export function trapFocus(container: HTMLElement, onEscape?: () => void) {
  const focusables = getFocusableElements(container);
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  first?.focus();

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onEscape?.();
      return;
    }
    if (event.key !== 'Tab' || focusables.length === 0) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  document.addEventListener('keydown', onKeyDown);
  return () => document.removeEventListener('keydown', onKeyDown);
}
