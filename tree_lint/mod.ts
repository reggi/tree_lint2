import { absolutePath } from "../abs_path/mod.ts"
import { Tree, TreeOptions } from "../tree/mod.ts"
import { depsToEdges } from "../deps_to_edges/mod.ts"
import { Graph, GraphOptions } from "../graph/mod.ts"
import { ParseFilesOptions, parseFilesSync } from "../parse_files/mod.ts"
import { treeToProject } from "../tree_to_project/mod.ts"
import { walkDir } from "../walk_dir/mod.ts"
import { dirObject } from "./dir_object/mod.ts"

export type TreeLintOptions = GraphOptions & TreeOptions & ParseFilesOptions & {
  extensions?: string[]
  dirname?: string
}

export const treeLint = (filePath: string, options: TreeLintOptions = {}) => {
  filePath = absolutePath(filePath)
  options.dirname = filePath.replace(/\/+$/, '')
  const files = walkDir(filePath, options?.extensions || ['.ts', '.tsx', '.js', '.jsx', '.json'])
  const deps = parseFilesSync(files)
  const keyNodes = Object.keys(deps)
  const edges = depsToEdges(deps)
  const graph = Graph.build(edges, keyNodes, options)
  const results = Tree.build(graph.edges, options)
  const expected = treeToProject(results, options)
  const actual = dirObject(files)
  return {actual, expected}
}
