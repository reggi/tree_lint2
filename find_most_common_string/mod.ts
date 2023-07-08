export function findMostCommonString(arr: string[]): string {
  if (arr.length === 0) {
    throw new Error("Input array must not be empty.");
  }
  const stringOccurrences: { [key: string]: number } = {};
  let mostCommonString = arr[0];
  let maxCount = 1;

  for (const str of arr) {
    if (stringOccurrences[str]) {
      stringOccurrences[str]++;
    } else {
      stringOccurrences[str] = 1;
    }

    if (stringOccurrences[str] > maxCount) {
      mostCommonString = str;
      maxCount = stringOccurrences[str];
    }
  }

  return mostCommonString;
}