
export function arrayUnique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

export const filterUnique = <T>(value: T, index: number, self: T[]): boolean => {
  return self.indexOf(value) === index;
};