export function merge<T extends object, U extends object>(
  target: T,
  source: U
): T & U {
  const output: T & U = { ...(target as any) };

  (Object.keys(source) as Array<keyof U>).forEach((key) => {
    const sourceValue = source[key];
    const targetValue = (target as any)[key];

    if (sourceValue instanceof Object && key in target) {
      (output as any)[key] = merge(targetValue as any, sourceValue as any);
    } else {
      (output as any)[key] = sourceValue as any;
    }
  });

  return output;
}
