
type DeepObject = Record<string, any>;

type V = {
  depth: number,
  key: string,
  value: any,
  parentKey: string,
  currentObjHandler: (cb: (o: any) => void) => void
}

export function deepTraverse(obj: DeepObject, callback: (v: V) => boolean, until: Set<any> = new Set()): DeepObject {
  let done = false
  const traverse = (currentObj: DeepObject, depth = 0, parentKey = "$"): void => {
    if (done) return;
    for (const key in currentObj) {
      const value = currentObj[key];
      if (typeof value === 'object' && value !== null) {
        if (until.has(value)) continue; // Skip circular elements
        until.add(value); // Add current object to the set
        traverse(value, depth + 1, `${parentKey}.${key}`);
        until.delete(value); // Remove current object from the set after traversal
      }
    }

    for (const key in currentObj) {
      const value = currentObj[key];
      done = callback({
        depth,
        key,
        value,
        parentKey: `${parentKey}.${key}`,
        currentObjHandler: (x) => {
          return x(currentObj)
        }
      })
      if (done) break;
    }
  };

  traverse(obj);
  return obj;
}
