export function sort2DArray(arr: string[][]): string[][] {
  return arr.sort((a, b) => a.length - b.length);
}

export function findShortestArray(arr: string[][]): string[] | null {
  if (arr.length === 0) {
      return null;
  }
  const sortedArray = sort2DArray(arr);
  return sortedArray[0];
}

export function findLongestArray(arr: string[][]): string[] | null {
  if (arr.length === 0) {
      return null;
  }
  const sortedArray = sort2DArray(arr);
  return sortedArray[sortedArray.length - 1];
}