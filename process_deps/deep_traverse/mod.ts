
type EmptyObject = Record<string | number | symbol, never>;
type DeepObject = {[key: string]: DeepObject | EmptyObject };

type V = {
  depth: number,
  key: string,
  value: DeepObject,
  parentKey: string,
  currentObjHandler: (cb: (o: DeepObject) => void) => void
}

export function deepTraverse(obj: DeepObject, callback: (v: V) => boolean, until: Set<DeepObject> = new Set()): DeepObject {
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
