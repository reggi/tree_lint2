export const filterWithout = <T>(...withoutItems: T[]) => (value: T): boolean => {
  return !withoutItems.includes(value);
};

export const arrayWithout = <T>(array: T[], ...withoutItems: T[]): T[] => {
  return array.filter(filterWithout(...withoutItems));
};
