function findSharedElements(arr: string[][]): string[] {
  if (!arr || !arr[0]) {
    return [];
  }

  const sharedElements: string[] = [];
  const firstArray: string[] = arr[0];

  for (let i = 0; i < firstArray.length; i++) {
    const element: string = firstArray[i];
    
    for (let j = 1; j < arr.length; j++) {
      if (i >= arr[j].length || arr[j][i] !== element) {
        return sharedElements;
      }
    }
    
    sharedElements.push(element);
  }

  return sharedElements;
}

export function findSharedPrefix(strings: string[]) {
  return findSharedElements(strings.map(s => s.split('.'))).join('.')
}
