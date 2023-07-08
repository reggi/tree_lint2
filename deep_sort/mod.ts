type Sortable = { [key: string]: Sortable } | Sortable[] | null | string | number | boolean;

export function deepSort(obj: Sortable): Sortable {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(deepSort);
  }
  const sortedKeys = Object.keys(obj).sort();
  return sortedKeys.reduce((sortedObj: { [key: string]: Sortable }, key: string) => {
    sortedObj[key] = deepSort(obj[key]);
    return sortedObj;
  }, {});
}