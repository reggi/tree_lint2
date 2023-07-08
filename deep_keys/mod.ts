// deno-lint-ignore-file no-explicit-any

export function deepKeysFlat(obj: any): string[] {
  const seen = new WeakSet();

  function traverse(obj: any): string[] {
      if (typeof obj !== 'object' || obj === null || seen.has(obj)) {
          return [];
      }

      seen.add(obj);
      
      let keys: string[] = [];
      for (const key in obj) {
          keys.push(key);

          const value = obj[key];
          if (typeof value === 'object' && value !== null) {
              keys = keys.concat(traverse(value));
          }
      }
      
      return keys;
  }

  return traverse(obj);
}

export function deepKeysWithParent(obj: any | null, delimiter = '.'): string[] {
  const seen = new WeakSet();

  function traverse(obj: any, parentKey = ''): string[] {
    if (typeof obj !== 'object' || obj === null || seen.has(obj)) {
      return [];
    }

    seen.add(obj);

    let keys: string[] = [];
    for (const key in obj) {
      const currentKey = parentKey ? `${parentKey}${delimiter}${key}` : key;
      keys.push(currentKey);

      const value = obj[key];
      if (typeof value === 'object' && value !== null) {
        keys = keys.concat(traverse(value, currentKey));
      }
    }

    return keys;
  }

  return traverse(obj);
}

export function deepKeys (obj:any, delimiter?: string): string[] {
  return delimiter ? deepKeysWithParent(obj, delimiter) : deepKeysFlat(obj);
}