/**
 * Normalizes aria-orientation value to match React's expected type.
 */
export function normalizeAriaOrientation(
  value: unknown
): 'horizontal' | 'vertical' | undefined {
  if (value === 'horizontal' || value === 'vertical') {
    return value;
  }
  return undefined;
}

/**
 * Normalizes aria-haspopup value to match React's expected type.
 */
export function normalizeAriaHasPopup(
  value: unknown
):
  | boolean
  | 'dialog'
  | 'true'
  | 'false'
  | 'menu'
  | 'listbox'
  | 'tree'
  | 'grid'
  | undefined {
  if (value === true || value === false) {
    return value;
  }
  if (
    value === 'dialog' ||
    value === 'true' ||
    value === 'false' ||
    value === 'menu' ||
    value === 'listbox' ||
    value === 'tree' ||
    value === 'grid'
  ) {
    return value;
  }
  return undefined;
}
