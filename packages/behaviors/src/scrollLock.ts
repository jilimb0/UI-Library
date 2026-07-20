/**
 * Body scroll lock utility — prevents background scrolling when overlays are open.
 *
 * Applies `overflow: hidden` to `document.body` and tracks stack depth
 * so multiple overlays (e.g., modal on top of modal) manage scroll correctly.
 *
 * Returns a cleanup function that decrements the stack and restores
 * scroll only when all overlays are closed.
 */

let scrollLockCount = 0;
let originalOverflow = '';

export function lockBodyScroll(): () => void {
  if (scrollLockCount === 0) {
    originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  scrollLockCount++;

  return () => {
    scrollLockCount = Math.max(0, scrollLockCount - 1);
    if (scrollLockCount === 0) {
      document.body.style.overflow = originalOverflow;
      originalOverflow = '';
    }
  };
}
