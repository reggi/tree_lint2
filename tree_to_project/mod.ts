import { deepMap } from "../deep_map/mod.ts";
import { projectName, ProjectNameOptions } from "../project_name/mod.ts";
export type { ProjectNameOptions }

// deno-lint-ignore no-explicit-any
const removeKey = (obj: any, key: string) => {
  // First, clone the object so that we do not modify the original
  const newObj = { ...obj };
  // Then, delete the key from the cloned object
  delete newObj[key];
  // Return the modified object
  return newObj;
}

// deno-lint-ignore no-explicit-any
const nugget = (value: any, dirname: string, fileName: string) => {
  const valueDir = value[dirname] || {}
  if (valueDir) {
    const v = removeKey(value, dirname)
    return { [dirname]: { ...v, ...valueDir, [fileName]: {} } }
  }
  return {[dirname]: { ...value, [fileName]: {} }}
}

export const treeToProject = (tree: Record<string, unknown>, opts?: ProjectNameOptions) => {
  return deepMap(tree, (key, value) => {
    if (typeof key === 'symbol') return {[key]: value}
    const i = projectName(key, opts)
    return nugget(value, i.dir, i.file)
  });
}
