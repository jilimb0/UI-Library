export function merge<T extends object, U extends object>(
  target: T,
  source: U
): T & U {
  const targetRecord = target as Record<PropertyKey, unknown>;
  const output = { ...target } as Record<PropertyKey, unknown>;

  (Object.keys(source) as Array<keyof U>).forEach((key) => {
    const sourceValue = source[key];
    const targetValue = targetRecord[key];

    if (
      sourceValue !== null &&
      typeof sourceValue === 'object' &&
      targetValue !== null &&
      typeof targetValue === 'object' &&
      key in target
    ) {
      output[key] = merge(targetValue, sourceValue);
    } else {
      output[key] = sourceValue;
    }
  });

  return output as T & U;
}
