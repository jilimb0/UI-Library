export function merge(target, source) {
  const targetRecord = target;
  const output = { ...target };
  Object.keys(source).forEach((key) => {
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
  return output;
}
