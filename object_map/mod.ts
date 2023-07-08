
export function objectMap<T, U>(obj: Record<string, T>, fn: (v: [string, T]) => [string, U]): Record<string, U> {
  return Object.fromEntries(Object.entries(obj).map(fn));
}