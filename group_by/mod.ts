export function groupBy<T>(array: T[], getKey: (item: T) => string | null): { [key: string]: T[] } {
  const groups: { [key: string]: T[] } = {};
  for (const item of array) {
    const key = getKey(item);
    if (key === null) continue;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
  }
  return groups;
}
