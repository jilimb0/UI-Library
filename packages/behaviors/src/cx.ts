/**
 * Zero-dependency className utility for behaviors.
 * Filters falsy values and joins with space.
 */
export function cx(
  ...classes: (string | false | null | undefined | 0)[]
): string {
  return classes.filter(Boolean).join(' ');
}
