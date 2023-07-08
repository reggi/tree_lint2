
// deno-lint-ignore-file no-explicit-any
export function deepDelete(obj: any, keys: string[], opts?: {
  keepKeys?: boolean,
  ignoreNodes?: string[]
}): void {
  const keepKeys = opts?.keepKeys ?? false;
  const ignoreNodes = opts?.ignoreNodes || [];
  keys.forEach((key) => {
    if (obj[key] !== undefined) {
      if (keepKeys) {
        obj[key] = {};
      } else {
        delete obj[key];
      }
    }
    for (const objKey in obj) {
      if (ignoreNodes.includes(objKey)) {
        continue;
      }
      if (typeof obj[objKey] === 'object' && obj[objKey] !== null) {
        deepDelete(obj[objKey], keys, opts);
      }
    }
  });
}

export function deepDeleteOptim(obj: any, keys: string[], opts?: {
  keepKeys?: boolean,
  ignoreNodes?: string[]
}): void {
  const keepKeys = opts?.keepKeys ?? false;
  const ignoreNodes = new Set(opts?.ignoreNodes || []);
  const keysToDelete = new Set(keys);
  
  for (const key in obj) {
    if (!ignoreNodes.has(key) && typeof obj[key] === 'object' && obj[key] !== null) {
      if (keysToDelete.has(key)) {
        if (keepKeys) {
          obj[key] = {};
        } else {
          delete obj[key];
        }
      }
      deepDeleteOptim(obj[key], keys, opts);
    }
  }
}

export const shallowDelete = (obj: any, pair: string[]) => {
  const parent = pair[0];
  const child = pair[1];
  if (obj[parent]) {
    if (obj[parent][child]) {
      obj[parent][child] = {}
      if (Object.keys(obj[parent]).length === 0) {
        obj[parent] = {};
      }
    }
  }
}