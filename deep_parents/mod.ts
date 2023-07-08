import { deepTraverse } from "../deep_traverse/mod.ts"

// deno-lint-ignore no-explicit-any
export const deepParents = (tree: any, nodes: string[]) => {
  const keys: {[key: string]: string[][]} = Object.fromEntries(nodes.map(node => [node, []]))
  deepTraverse(tree, (v) => {
    if (nodes.includes(v.key)) {
      keys[v.key].push(v.parentKey)
    }
    return false
  })
  return Object.entries(keys)
}