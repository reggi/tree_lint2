
export function arrayDuplicates(arr: string[]) {
  const duplicates: Set<string> = new Set();
  const seen: Set<string> = new Set();
  for (const item of arr) {
      if (seen.has(item)) {
          duplicates.add(item);
      } else {
          seen.add(item);
      }
  }
  return Array.from(duplicates);
}