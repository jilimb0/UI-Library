
export function merge<T extends object, U extends object>(target: T, source: U): T & U {
  const output = { ...target } as T & U;
  Object.keys(source).forEach(key => {
    if (source[key as keyof U] instanceof Object && key in target) {
      output[key as keyof T & keyof U] = merge((target as any)[key], (source as any)[key]);
    } else {
      output[key as keyof T & keyof U] = source[key as keyof U];
    }
  });
  return output;
}
