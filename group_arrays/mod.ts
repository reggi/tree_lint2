function groupArraysByLength(arr: string[][], predicate: (a: number, b: number) => number): string[][] {
  const lengthMap: { [length: number]: string[][] } = {};

  // Group the arrays by length
  for (const group of arr) {
    const length = group.length;
    if (!lengthMap[length]) {
      lengthMap[length] = [group];
    } else {
      lengthMap[length].push(group);
    }
  }

  // Find the target length based on the predicate function
  const lengths = Object.keys(lengthMap).map(Number);
  const targetLength = lengths.reduce(predicate);

  // Return the groups with the target length
  return lengthMap[targetLength];
}
export const groupArraysByShortestLength = (arr: string[][]) => groupArraysByLength(arr, (a, b) => Math.min(a, b))
export const groupArraysByLongestLength = (arr: string[][]) => groupArraysByLength(arr, (a, b) => Math.max(a, b))