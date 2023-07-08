export const commonFirstItems = (arr: string[][]): string[] => {
  if (!arr.length) return [];
  const first = arr[0];
  const common = [];
  for (let i = 0; i < first.length; i++) {
    const item = first[i];
    if (arr.every(subArray => subArray[i] === item)) {
      common.push(item);
    } else {
      break;
    }
  }
  return common;
}